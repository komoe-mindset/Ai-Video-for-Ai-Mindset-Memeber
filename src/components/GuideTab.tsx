import React from 'react';
import {
  Bookmark,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { VOCABULARY_ITEMS, GEM_SYSTEM_INSTRUCTION, GEMINI_GEM_URL } from '../data/presets';
import { ReferenceToolsBar } from './ReferenceToolsBar';

interface GuideTabProps {
  onCopy: (text: string, msg: string) => void;
  copiedKey: string | null;
  onOpenGemModal: () => void;
}

export const GuideTab: React.FC<GuideTabProps> = ({
  onCopy,
  copiedKey,
  onOpenGemModal,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
      {/* Left Column: Vocabulary Cheatsheet (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>မြန်မာဝတ်စုံ & ပုံစံ အသုံးအနှုန်းများ (Prompt Keywords)</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                ကလစ်တစ်ချက်နှိပ်ရုံဖြင့် Prompt စာသားကို Copy ယူနိုင်ပါသည်
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Category: Myanmar Female Attire */}
            <div>
              <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                🌸 အမျိုးသမီး ရိုးရာ & ခေတ်မီဝတ်စုံများ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VOCABULARY_ITEMS.femaleAttire.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      onCopy(
                        item.prompt,
                        `"${item.titleMy}" Prompt ကို ကူးယူပြီးပါပြီ!`
                      )
                    }
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition text-left group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition">
                        {item.titleMy}
                      </span>
                      {copiedKey === item.prompt ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 transition" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Category: Myanmar Male Attire */}
            <div>
              <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
                👔 အမျိုးသား ရိုးရာ & ရုံးဝတ်စုံများ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VOCABULARY_ITEMS.maleAttire.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      onCopy(
                        item.prompt,
                        `"${item.titleMy}" Prompt ကို ကူးယူပြီးပါပြီ!`
                      )
                    }
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition text-left group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition">
                        {item.titleMy}
                      </span>
                      {copiedKey === item.prompt ? (
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 transition" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Category: Lighting & Rendering Aesthetics */}
            <div>
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                💡 အလင်းနှင့် ကင်မရာ အရည်အသွေး (Cinematics)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VOCABULARY_ITEMS.lightingAndCamera.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      onCopy(
                        item.prompt,
                        `"${item.titleMy}" Prompt ကို ကူးယူပြီးပါပြီ!`
                      )
                    }
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition text-left group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition">
                        {item.titleMy}
                      </span>
                      {copiedKey === item.prompt ? (
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0 transition" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: How Gemini Gem Works Step-by-Step (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Gemini Gem အလုပ်လုပ်ပုံ အဆင့် ၁၀ ဆင့်
              </h3>
            </div>
            <button
              onClick={onOpenGemModal}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>ကြည့်ရှုရန်</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <ol className="relative border-l border-slate-800 ml-2 space-y-4 my-2 text-xs">
            <li className="mb-2 ml-4">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-slate-900 bg-emerald-500"></span>
              <h5 className="font-bold text-slate-200">Step 1: မေးခွန်း ၄ ခုဖြင့် ကြိုဆိုခြင်း</h5>
              <p className="text-slate-400 text-[11px] mt-0.5 font-burmese">
                ပုံစံ၊ ဇာတ်ကောင်၊ အဝတ်အစား နှင့် နောက်ခံ ကို မြန်မာလို မေးမြန်းခြင်း။
              </p>
            </li>
            <li className="mb-2 ml-4">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-slate-900 bg-emerald-500"></span>
              <h5 className="font-bold text-slate-200">Step 2 & 3: English Prompt & မြန်မာရှင်းပြချက်</h5>
              <p className="text-slate-400 text-[11px] mt-0.5 font-burmese">
                အသေးစိတ် အင်္ဂလိပ်စာသား ပြန်လည်ထုတ်ပေးပြီး မြန်မာလို အဓိပ္ပာယ်ရှင်းပြခြင်း။
              </p>
            </li>
            <li className="mb-2 ml-4">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-slate-900 bg-emerald-500"></span>
              <h5 className="font-bold text-slate-200">Step 4 & 5: စကားပြော မေးခွန်း ၃ ခု</h5>
              <p className="text-slate-400 text-[11px] mt-0.5 font-burmese">
                Topic, Tone, Language တို့ကို မေးပြီး Voice Tool အတွက် အကောင်းဆုံး script ပြင်ဆင်ခြင်း။
              </p>
            </li>
            <li className="mb-2 ml-4">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-slate-900 bg-emerald-500"></span>
              <h5 className="font-bold text-slate-200">Step 6: ရွေးချယ်စရာ ၂ မျိုး (Short vs Pro)</h5>
              <p className="text-slate-400 text-[11px] mt-0.5 font-burmese">
                TikTok အတွက် တိုတိုတုတ်တုတ် နှင့် အသေးစိတ်ရှင်းပြချက် script ၂ မျိုး ထုတ်ပေးခြင်း။
              </p>
            </li>
            <li className="mb-2 ml-4">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-slate-900 bg-emerald-500"></span>
              <h5 className="font-bold text-slate-200">Step 7 မှ 10: ၈ စက္ကန့် Loop စနစ်</h5>
              <p className="text-slate-400 text-[11px] mt-0.5 font-burmese">
                စာရှည်ပါက တစ်ကြိမ်လျှင် ၈ စက္ကန့်စာ Prompt တစ်ခုတည်းပေးပြီး "Next" ပြောမှသာ နောက်တစ်ပိုင်း ဆက်ပေးခြင်း။
              </p>
            </li>
          </ol>

          {/* Instructions Copy Box */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Gem System Instruction အပြည့်အစုံ
              </span>
              <button
                onClick={() =>
                  onCopy(
                    GEM_SYSTEM_INSTRUCTION,
                    'Gemini Gem Instructions အားလုံးကို Copy ယူပြီးပါပြီ!'
                  )
                }
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                {copiedKey === GEM_SYSTEM_INSTRUCTION ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Instructions</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-burmese">
              ဤ Prompt ကို Google Gemini &gt; Gems &gt; New Gem ထဲတွင် ထည့်သွင်းပြီး သင့်ကိုယ်ပိုင် Gem အဖြစ် အသုံးပြုနိုင်ပါသည်
            </p>

            <a
              href={GEMINI_GEM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/60 hover:to-indigo-900/60 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 group shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition" />
              <span>Gemini Gem သို့ တိုက်ရိုက် သွားရောက်ရန်</span>
              <ExternalLink className="w-3.5 h-3.5 text-purple-400 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* Dedicated Section: AI Video Reference Image Studios */}
      <div className="lg:col-span-12 glass-card p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Video Reference Image Studios (Gemini Prompts)</span>
            </h3>
            <p className="text-xs text-slate-400 font-burmese mt-0.5">
              AI Video (Kling, Runway, Hailuo, Luma) များတွင် Reference Image အဖြစ် ထည့်သွင်းအသုံးပြုနိုင်သော Gemini Studio လင့်ခ်များ
            </p>
          </div>
        </div>
        <ReferenceToolsBar variant="cards" />
      </div>
    </div>
  );
};
