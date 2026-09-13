import React from 'react';
import { X, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import { GEM_SYSTEM_INSTRUCTION, GEMINI_GEM_URL } from '../data/presets';

interface GemGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string, msg: string) => void;
  copiedKey: string | null;
}

export const GemGuideModal: React.FC<GemGuideModalProps> = ({
  isOpen,
  onClose,
  onCopy,
  copiedKey,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card max-w-2xl w-full p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-2xl relative max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3 pr-8">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Gemini Gem System Instructions
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Gem Manager တွင် ကူးထည့်ရန် ညွှန်ကြားချက်များ
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {GEM_SYSTEM_INSTRUCTION}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
          <a
            href={GEMINI_GEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <span>Gemini Gem သို့ သွားမည်</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() =>
              onCopy(
                GEM_SYSTEM_INSTRUCTION,
                'Gemini Gem Instructions အားလုံးကို Copy ယူပြီးပါပြီ!'
              )
            }
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
          >
            {copiedKey === GEM_SYSTEM_INSTRUCTION ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Instructions</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy System Instruction</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
