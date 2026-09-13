import React from 'react';
import { X, Cpu, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasServerAi: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  hasServerAi,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card max-w-md w-full p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Gemini AI ချိတ်ဆက်မှု
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Gemini 3.8 Flash ဖြင့် Live Prompt များ အဆင့်မြှင့်တင်ခြင်း
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                hasServerAi
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {hasServerAi ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {hasServerAi
                  ? 'Server-side Gemini AI အသင့်ရှိပါသည်'
                  : 'Built-in Template စနစ် အလုပ်လုပ်နေပါသည်'}
              </p>
              <p className="text-[10px] text-slate-400">
                {hasServerAi
                  ? 'Backend API အလိုအလျောက် ချိတ်ဆက်ထားပြီး ဖြစ်ပါသည်'
                  : 'AI Key မပါရှိပါကလည်း Local စနစ်ဖြင့် မြန်မာ Prompt များကို ပုံမှန် အသုံးပြုနိုင်ပါသည်'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 leading-relaxed space-y-1.5 font-burmese">
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>လုံခြုံရေး အာမခံချက်</span>
            </div>
            <p>
              Gemini AI ခေါ်ဆိုမှုများကို Server-side route များမှတစ်ဆင့် လုံခြုံစွာ လုပ်ဆောင်ပေးပါသည်။ Prompt အဆင့်မြှင့်တင်ခြင်းနှင့် စကားပြောဖန်တီးခြင်းများကို အချိန်မရွေး အသုံးပြုနိုင်ပါသည်။
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-md"
          >
            နားလည်ပါပြီ
          </button>
        </div>
      </div>
    </div>
  );
};
