import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Image as ImageIcon,
  Smile,
  ExternalLink,
  Sparkles,
  Workflow,
  X,
  ArrowRight,
  Presentation,
  Clapperboard,
  Film,
  Scissors,
  CheckCircle2,
  Sliders,
  Play,
  Layers,
  Maximize2,
} from 'lucide-react';
import { REFERENCE_TOOLS, ReferenceTool } from '../data/presets';

interface ReferenceToolsBarProps {
  variant?: 'compact' | 'cards' | 'inline';
}

interface WorkflowToolLink {
  id: string;
  name: string;
  nameMm: string;
  url: string;
  badge: string;
  pipeline: 'google' | 'generative';
  color: 'amber' | 'emerald' | 'purple' | 'cyan';
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

export const WORKFLOW_EXTERNAL_TOOLS: WorkflowToolLink[] = [
  {
    id: 'google-slides',
    name: 'Google Slides',
    nameMm: 'Speaker Notes ပြင်ဆင်ရန်',
    url: 'https://slides.google.com/',
    badge: 'Google Flow',
    pipeline: 'google',
    color: 'amber',
    icon: Presentation,
  },
  {
    id: 'google-vids',
    name: 'Google Vids',
    nameMm: 'AI Video အချောထွက်ရန်',
    url: 'https://vids.google.com/',
    badge: 'Google Flow',
    pipeline: 'google',
    color: 'emerald',
    icon: Clapperboard,
  },
  {
    id: 'runway',
    name: 'Runway Gen-3',
    nameMm: 'Cinematic AI Video',
    url: 'https://runwayml.com/',
    badge: 'Generative Flow',
    pipeline: 'generative',
    color: 'purple',
    icon: Film,
  },
  {
    id: 'capcut',
    name: 'CapCut',
    nameMm: 'ဗီဒီယို တည်းဖြတ်ခြင်း',
    url: 'https://www.capcut.com/',
    badge: 'Generative Flow',
    pipeline: 'generative',
    color: 'cyan',
    icon: Scissors,
  },
];

export const ReferenceToolsBar: React.FC<ReferenceToolsBarProps> = ({
  variant = 'compact',
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Accessibility: Handle Escape key, focus trap, and focus restoration
  useEffect(() => {
    if (!isModalOpen) return;

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const timer = setTimeout(() => {
      if (!modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        modalRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsModalOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [isModalOpen]);

  const getIcon = (category: ReferenceTool['category']) => {
    switch (category) {
      case 'product':
        return <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'scene':
        return <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'avatar':
        return <Smile className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
      case 'upscale':
        return <Maximize2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />;
    }
  };

  const getStyle = (category: ReferenceTool['category']) => {
    switch (category) {
      case 'product':
        return 'bg-amber-950/30 hover:bg-amber-900/40 text-amber-200 border-amber-500/30 hover:border-amber-400/60';
      case 'scene':
        return 'bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-200 border-cyan-500/30 hover:border-cyan-400/60';
      case 'avatar':
        return 'bg-pink-950/30 hover:bg-pink-900/40 text-pink-200 border-pink-500/30 hover:border-pink-400/60';
      case 'upscale':
        return 'bg-violet-950/30 hover:bg-violet-900/40 text-violet-200 border-violet-500/30 hover:border-violet-400/60';
    }
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsModalOpen(false);
          }
        }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dual-pipeline-title"
          aria-describedby="dual-pipeline-desc"
          tabIndex={-1}
          className="glass-card max-w-4xl w-full p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-2xl relative max-h-[92vh] flex flex-col outline-none overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 shadow-inner">
                <Workflow className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="dual-pipeline-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-burmese">
                  <span>ဗီဒီယို ဖန်တီးနည်း လမ်းကြောင်း ၂ သွယ်</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans">
                    Dual Pipeline Guide
                  </span>
                </h2>
                <p id="dual-pipeline-desc" className="text-xs text-slate-400 font-burmese mt-0.5">
                  သင်၏ ရည်ရွယ်ချက်နှင့် အချိန်လိုအပ်ချက်အလိုက် သင့်တော်သော လမ်းကြောင်းကို ရွေးချယ်အသုံးပြုနိုင်ပါသည်
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/80 transition cursor-pointer shrink-0"
              aria-label="ပိတ်မည် (Close dialog)"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-slate-300 custom-scrollbar">
            {/* Pipelines Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Route A: Google Flow */}
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-slate-900/90 to-emerald-950/20 p-4 sm:p-5 flex flex-col justify-between relative shadow-lg">
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans">
                    Beginner Friendly
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center font-sans">
                      က
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white font-burmese">
                      လမ်းကြောင်း (က) - Google Flow
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-400/90 font-burmese font-medium mb-3">
                    အစပြုသူများအတွက် အထူးသင့်လျော်သည် (Easy, Fast & Workspace Native)
                  </p>

                  {/* Flow Diagram */}
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mb-4">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-2 font-sans">
                      လုပ်ငန်းစဉ် အဆင့်ဆင့် (Workflow Flowchart)
                    </span>
                    <div className="space-y-1.5 text-xs font-burmese">
                      <div className="flex items-center gap-2 text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-400 text-[10px] flex items-center justify-center font-bold">1</span>
                        <span>Gemini Gem (အိုင်ဒီယာ & Prompt)</span>
                      </div>
                      <div className="pl-2.5 text-slate-500 text-[10px]">↓</div>
                      <div className="flex items-center gap-2 text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-400 text-[10px] flex items-center justify-center font-bold">2</span>
                        <span>Script ရေးသားခြင်း (Option A / B)</span>
                      </div>
                      <div className="pl-2.5 text-slate-500 text-[10px]">↓</div>
                      <div className="flex items-center gap-2 text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-400 text-[10px] flex items-center justify-center font-bold">3</span>
                        <span>Google Vids Storyboard (အခန်းခွဲ Scene များ)</span>
                      </div>
                      <div className="pl-2.5 text-slate-500 text-[10px]">↓</div>
                      <div className="flex items-center gap-2 text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-400 text-[10px] flex items-center justify-center font-bold">4</span>
                        <span>Google Slides Speaker Notes (Visual Prompt & Voiceover)</span>
                      </div>
                      <div className="pl-2.5 text-slate-500 text-[10px]">↓</div>
                      <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">5</span>
                        <span>Google Vids AI Video (အလိုအလျောက် ဗီဒီယို ဖန်တီးမှု)</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300 font-burmese mb-4">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>ဗီဒီယို တည်းဖြတ်မှု အတွေ့အကြုံမရှိသူများပင် အချိန် မိနစ်ပိုင်းအတွင်း အလွယ်တကူ ဖန်တီးနိုင်ခြင်း။</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Google Slides တွင် Speaker Notes ထည့်ပြီး Google Vids ထဲသို့ Import လုပ်ရုံဖြင့် အသံထွက်ဗီဒီယို အသင့်ရရှိခြင်း။</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                  <a
                    href="https://slides.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 group shadow-sm"
                  >
                    <Presentation className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    <span>Google Slides ဖွင့်မည်</span>
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition" aria-hidden="true" />
                  </a>

                  <a
                    href="https://vids.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 group shadow-sm shadow-emerald-950/50"
                  >
                    <Clapperboard className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Google Vids ဖွင့်မည်</span>
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Route B: Advanced Generative Flow */}
              <div className="rounded-2xl border border-purple-500/40 bg-gradient-to-b from-slate-900/90 to-purple-950/20 p-4 sm:p-5 flex flex-col justify-between relative shadow-lg">
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-sans">
                    Cinematic Quality
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center font-sans">
                      ခ
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white font-burmese">
                      လမ်းကြောင်း (ခ) - Advanced Generative Flow
                    </h3>
                  </div>
                  <p className="text-xs text-purple-400/90 font-burmese font-medium mb-3">
                    ရုပ်ထွက်မြင့်မားသော ဖန်တီးမှု (Pro Studio, Photorealistic & Cinema Grade)
                  </p>

                  {/* Flow Diagram */}
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mb-4">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-2 font-sans">
                      လုပ်ငန်းစဉ် အဆင့်ဆင့် (Workflow Flowchart)
                    </span>
                    <div className="space-y-1.5 text-xs font-burmese">
                      <div className="flex items-center gap-2 text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-purple-900/60 text-purple-400 text-[10px] flex items-center justify-center font-bold">1</span>
                        <span>Midjourney Avatar (ရုပ်ထွက်အရည်အသွေးမြင့် ဇာတ်ကောင်)</span>
                      </div>
                      <div className="pl-2.5 text-slate-500 text-[10px]">↓</div>
                      <div className="flex items-center gap-2 text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-purple-900/60 text-purple-400 text-[10px] flex items-center justify-center font-bold">2</span>
                        <span>8s Video Chunks (8s Rule အပိုင်းများ ခွဲထုတ်ခြင်း)</span>
                      </div>
                      <div className="pl-2.5 text-slate-500 text-[10px]">↓</div>
                      <div className="flex items-center gap-2 text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-purple-900/60 text-purple-400 text-[10px] flex items-center justify-center font-bold">3</span>
                        <span>Kling / Runway / Hedra (ရုပ်ထွက်လှုပ်ရှားသက်ဝင်စေခြင်း)</span>
                      </div>
                      <div className="pl-2.5 text-slate-500 text-[10px]">↓</div>
                      <div className="flex items-center gap-2 text-purple-300 font-semibold">
                        <span className="w-5 h-5 rounded-full bg-purple-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">4</span>
                        <span>CapCut တည်းဖြတ်ခြင်း (ပေါင်းစပ်ခြင်း၊ စာတန်းထိုး & SFX)</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300 font-burmese mb-4">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>Midjourney ဖြင့် တည်ဆောက်ထားသော ဇာတ်ကောင်ကို ၈ စက္ကန့်စီ အတိအကျ ခွဲထုတ်၍ AI ကင်မရာ ပျက်စီးမှု ကာကွယ်နိုင်ခြင်း။</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>Kling AI / Runway / Hedra မှ ထွက်လာသော Video Clips များကို CapCut ထဲတွင် ဆက်စပ်ပြီး အသံ၊ B-roll ဖြင့် ပြီးပြည့်စုံစွာ အချောသတ်နိုင်ခြင်း။</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                  <a
                    href="https://runwayml.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 group shadow-sm"
                  >
                    <Film className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
                    <span>Runway Gen-3</span>
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition" aria-hidden="true" />
                  </a>

                  <a
                    href="https://www.capcut.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 group shadow-sm"
                  >
                    <Scissors className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                    <span>CapCut တည်းဖြတ်ရန်</span>
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Decision Guide & Comparison */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 font-burmese">
                    ဘယ်လမ်းကြောင်းကို ရွေးချယ်သင့်သလဲ? (Recommendation)
                  </h4>
                  <p className="text-slate-400 font-burmese text-[11px] mt-0.5 leading-relaxed">
                    ရှင်းလင်းချက်၊ သင်ကြားရေးနှင့် ပညာပေးဗီဒီယိုများကို အချိန်တိုအတွင်း ထုတ်လုပ်လိုပါက{' '}
                    <strong className="text-emerald-300 font-semibold">လမ်းကြောင်း (က) Google Flow</strong> ကို သုံးပါ။
                    ကုန်ပစ္စည်းကြော်ငြာနှင့် ရုပ်ရှင်ဆန်သော ရုပ်ထွက်အကောင်းစား လိုချင်ပါက{' '}
                    <strong className="text-purple-300 font-semibold">လမ်းကြောင်း (ခ) Advanced Flow</strong> ကို ရွေးချယ်ပါ။
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href="https://klingai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 flex items-center gap-1 transition"
                  title="Kling AI Video Generator"
                >
                  <span>Kling AI</span>
                  <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                </a>
                <a
                  href="https://www.hedra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 flex items-center gap-1 transition"
                  title="Hedra AI Character Video"
                >
                  <span>Hedra</span>
                  <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-burmese">
              ပြင်ပ Tools အားလုံးကို Tab အသစ်တွင် လုံခြုံစွာ ဖွင့်ပါမည် (rel="noopener noreferrer")
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              နားလည်ပါပြီ (Close)
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (variant === 'cards') {
    return (
      <div className="space-y-3">
        {/* Dual Pipeline Guide Hero Card in Cards mode */}
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-emerald-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Workflow className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white font-burmese">
                  ဗီဒီယို ဖန်တီးနည်း လမ်းကြောင်း ၂ သွယ် (Dual Pipeline Guide)
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium font-sans">
                  Interactive Guide
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-burmese mt-0.5">
                Google Flow (အစပြုသူများအတွက်) နှင့် Advanced Generative Flow (ရုပ်ရှင်အဆင့် ရုပ်ထွက်) နှိုင်းယှဉ်ချက်
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-md shadow-emerald-950/50 cursor-pointer font-burmese"
            >
              <Workflow className="w-3.5 h-3.5" aria-hidden="true" />
              <span>လမ်းကြောင်း လမ်းညွှန် ကြည့်ရှုရန်</span>
            </button>
          </div>
        </div>

        {/* 4 Gemini Reference Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {REFERENCE_TOOLS.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tool.name} - ${tool.nameMm} (${tool.url.includes('/gem/') ? 'Opens Gemini Gem in a new tab' : 'Opens Gemini Share in a new tab'})`}
              className="glass-card p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group active:scale-98"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center" aria-hidden="true">
                    {getIcon(tool.category)}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {tool.badge}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-100 group-hover:text-white flex items-center gap-1">
                  <span>{tool.name}</span>
                </h5>
                <p className="text-[10px] text-emerald-400 font-burmese font-medium mt-0.5">
                  {tool.nameMm}
                </p>
                <p className="text-[11px] text-slate-400 font-burmese mt-1.5 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-emerald-400 transition">
                <span>{tool.url.includes('/gem/') ? 'Gemini Gem ဖွင့်မည်' : 'Gemini Share ဖွင့်မည်'}</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        {renderModal()}
      </div>
    );
  }

  // Compact bar variant
  return (
    <div className="w-full bg-slate-900/80 border border-slate-800/90 rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2.5 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5">
        {/* Left: Dual Pipeline Guide Trigger Button & Info */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 border border-emerald-500/50 hover:border-emerald-400 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm shadow-emerald-950/40 cursor-pointer font-burmese"
            title="ဗီဒီယို ဖန်တီးနည်း လမ်းကြောင်း ၂ သွယ် (Dual Pipeline Guide)"
          >
            <Workflow className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>ဗီဒီယို ဖန်တီးနည်း လမ်းကြောင်း ၂ သွယ် (Dual Pipeline Guide)</span>
          </button>

          <span className="hidden xl:inline text-[11px] text-slate-400 font-burmese">
            Google Flow ➔ သို့မဟုတ် ➔ Advanced Generative Flow
          </span>
        </div>

        {/* Right: Direct external links to Google Slides, Google Vids, Runway, CapCut */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1 hidden sm:inline">
            Direct Tools:
          </span>

          <a
            href="https://slides.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-lg bg-amber-950/30 hover:bg-amber-900/40 text-amber-200 border border-amber-500/30 text-[11px] font-medium inline-flex items-center gap-1 transition active:scale-95"
            title="Google Slides - Speaker Notes ထည့်သွင်းရန်"
          >
            <Presentation className="w-3 h-3 text-amber-400" aria-hidden="true" />
            <span>Google Slides</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
          </a>

          <a
            href="https://vids.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-lg bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-200 border border-emerald-500/30 text-[11px] font-medium inline-flex items-center gap-1 transition active:scale-95"
            title="Google Vids - AI Video အချောထွက်ရန်"
          >
            <Clapperboard className="w-3 h-3 text-emerald-400" aria-hidden="true" />
            <span>Google Vids</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
          </a>

          <a
            href="https://runwayml.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-lg bg-purple-950/30 hover:bg-purple-900/40 text-purple-200 border border-purple-500/30 text-[11px] font-medium inline-flex items-center gap-1 transition active:scale-95"
            title="Runway Gen-3 - High-end Video Generation"
          >
            <Film className="w-3 h-3 text-purple-400" aria-hidden="true" />
            <span>Runway</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
          </a>

          <a
            href="https://www.capcut.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-lg bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-200 border border-cyan-500/30 text-[11px] font-medium inline-flex items-center gap-1 transition active:scale-95"
            title="CapCut - Video တည်းဖြတ်ခြင်း"
          >
            <Scissors className="w-3 h-3 text-cyan-400" aria-hidden="true" />
            <span>CapCut</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Gemini Reference Image Studios Row */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 shrink-0 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-slate-200">
            Gemini Reference Image Studios:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {REFERENCE_TOOLS.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tool.name}: ${tool.description} (Opens Gemini Share in a new tab)`}
              className={`px-2 py-1 rounded-lg border text-[11px] font-medium inline-flex items-center gap-1.5 transition active:scale-95 shadow-sm ${getStyle(
                tool.category
              )}`}
              title={`${tool.name} - ${tool.description}`}
            >
              <span aria-hidden="true">{getIcon(tool.category)}</span>
              <span className="truncate max-w-[130px] sm:max-w-none">{tool.name}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70 ml-0.5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      {renderModal()}
    </div>
  );
};

