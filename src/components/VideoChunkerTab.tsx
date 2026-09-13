import React from 'react';
import {
  Scissors,
  Copy,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  Film,
  Mic,
  Video,
  Eye,
} from 'lucide-react';
import { ActionVariation, ChunkViewMode, VideoChunk } from '../types';

interface VideoChunkerTabProps {
  scriptText: string;
  onScriptChange: (text: string) => void;
  variation: ActionVariation;
  onVariationChange: (v: ActionVariation) => void;
  onRunChunker: () => void;
  chunks: VideoChunk[];
  viewMode: ChunkViewMode;
  onViewModeChange: (mode: ChunkViewMode) => void;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onCopy: (text: string, msg: string) => void;
  copiedKey: string | null;
}

export const VideoChunkerTab: React.FC<VideoChunkerTabProps> = ({
  scriptText,
  onScriptChange,
  variation,
  onVariationChange,
  onRunChunker,
  chunks,
  viewMode,
  onViewModeChange,
  currentStepIndex,
  onStepChange,
  onCopy,
  copiedKey,
}) => {
  const handleCopySingleShot = (chunk: VideoChunk) => {
    const formatted = `🎬 Shot ${chunk.shotNum} (8 Seconds) 🎬

၁။ Video Animation Prompt (English လို ထည့်ရန်):
${chunk.videoPrompt}

၂။ Audio / Text-to-Speech Prompt (အသံထွက်ဖို့အတွက် ထည့်ရန်):
${chunk.scriptBurmese}`;
    onCopy(formatted, `Shot ${chunk.shotNum} Prompt ကို အပြည့်အစုံ ကူးယူပြီးပါပြီ!`);
  };

  const visibleChunks =
    viewMode === 'step'
      ? chunks.length > 0 && currentStepIndex < chunks.length
        ? [chunks[currentStepIndex]]
        : []
      : chunks;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
      {/* Left Column: Chunker Setup & Interactive Stepper (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col gap-4">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400 font-mono">အဆင့် ၃။</span>
                <span>၈ စက္ကန့် စီ ခွဲထုတ်စနစ်</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                8s Rule
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 font-burmese">
              AI Video Tool များ (Kling, Runway, Hedra) သည် တစ်ခါထုတ်လျှင် ၅ မှ ၈ စက္ကန့်သာ အဆင်ပြေသောကြောင့် တစ်ပိုင်းချင်း အတိအကျ ခွဲပေးပါသည်
            </p>
          </div>

          {/* Input script to chunk */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-burmese">
              ခွဲခြမ်းမည့် စာသား (Burmese Script)
            </label>
            <textarea
              rows={4}
              value={scriptText}
              onChange={(e) => onScriptChange(e.target.value)}
              placeholder="ခွဲခြမ်းလိုသော မြန်မာစကားပြော စာသားကို ဤနေရာတွင် ထည့်ပါ..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-burmese leading-relaxed"
            />
          </div>

          {/* Action variations configuration */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Action Dynamic Variation (အမူအရာ ပြောင်းလဲမှုပုံစံ)
            </label>
            <select
              value={variation}
              onChange={(e) =>
                onVariationChange(e.target.value as ActionVariation)
              }
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="dynamic">
                ကင်မရာနှင့် လက်ဟန်ကို အပိုင်းတိုင်း အနည်းငယ် ပြောင်းမည် (Recommended)
              </option>
              <option value="steady">
                ကင်မရာတည်ငြိမ်ပြီး စကားပြော နှုတ်ခမ်းလှုပ်ရှားမှုသာ အဓိကထားမည်
              </option>
              <option value="cinematic">
                Close-up မှ Medium shot သို့ အလှည့်ကျ ပြောင်းမည်
              </option>
            </select>
          </div>

          {/* Run chunker button */}
          <button
            onClick={onRunChunker}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950 active:scale-95"
          >
            <Scissors className="w-4 h-4" />
            <span>၈ စက္ကန့် အပိုင်းများ အလိုအလျောက် ဖြတ်ထုတ်မည်</span>
          </button>

          {/* Presentation Mode Switcher */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">
                ပြသမှုပုံစံ (Display Mode)
              </span>
              <span className="text-[10px] text-slate-400 font-burmese">
                တစ်ပိုင်းချင်း လား၊ အားလုံး တစ်ပြိုင်နက် လား
              </span>
            </div>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => onViewModeChange('step')}
                className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition ${
                  viewMode === 'step'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                တစ်ပိုင်းချင်း
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('all')}
                className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition ${
                  viewMode === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                အားလုံး
              </button>
            </div>
          </div>
        </div>

        {/* Step Navigator (Only in Step Mode & when chunks exist) */}
        {viewMode === 'step' && chunks.length > 0 && (
          <div className="glass-card p-3.5 sm:p-4 rounded-2xl flex items-center justify-between border border-slate-800 shadow-md">
            <button
              onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>ရှေ့တစ်ပိုင်း</span>
            </button>

            <span className="text-xs font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              Shot {currentStepIndex + 1} of {chunks.length}
            </span>

            <button
              onClick={() =>
                onStepChange(
                  Math.min(chunks.length - 1, currentStepIndex + 1)
                )
              }
              disabled={currentStepIndex === chunks.length - 1}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white flex items-center gap-1 font-medium disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <span>နောက်တစ်ပိုင်း</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Chunks Output Display (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {chunks.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center flex flex-col items-center justify-center gap-2 text-slate-400">
            <Video className="w-8 h-8 text-slate-600" />
            <p className="text-xs font-burmese">
              ခွဲခြမ်းထားသော အပိုင်းများ မရှိသေးပါ။ ဘယ်ဘက်ရှိ ခလုတ်ကို နှိပ်၍ ခွဲခြမ်းပါ
            </p>
          </div>
        ) : (
          visibleChunks.map((chunk) => (
            <div
              key={chunk.shotNum}
              className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-xl flex flex-col gap-3"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                    {chunk.shotNum}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Shot {chunk.shotNum} (8 Seconds Duration)</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-burmese">
                      စာလုံးရေ: ~{chunk.wordCount} words (ခန့်မှန်းခြေ ၆-၈ စက္ကန့်စာ)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopySingleShot(chunk)}
                  className="self-start sm:self-auto px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Shot {chunk.shotNum} တစ်ခုလုံး Copy</span>
                </button>
              </div>

              {/* 1. Video Animation Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>၁။ Video Animation Prompt (English လို Kling / Runway သို့ ထည့်ရန်):</span>
                  </label>
                  <button
                    onClick={() =>
                      onCopy(
                        chunk.videoPrompt,
                        'Video Animation Prompt ကို Copy ကူးပြီးပါပြီ'
                      )
                    }
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                  >
                    {copiedKey === chunk.videoPrompt ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-200 select-all leading-relaxed break-words">
                  {chunk.videoPrompt}
                </div>
              </div>

              {/* 2. Audio TTS Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-teal-300 flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    <span>၂။ Audio / Text-to-Speech Prompt (အသံထွက်ရန် ထည့်ရန်):</span>
                  </label>
                  <button
                    onClick={() =>
                      onCopy(
                        chunk.scriptBurmese,
                        'Audio Burmese Prompt ကို Copy ကူးပြီးပါပြီ'
                      )
                    }
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                  >
                    {copiedKey === chunk.scriptBurmese ? (
                      <Check className="w-3 h-3 text-teal-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-burmese text-slate-200 select-all leading-relaxed">
                  {chunk.scriptBurmese}
                </div>
              </div>

              {/* Step Mode Next Helper */}
              {viewMode === 'step' && chunk.shotNum < chunks.length && (
                <div className="mt-1 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-burmese">
                    ဗီဒီယို ပြုလုပ်ပြီးပါက &rarr;
                  </span>
                  <button
                    onClick={() => onStepChange(chunk.shotNum)}
                    className="px-3 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 transition"
                  >
                    <span>"Next" သို့မဟုတ် နောက်တစ်ပိုင်း တောင်းမည်</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
