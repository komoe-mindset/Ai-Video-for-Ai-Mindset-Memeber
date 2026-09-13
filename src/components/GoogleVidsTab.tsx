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
  Eye,
  Sliders,
} from 'lucide-react';
import { GoogleVidsScene } from '../types';
import { generateGoogleVidsScenes, countBurmeseSyllables } from '../utils/burmeseUtils';

export interface GoogleVidsTabProps {
  script: string;
  onShowToast: (msg: string) => void;
  onSwitchTab: (tab: string) => void;
}

export const GoogleVidsTab: React.FC<GoogleVidsTabProps> = ({
  script,
  onShowToast,
  onSwitchTab,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [manualRegenCount, setManualRegenCount] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'visual' | 'notes'>('all');

  // Parse scenes from script with re-calculation dependency on manual count
  const scenes: GoogleVidsScene[] = useMemo(() => {
    if (!script || !script.trim()) return [];
    // generateGoogleVidsScenes groups script sentences into 3 to 5 scenes
    return generateGoogleVidsScenes(script);
    // manualRegenCount forces re-memoization if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script, manualRegenCount]);

  // Total presentation metrics
  const totalDuration = useMemo(() => {
    return scenes.reduce((acc, curr) => acc + curr.estDuration, 0);
  }, [scenes]);

  const totalSyllables = useMemo(() => {
    return scenes.reduce((acc, curr) => acc + countBurmeseSyllables(curr.narration), 0);
  }, [scenes]);

  // Robust clipboard copy with iframe fallback
  const handleCopy = useCallback(
    (text: string, successMsg: string, id: string) => {
      if (!text) return;
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);

      const notify = () => onShowToast(successMsg);

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(notify)
          .catch(() => fallbackCopy(text, notify));
      } else {
        fallbackCopy(text, notify);
      }
    },
    [onShowToast]
  );

  const fallbackCopy = (text: string, onSuccess: () => void) => {
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
      onSuccess();
    } catch {
      onShowToast('ကူးယူခြင်း မအောင်မြင်ပါ');
    }
    document.body.removeChild(textArea);
  };

  // Copy full storyboard formatted for Google Slides / Notion / Docs
  const handleCopyAllForSlides = () => {
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

    handleCopy(
      formatted,
      'Google Slides & Vids အတွက် အခန်းအားလုံးကို ကူးယူပြီးပါပြီ! 📋',
      'copy_all_scenes'
    );
  };

  // Copy single scene formatted bundle
  const handleCopySingleSceneBundle = (scene: GoogleVidsScene) => {
    const formatted = `=== SLIDE ${scene.sceneNumber}: ${scene.title} (~${scene.estDuration}s) ===

[SLIDE VISUAL DIRECTIVE]:
${scene.slideVisual}

[ON-SCREEN TEXT]:
${scene.onScreenText}

[SPEAKER NOTES (BURMESE TTS)]:
${scene.narration}

[AVATAR GESTURE PROMPT]:
${scene.avatarMotion}`;

    handleCopy(
      formatted,
      `အခန်း ${scene.sceneNumber} ၏ Slide & Notes အချက်အလက်များ ကူးယူပြီးပါပြီ! ✨`,
      `scene_bundle_${scene.sceneNumber}`
    );
  };

  const handleRegenerate = () => {
    setManualRegenCount((c) => c + 1);
    onShowToast('Storyboard အခန်းများကို အသစ်တစ်ဖန် ပြန်လည်တွက်ချက်ပြီးပါပြီ! 🔄');
  };

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
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Google Flow: Script မှ Google Slides & Google Vids သို့ တိုက်ရိုက်ပြောင်းလဲခြင်း
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Multi-Scene Storyboard
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-burmese leading-relaxed">
              ရေးသားထားသော မြန်မာ Script ကို ၃ မှ ၅ အခန်းအထိ Slide ပုံစံများ၊ မြန်မာရိုးရာဝတ်စုံနှင့် Avatar
              လှုပ်ရှားမှု Prompt များအဖြစ် အလိုအလျောက် ခွဲခြမ်းထုတ်ယူပေးပါသည်
            </p>
          </div>
        </div>

        {/* Badges / Specs Pill */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 shrink-0">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
            <MonitorPlay className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>16:9 Widescreen</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            <span>Myanmar Cultural Attire</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>~3.5 Syl/Sec TTS</span>
          </span>
        </div>
      </div>

      {/* EMPTY STATE */}
      {(!script || !script.trim()) ? (
        <div
          role="status"
          className="glass-card p-8 sm:p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-2xl bg-slate-800/70 border border-slate-700 flex items-center justify-center text-slate-400 mb-1"
            aria-hidden="true"
          >
            <FileText className="w-8 h-8 text-emerald-400/80" />
          </div>

          <div className="max-w-md">
            <h3 className="text-base sm:text-lg font-bold text-white font-burmese">
              ဇာတ်ညွှန်း Script ထည့်သွင်းထားခြင်း မရှိသေးပါ
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-burmese leading-relaxed">
              Google Slides & Google Vids အတွက် အခန်းခွဲ Storyboard အလိုအလျောက် ထုတ်ယူနိုင်ရန်
              အဆင့် ၂ (Script & စကားပြော) တွင် အကြောင်းအရာ ရေးသားထားရန် လိုအပ်ပါသည်ခင်ဗျာ။
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => onSwitchTab('script')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm transition shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
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
            {/* Storyboard Summary Metrics */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-emerald-300 font-medium">
                <Layers className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>စုစုပေါင်း {scenes.length} အခန်း (Scenes)</span>
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>ခန့်မှန်းကြာချိန် ~{totalDuration} စက္ကန့်</span>
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400">
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
                >
                  Speaker Notes
                </button>
              </div>

              {/* Regenerate Button */}
              <button
                type="button"
                onClick={handleRegenerate}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="ပြန်လည်စစ်ဆေးတွက်ချက်မည်"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                <span>ပြန်လည်စစ်ဆေးတွက်ချက်မည်</span>
              </button>

              {/* Copy All Scenes Button */}
              <button
                type="button"
                onClick={handleCopyAllForSlides}
                className={`px-3.5 py-2 rounded-xl font-medium text-xs transition flex items-center gap-2 cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  copiedId === 'copy_all_scenes'
                    ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                }`}
                aria-label="Google Slides အတွက် အားလုံး ကူးယူမည်"
              >
                {copiedId === 'copy_all_scenes' ? (
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

          {/* List of Interactive Scene Cards */}
          <div
            role="list"
            aria-label="Google Slides & Vids Multi-Scene Cards"
            className="flex flex-col gap-4 sm:gap-5"
          >
            {scenes.map((scene) => {
              const syllables = countBurmeseSyllables(scene.narration);
              const isVisualVisible = activeFilter === 'all' || activeFilter === 'visual';
              const isNotesVisible = activeFilter === 'all' || activeFilter === 'notes';

              return (
                <article
                  key={scene.sceneNumber}
                  role="listitem"
                  className="glass-card rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 flex flex-col gap-4 transition hover:border-slate-700/80 shadow-sm"
                >
                  {/* Card Header: Scene Badge, Title, Duration & Individual Copy Bundle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
                        အခန်း {scene.sceneNumber} / {scenes.length}
                      </span>

                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {scene.title}
                      </h3>

                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>~{scene.estDuration} စက္ကန့် ({scene.estDuration}s)</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                        <span>{syllables} ဝဏ္ဏ</span>
                      </span>
                    </div>

                    {/* Individual Single Scene Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopySingleSceneBundle(scene)}
                      className={`self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 border focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                        copiedId === `scene_bundle_${scene.sceneNumber}`
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/70'
                      }`}
                      aria-label={`အခန်း ${scene.sceneNumber} ၏ Slide & Notes အချက်အလက်များ ကူးယူရန်`}
                    >
                      {copiedId === `scene_bundle_${scene.sceneNumber}` ? (
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
                            handleCopy(
                              scene.slideVisual,
                              `အခန်း ${scene.sceneNumber} ၏ Visual Directive ကို ကူးယူပြီးပါပြီ!`,
                              `visual_${scene.sceneNumber}`
                            )
                          }
                          className="text-[11px] text-slate-400 hover:text-emerald-400 transition cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800"
                          aria-label={`အခန်း ${scene.sceneNumber} Visual Directive ကူးယူရန်`}
                        >
                          {copiedId === `visual_${scene.sceneNumber}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                              <span className="text-emerald-400">Copied</span>
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
                              handleCopy(
                                scene.onScreenText,
                                `On-screen စာသား ကူးယူပြီးပါပြီ!`,
                                `onscreen_${scene.sceneNumber}`
                              )
                            }
                            className="text-[11px] text-slate-400 hover:text-teal-400 transition cursor-pointer flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800"
                            aria-label={`အခန်း ${scene.sceneNumber} On-screen စာသား ကူးယူရန်`}
                          >
                            {copiedId === `onscreen_${scene.sceneNumber}` ? (
                              <Check className="w-3 h-3 text-teal-400" aria-hidden="true" />
                            ) : (
                              <Copy className="w-3 h-3" aria-hidden="true" />
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
                              handleCopy(
                                scene.narration,
                                `Speaker Notes (မြန်မာစကားပြော) ကူးယူပြီးပါပြီ!`,
                                `narration_${scene.sceneNumber}`
                              )
                            }
                            className="text-[11px] text-slate-400 hover:text-indigo-400 transition cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800"
                            aria-label={`အခန်း ${scene.sceneNumber} Speaker Notes ကူးယူရန်`}
                          >
                            {copiedId === `narration_${scene.sceneNumber}` ? (
                              <>
                                <Check className="w-3 h-3 text-indigo-400" aria-hidden="true" />
                                <span className="text-indigo-400">Copied</span>
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
                          handleCopy(
                            scene.avatarMotion,
                            `အခန်း ${scene.sceneNumber} ၏ Avatar Action ကို ကူးယူပြီးပါပြီ!`,
                            `avatar_${scene.sceneNumber}`
                          )
                        }
                        className="text-[11px] text-slate-400 hover:text-amber-400 transition cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800"
                        aria-label={`အခန်း ${scene.sceneNumber} Avatar Action ကူးယူရန်`}
                      >
                        {copiedId === `avatar_${scene.sceneNumber}` ? (
                          <>
                            <Check className="w-3 h-3 text-amber-400" aria-hidden="true" />
                            <span className="text-amber-400">Copied</span>
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
            })}
          </div>

          {/* Bottom Workflow Guide Helper */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-950/60 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-burmese">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>
                အကြံပြုချက်: Google Slides ထဲတွင် 16:9 Presentation ဆလိုက်များ ဖန်တီးပြီး Speaker Notes ထဲသို့
                မြန်မာစကားပြော (TTS Text) ကို ထည့်သွင်းကာ Google Vids သို့မဟုတ် Video Editor များတွင် Avatar နှင့် တွဲဖက် အသုံးပြုနိုင်ပါသည်ခင်ဗျာ။
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyAllForSlides}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-sans transition cursor-pointer flex items-center gap-1.5"
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
