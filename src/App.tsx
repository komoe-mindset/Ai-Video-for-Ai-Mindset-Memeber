import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { TabNav, TabKey } from './components/TabNav';
import { GemGuideModal } from './components/GemGuideModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ToastContainer } from './components/Toast';
import { ReferenceToolsBar } from './components/ReferenceToolsBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TabLoadingSkeleton } from './components/TabLoadingSkeleton';
import {
  AvatarConfig,
  ScriptConfig,
  ActionVariation,
  ChunkViewMode,
  VideoChunk,
  ToastNotification,
} from './types';
import { DEFAULT_AVATAR_CONFIG, INITIAL_SCRIPT_CONFIG } from './data/presets';
import {
  buildEnglishAvatarPrompt,
  chunkScriptFor8Seconds,
  generateLocalScripts,
} from './utils/burmeseUtils';

// 1. Dynamic code-splitting for tab components
const AvatarTab = lazy(() =>
  import('./components/AvatarTab').then((m) => ({ default: m.AvatarTab }))
);
const ScriptTab = lazy(() =>
  import('./components/ScriptTab').then((m) => ({ default: m.ScriptTab }))
);
const VideoChunkerTab = lazy(() =>
  import('./components/VideoChunkerTab').then((m) => ({
    default: m.VideoChunkerTab,
  }))
);
const GuideTab = lazy(() =>
  import('./components/GuideTab').then((m) => ({ default: m.GuideTab }))
);

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabKey>('avatar');

  // Avatar State
  const [avatarConfig, setAvatarConfig] =
    useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);

  // Script State (Lightweight static initialization without heavy computations)
  const [scriptConfig, setScriptConfig] =
    useState<ScriptConfig>(INITIAL_SCRIPT_CONFIG);

  // Video Chunker State (Deferred computation on initial load)
  const [chunkerScript, setChunkerScript] = useState<string>(
    INITIAL_SCRIPT_CONFIG.optionB
  );
  const [chunkVariation, setChunkVariation] =
    useState<ActionVariation>('dynamic');
  const [chunkViewMode, setChunkViewMode] = useState<ChunkViewMode>('step');
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);
  const [chunks, setChunks] = useState<VideoChunk[]>([]);

  // Defer chunking until user navigates to video tab
  useEffect(() => {
    if (activeTab === 'video' && chunks.length === 0 && chunkerScript) {
      setChunks(chunkScriptFor8Seconds(chunkerScript, chunkVariation));
    }
  }, [activeTab, chunks.length, chunkerScript, chunkVariation]);

  // Modals & UI State
  const [isGemModalOpen, setIsGemModalOpen] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [hasServerAi, setHasServerAi] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Check server API status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasKey) {
          setHasServerAi(true);
        }
      })
      .catch(() => {
        setHasServerAi(false);
      });
  }, []);

  // Toast helper
  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  // Clipboard copy helper with fallback for iframes
  const handleCopy = useCallback(
    (text: string, message: string) => {
      if (!text) return;
      setCopiedKey(text);
      setTimeout(() => {
        setCopiedKey((curr) => (curr === text ? null : curr));
      }, 2000);

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            showToast(message);
          })
          .catch(() => {
            fallbackCopy(text, message);
          });
      } else {
        fallbackCopy(text, message);
      }
    },
    [showToast]
  );

  const fallbackCopy = (text: string, message: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(message);
    } catch {
      showToast('ကူးယူခြင်း မအောင်မြင်ပါ', 'warning');
    }
    document.body.removeChild(textArea);
  };

  // Re-calculate video chunks
  const handleRunChunker = useCallback(() => {
    const calculated = chunkScriptFor8Seconds(chunkerScript, chunkVariation);
    setChunks(calculated);
    setCurrentChunkIndex(0);
    showToast(
      calculated.length > 0
        ? `၈ စက္ကန့်စာ အပိုင်း ${calculated.length} ခု ခွဲခြမ်းပြီးပါပြီ!`
        : 'ခွဲခြမ်းရန် စာသား ထည့်သွင်းပါ'
    );
  }, [chunkerScript, chunkVariation, showToast]);

  // Transition from Script Tab to Chunker Tab
  const handleSendToChunker = (text: string) => {
    setChunkerScript(text);
    const calculated = chunkScriptFor8Seconds(text, chunkVariation);
    setChunks(calculated);
    setCurrentChunkIndex(0);
    setActiveTab('video');
    showToast('Script ကို ၈ စက္ကန့် စနစ်သို့ ပို့ဆောင်ပြီးပါပြီ');
  };

  // Gemini AI: Enhance Avatar Prompt
  const handleEnhanceAvatarPrompt = async () => {
    setIsEnhancing(true);
    const currentPrompt = buildEnglishAvatarPrompt(avatarConfig);

    try {
      const response = await fetch('/api/gemini/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrompt: currentPrompt,
          style: avatarConfig.style,
          characterDetails: avatarConfig.customDetail,
        }),
      });

      if (!response.ok) {
        throw new Error('API request returned non-OK status');
      }

      const data = await response.json();
      if (data.refinedPrompt) {
        setAvatarConfig((prev) => ({
          ...prev,
          customDetail:
            prev.customDetail +
            ', volumetric cinematic light, Hasselblad medium format detail, realistic micro-pores',
        }));
        showToast('Gemini AI ဖြင့် Prompt ကို ပိုမိုလှပစေရန် အဆင့်မြှင့်တင်လိုက်ပါပြီ! ✨');
      } else {
        fallbackEnhancePrompt();
      }
    } catch {
      fallbackEnhancePrompt();
    } finally {
      setIsEnhancing(false);
    }
  };

  const fallbackEnhancePrompt = () => {
    setAvatarConfig((prev) => {
      const add =
        ', volumetric soft god rays, Hasselblad H6D-100c detail, realistic skin texture';
      if (!prev.customDetail.includes('volumetric')) {
        return { ...prev, customDetail: prev.customDetail + add };
      }
      return prev;
    });
    showToast('Prompt တွင် Cinematic Modifiers များ ထပ်မံထည့်သွင်းပြီးပါပြီ!');
  };

  // Gemini AI: Generate Scripts
  const handleGenerateScriptWithAI = async () => {
    setIsGeneratingScript(true);
    try {
      const response = await fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: scriptConfig.topic,
          tone: scriptConfig.tone,
          lang: scriptConfig.lang,
        }),
      });

      if (!response.ok) {
        throw new Error('Script generation failed');
      }

      const data = await response.json();
      if (data.optionA && data.optionB) {
        setScriptConfig((prev) => ({
          ...prev,
          optionA: data.optionA,
          optionB: data.optionB,
        }));
        showToast('Gemini AI ဖြင့် Script အသစ် ၂ မျိုးကို ဖန်တီးပေးပြီးပါပြီ! 🎙️');
      } else {
        fallbackGenerateScript();
      }
    } catch {
      fallbackGenerateScript();
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const fallbackGenerateScript = () => {
    const local = generateLocalScripts(
      scriptConfig.topic,
      scriptConfig.tone,
      scriptConfig.lang
    );
    setScriptConfig((prev) => ({
      ...prev,
      optionA: local.optionA,
      optionB: local.optionB,
    }));
    showToast('Script များကို သင့်တော်သော လေသံဖြင့် အသင့်ပြင်ဆင်ပေးထားပါသည်');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white pb-12">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} />

      {/* Top Navigation */}
      <Navbar
        onOpenGemModal={() => setIsGemModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        hasServerAi={hasServerAi}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        {/* Step Progress Tabs */}
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Quick Reference Tools Bar */}
        <ReferenceToolsBar />

        {/* Tab Content Display with Error Boundary and Suspense code-splitting */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="w-full outline-none"
        >
          <ErrorBoundary
            fallbackTitle="ဤအပိုင်းကို ဖွင့်ရာတွင် အမှားဖြစ်ပေါ်ခဲ့ပါသည်"
            onReset={() => setActiveTab('avatar')}
          >
            <Suspense fallback={<TabLoadingSkeleton />}>
              {activeTab === 'avatar' && (
                <AvatarTab
                  config={avatarConfig}
                  onChange={setAvatarConfig}
                  onGoToScript={() => setActiveTab('script')}
                  onCopy={handleCopy}
                  onEnhanceWithAI={handleEnhanceAvatarPrompt}
                  isEnhancing={isEnhancing}
                  copiedKey={copiedKey}
                />
              )}

              {activeTab === 'script' && (
                <ScriptTab
                  config={scriptConfig}
                  onChange={setScriptConfig}
                  onSendToChunker={handleSendToChunker}
                  onGenerateAI={handleGenerateScriptWithAI}
                  isGenerating={isGeneratingScript}
                  onCopy={handleCopy}
                  copiedKey={copiedKey}
                />
              )}

              {activeTab === 'video' && (
                <VideoChunkerTab
                  scriptText={chunkerScript}
                  onScriptChange={setChunkerScript}
                  variation={chunkVariation}
                  onVariationChange={setChunkVariation}
                  onRunChunker={handleRunChunker}
                  chunks={chunks}
                  viewMode={chunkViewMode}
                  onViewModeChange={setChunkViewMode}
                  currentStepIndex={currentChunkIndex}
                  onStepChange={setCurrentChunkIndex}
                  onCopy={handleCopy}
                  copiedKey={copiedKey}
                />
              )}

              {activeTab === 'guide' && (
                <GuideTab
                  onCopy={handleCopy}
                  copiedKey={copiedKey}
                  onOpenGemModal={() => setIsGemModalOpen(true)}
                />
              )}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      {/* Modals */}
      <GemGuideModal
        isOpen={isGemModalOpen}
        onClose={() => setIsGemModalOpen(false)}
        onCopy={handleCopy}
        copiedKey={copiedKey}
      />

      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        hasServerAi={hasServerAi}
      />
    </div>
  );
}
