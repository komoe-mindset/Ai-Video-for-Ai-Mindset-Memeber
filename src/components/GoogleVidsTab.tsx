import React, { useState, useMemo, useCallback } from 'react';
import {
  Presentation,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Sparkles,
  ArrowRight,
  MonitorPlay,
  Volume2,
  Layers,
  Film,
  UserCheck,
  FileText,
  Sliders,
} from 'lucide-react';
import { GoogleVidsScene } from '../types';
import { generateGoogleVidsScenes, countBurmeseSyllables } from '../utils/burmeseUtils';

export interface GoogleVidsTabProps {
  script?: string;
  confirmedScript?: string;
  onShowToast: (msg: string) => void;
  onSwitchTab: (tab: string) => void;
}

interface SceneCardProps {
  scene: GoogleVidsScene;
  totalScenes: number;
  activeFilter: 'all' | 'visual' | 'notes';
  onCopy: (text: string, successMsg: string) => Promise<boolean>;
}

// Memoized SceneCard to avoid re-rendering all scene cards when copying or updating individual items
const SceneCard: React.FC<SceneCardProps> = React.memo(
  ({ scene, totalScenes, activeFilter, onCopy }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const syllables = useMemo(
      () => countBurmeseSyllables(scene.narration),
      [scene.narration]
    );

    const isVisualVisible = activeFilter === 'all' || activeFilter === 'visual';
    const isNotesVisible = activeFilter === 'all' || activeFilter === 'notes';

    const handleFieldCopy = async (
      text: string,
      successMsg: string,
      fieldId: string
    ) => {
      const ok = await onCopy(text, successMsg);
      if (ok) {
        setCopiedField(fieldId);
        setTimeout(() => {
          setCopiedField((prev) => (prev === fieldId ? null : prev));
        }, 2000);
      }
    };

    const handleCopyBundle = () => {
      const formatted = `=== SLIDE ${scene.sceneNumber}: ${scene.title} (~${scene.estDuration}s) ===

[SLIDE VISUAL DIRECTIVE]:
${scene.slideVisual}

[ON-SCREEN TEXT]:
${scene.onScreenText}

[SPEAKER NOTES (BURMESE TTS)]:
${scene.narration}

[AVATAR GESTURE PROMPT]:
${scene.avatarMotion}`;

      handleFieldCopy(
        formatted,
        `အခန်း ${scene.sceneNumber} ၏ Slide & Notes အချက်အလက်များ ကူးယူပြီးပါပြီ! ✨`,
        'bundle'
      );
    };

    return (
      <article
        role="listitem"
        className="glass-card rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 flex flex-col gap-4 transition hover:border-slate-700/80 shadow-sm"
      >
        {/* Card Header: Scene Badge, Title, Duration & Individual Copy Bundle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
              အခန်း {scene.sceneNumber} / {totalScenes}
            </span>

            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {scene.title}
            </h3>

            <span className="inline-flex items-center gap-1 text-[11px] text-amber-200 bg-amber-950/90 border border-amber-500/40 px-2.5 py-1 rounded-md font-mono">
              <Clock className="w-3 h-3 text-amber-300" aria-hidden="true" />
              <span>~{scene.estDuration} စက္ကန့် ({scene.estDuration}s)</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] text-slate-200 bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded-md">
              <span>{syllables} ဝဏ္ဏ</span>
            </span>
          </div>

          {/* Individual Single Scene Copy Button */}
          <button
            type="button"
            onClick={handleCopyBundle}
            className={`self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 border focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              copiedField === 'bundle'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/70'
            }`}
            aria-label={`အခန်း ${scene.sceneNumber} ၏ Slide Visual၊ On-Screen စာသား နှင့် Speaker Notes အားလုံး ကူးယူရန်`}
          >
            {copiedField === 'bundle' ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                <span>ကူးယူပြီးပါပြီ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>Slide & Notes ကူးယူမည်</span>
              </>
            )}
          </button>
        </div>

        {/* Section 1: Visual Layout Directive (English Prompt for Google Slides / Canvas) */}
        {isVisualVisible && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MonitorPlay className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>Slide Visual Composition Directive (English Layout & Attire):</span>
              </span>

              <button
                type="button"
                onClick={() =>
                  handleFieldCopy(
                    scene.slideVisual,
                    `အခန်း ${scene.sceneNumber} ၏ Visual Directive ကို ကူးယူပြီးပါပြီ!`,
                    'visual'
                  )
                }
                className="text-[11px] text-slate-400 hover:text-emerald-400 transition cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 focus-visible:ring-1 focus-visible:ring-emerald-400"
                aria-label={`အခန်း ${scene.sceneNumber} Visual Directive ကူးယူရန်`}
              >
                {copiedField === 'visual' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" aria-hidden="true" />
                    <span>Copy Visual</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 font-mono leading-relaxed select-text">
              {scene.slideVisual}
            </div>
          </div>
        )}

        {/* Section 2: On-Screen Text & Speaker Notes (Pure Burmese voiceover) */}
        {isNotesVisible && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* On-Screen Text (Concise bullet/title) - 4 cols */}
            <div className="md:col-span-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
                  <span>On-Screen Slide Text:</span>
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleFieldCopy(
                      scene.onScreenText,
                      `အခန်း ${scene.sceneNumber} On-screen စာသား ကူးယူပြီးပါပြီ!`,
                      'onscreen'
                    )
                  }
                  className="text-[11px] text-slate-400 hover:text-teal-400 transition cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 focus-visible:ring-1 focus-visible:ring-teal-400"
                  aria-label={`အခန်း ${scene.sceneNumber} On-Screen စာသား ကူးယူရန်`}
                >
                  {copiedField === 'onscreen' ? (
                    <>
                      <Check className="w-3 h-3 text-teal-400" aria-hidden="true" />
                      <span className="text-teal-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" aria-hidden="true" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs font-burmese text-emerald-200 leading-relaxed min-h-[72px] flex items-center">
                {scene.onScreenText}
              </div>
            </div>

            {/* Speaker Notes (Pure Burmese voiceover narration) - 8 cols */}
            <div className="md:col-span-8 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                  <span>Speaker Notes (Pure Burmese TTS Narration):</span>
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleFieldCopy(
                      scene.narration,
                      `အခန်း ${scene.sceneNumber} Speaker Notes (မြန်မာစကားပြော) ကူးယူပြီးပါပြီ!`,
                      'narration'
                    )
                  }
                  className="text-[11px] text-slate-400 hover:text-indigo-400 transition cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 focus-visible:ring-1 focus-visible:ring-indigo-400"
                  aria-label={`အခန်း ${scene.sceneNumber} Speaker Notes မြန်မာစကားပြော ကူးယူရန်`}
                >
                  {copiedField === 'narration' ? (
                    <>
                      <Check className="w-3 h-3 text-indigo-400" aria-hidden="true" />
                      <span className="text-indigo-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" aria-hidden="true" />
                      <span>Copy Notes</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs sm:text-sm font-burmese text-slate-200 leading-relaxed min-h-[72px]">
                {scene.narration}
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Avatar Action & Gesture Prompt (English prompt for Hedra/Runway/Google Vids) */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Avatar Action & Gesture Directive (Hedra / Runway / Google Vids):</span>
            </span>

            <button
              type="button"
              onClick={() =>
                handleFieldCopy(
                  scene.avatarMotion,
                  `အခန်း ${scene.sceneNumber} ၏ Avatar Action ကို ကူးယူပြီးပါပြီ!`,
                  'avatar'
                )
              }
              className="text-[11px] text-slate-400 hover:text-amber-400 transition cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 focus-visible:ring-1 focus-visible:ring-amber-400"
              aria-label={`အခန်း ${scene.sceneNumber} Avatar Action Prompt ကူးယူရန်`}
            >
              {copiedField === 'avatar' ? (
                <>
                  <Check className="w-3 h-3 text-amber-400" aria-hidden="true" />
                  <span className="text-amber-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" aria-hidden="true" />
                  <span>Copy Action</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed">
            {scene.avatarMotion}
          </div>
        </div>
      </article>
    );
  }
);

SceneCard.displayName = 'SceneCard';

export const GoogleVidsTab: React.FC<GoogleVidsTabProps> = ({
  script,
  confirmedScript,
  onShowToast,
  onSwitchTab,
}) => {
  // Extract normalized script input
  const effectiveScript = useMemo(() => {
    return (confirmedScript || script || '').trim();
  }, [confirmedScript, script]);

  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [manualRegenKey, setManualRegenKey] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'visual' | 'notes'>('all');

  // 1. Performance & Memoization: Wrap scene generation in useMemo
  const scenes: GoogleVidsScene[] = useMemo(() => {
    if (!effectiveScript) return [];
    return generateGoogleVidsScenes(effectiveScript);
    // manualRegenKey enables manual refresh if triggered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveScript, manualRegenKey]);

  // Total presentation metrics
  const totalDuration = useMemo(() => {
    return scenes.reduce((acc, curr) => acc + curr.estDuration, 0);
  }, [scenes]);

  const totalSyllables = useMemo(() => {
    return scenes.reduce((acc, curr) => acc + countBurmeseSyllables(curr.narration), 0);
  }, [scenes]);

  // 2. Robust Clipboard Operations with fallback and user guidance
  const handleCopy = useCallback(
    async (text: string, successMsg: string): Promise<boolean> => {
      if (!text) return false;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          onShowToast(successMsg);
          return true;
        }
        throw new Error('Clipboard API unavailable or unsecure context');
      } catch (err) {
        console.warn('Clipboard write failed, attempting fallback', err);
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          textArea.setAttribute('readonly', '');
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
            onShowToast(successMsg);
            return true;
          }
          throw new Error('execCommand copy returned false');
        } catch (fallbackErr) {
          console.error('Fallback copy error', fallbackErr);
          onShowToast('စာသား ကူးယူမှု မအောင်မြင်ပါ။ လက်ဖြင့် ကူးယူပေးပါ');
          return false;
        }
      }
    },
    [onShowToast]
  );

  // Copy full storyboard formatted for Google Slides / Notion / Docs
  const handleCopyAllForSlides = useCallback(async () => {
    if (scenes.length === 0) return;

    const formatted = scenes
      .map((scene) => {
        return `================================================
SLIDE ${scene.sceneNumber}: ${scene.title}
Estimated Duration: ~${scene.estDuration}s (${countBurmeseSyllables(scene.narration)} syllables)
================================================

[16:9 PRESENTATION SLIDE VISUAL DIRECTIVE]:
${scene.slideVisual}

[ON-SCREEN TEXT / BULLET]:
${scene.onScreenText}

[SPEAKER NOTES / BURMESE TTS VOICE-OVER]:
${scene.narration}

[AVATAR GESTURE & CAMERA ACTION (Hedra / Runway / Google Vids)]:
${scene.avatarMotion}
`;
      })
      .join('\n\n');

    const ok = await handleCopy(
      formatted,
      'Google Slides & Vids အတွက် အခန်းအားလုံးကို ကူးယူပြီးပါပြီ! 📋'
    );
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  }, [scenes, handleCopy]);

  const handleRegenerate = useCallback(() => {
    setManualRegenKey((k) => k + 1);
    onShowToast('Storyboard အခန်းများကို အသစ်တစ်ဖန် ပြန်လည်တွက်ချက်ပြီးပါပြီ! 🔄');
  }, [onShowToast]);

  return (
    <div
      role="region"
      aria-label="Google Flow & Google Vids Multi-Scene Storyboard"
      className="flex flex-col gap-5 sm:gap-6 animate-fadeIn"
    >
      {/* Header Section */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 via-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner"
            aria-hidden="true"
          >
            <Presentation className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-burmese">
                Google Flow: Script မှ Google Slides & Google Vids သို့ တိုက်ရိုက်ပြောင်းလဲခြင်း
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                Multi-Scene Storyboard
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-burmese leading-relaxed">
              ရေးသားထားသော မြန်မာ Script ကို ၃ မှ ၅ အခန်းအထိ Slide ပုံစံများ၊ မြန်မာရိုးရာဝတ်စုံနှင့် Avatar
              လှုပ်ရှားမှု Prompt များအဖြစ် အလိုအလျောက် ခွဲခြမ်းထုတ်ယူပေးပါသည်
            </p>
          </div>
        </div>

        {/* Badges / Specs Pill with WCAG AA Compliant High Contrast */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-200 shrink-0">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1.5 text-slate-200">
            <MonitorPlay className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>16:9 Widescreen</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1.5 text-slate-200">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            <span>Myanmar Cultural Attire</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1.5 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
            <span>~3.5 Syl/Sec TTS</span>
          </span>
        </div>
      </div>

      {/* 4. EMPTY STATE: When script is empty, render helpful guidance card */}
      {!effectiveScript ? (
        <div
          role="status"
          className="glass-card p-8 sm:p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 mb-1"
            aria-hidden="true"
          >
            <FileText className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="max-w-md">
            <h3 className="text-base sm:text-lg font-bold text-white font-burmese">
              ဇာတ်ညွှန်း Script ထည့်သွင်းထားခြင်း မရှိသေးပါ
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-burmese leading-relaxed">
              Google Slides & Google Vids အတွက် အခန်းခွဲ Storyboard အလိုအလျောက် ထုတ်ယူနိုင်ရန်
              အဆင့် ၂ (Script & စကားပြော) တွင် အကြောင်းအရာ ရေးသားထားရန် လိုအပ်ပါသည်ခင်ဗျာ။
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => onSwitchTab('script')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm transition shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 font-burmese"
              aria-label="Script ရေးသားရန် သွားမည်"
            >
              <span>Script ရေးသားရန် သွားမည်</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        /* MAIN CONTENT STATE */
        <div className="flex flex-col gap-5">
          {/* Top Action Bar & Overview Stats */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            {/* Storyboard Summary Metrics with WCAG AA compliance */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 text-emerald-300 font-semibold">
                <Layers className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>စုစုပေါင်း {scenes.length} အခန်း (Scenes)</span>
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-amber-200 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                <span>ခန့်မှန်းကြာချိန် ~{totalDuration} စက္ကန့်</span>
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                <span>စုစုပေါင်း {totalSyllables} ဝဏ္ဏ (Syllables)</span>
              </span>
            </div>

            {/* View Filter Toggles & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Density / Field Filter */}
              <div
                role="group"
                aria-label="အချက်အလက် စစ်ထုတ်ကြည့်ရှုရန်"
                className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-pressed={activeFilter === 'all'}
                  aria-label="အားလုံးပြရန် (Show all fields)"
                >
                  အားလုံးပြရန်
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('visual')}
                  className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                    activeFilter === 'visual'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-pressed={activeFilter === 'visual'}
                  aria-label="Slide Layout သာပြရန် (Show visual layout only)"
                >
                  Slide Layout
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('notes')}
                  className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                    activeFilter === 'notes'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-pressed={activeFilter === 'notes'}
                  aria-label="Speaker Notes သာပြရန် (Show speaker notes only)"
                >
                  Speaker Notes
                </button>
              </div>

              {/* Regenerate Button */}
              <button
                type="button"
                onClick={handleRegenerate}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 font-burmese"
                aria-label="Storyboard အခန်းများကို အသစ်တစ်ဖန် ပြန်လည်တွက်ချက်မည်"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                <span>ပြန်လည်စစ်ဆေးတွက်ချက်မည်</span>
              </button>

              {/* Copy All Scenes Button */}
              <button
                type="button"
                onClick={handleCopyAllForSlides}
                className={`px-3.5 py-2 rounded-xl font-medium text-xs transition flex items-center gap-2 cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-emerald-400 font-burmese ${
                  copiedAll
                    ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                }`}
                aria-label="Google Slides အတွက် အခန်းအားလုံးကို ကူးယူမည်"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>အားလုံး ကူးယူပြီးပါပြီ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Google Slides အတွက် အားလုံး ကူးယူမည်</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Accessibility (WAI-ARIA): List of Interactive Scene Cards with aria-live="polite" */}
          <div
            role="list"
            aria-live="polite"
            aria-label="Google Slides & Vids Multi-Scene Cards"
            className="flex flex-col gap-4 sm:gap-5"
          >
            {scenes.map((scene) => (
              <SceneCard
                key={scene.sceneNumber}
                scene={scene}
                totalScenes={scenes.length}
                activeFilter={activeFilter}
                onCopy={handleCopy}
              />
            ))}
          </div>

          {/* Bottom Workflow Guide Helper */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-950/60 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-burmese">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span className="leading-relaxed">
                အကြံပြုချက်: Google Slides ထဲတွင် 16:9 Presentation ဆလိုက်များ ဖန်တီးပြီး Speaker Notes ထဲသို့
                မြန်မာစကားပြော (TTS Text) ကို ထည့်သွင်းကာ Google Vids သို့မဟုတ် Video Editor များတွင် Avatar နှင့် တွဲဖက် အသုံးပြုနိုင်ပါသည်ခင်ဗျာ။
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyAllForSlides}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-sans transition cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Google Slides အတွက် အခန်းအားလုံး ပုံစံပြည့် ကူးယူမည်"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Copy All Format</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleVidsTab;

