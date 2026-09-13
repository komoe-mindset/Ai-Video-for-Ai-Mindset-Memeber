import React from 'react';
import {
  Wand,
  Copy,
  Clock,
  Layers,
  Sparkles,
  Check,
  ShoppingBag,
  Lightbulb,
  Heart,
  Radio,
  ExternalLink,
  Clapperboard,
} from 'lucide-react';
import { ScriptConfig, ScriptTone, ScriptLang } from '../types';
import { countWordsBurmese, generateLocalScripts } from '../utils/burmeseUtils';
import { GEMINI_GEM_URL } from '../data/presets';

interface ScriptTabProps {
  config: ScriptConfig;
  onChange: (newConfig: ScriptConfig) => void;
  onSendToChunker: (text: string) => void;
  onSendToGoogleVids?: (text: string) => void;
  onGenerateAI?: () => void;
  isGenerating?: boolean;
  onCopy: (text: string, msg: string) => void;
  copiedKey: string | null;
}

export const ScriptTab: React.FC<ScriptTabProps> = ({
  config,
  onChange,
  onSendToChunker,
  onSendToGoogleVids,
  onGenerateAI,
  isGenerating,
  onCopy,
  copiedKey,
}) => {
  const handleTopicPreset = (type: string) => {
    let topicText = '';
    if (type === 'business') {
      topicText =
        'အွန်လိုင်းမှ ကုန်ပစ္စည်းများ ရောင်းအား ၃ ဆ တက်စေမည့် ဗီဒီယိုဖန်တီးနည်း လျှို့ဝှက်ချက်';
    } else if (type === 'tech_tips') {
      topicText =
        'Gemini AI ကို အသုံးပြုပြီး နေ့စဉ်လုပ်ငန်းဆောင်တာများကို မိနစ်ပိုင်းအတွင်း အပြီးသတ်နည်း';
    } else if (type === 'motivation') {
      topicText =
        'အခက်အခဲတွေကြားကနေ သင့်ရည်မှန်းချက်ကို အရောက်လှမ်းနိုင်ဖို့ စိတ်ဓာတ်ခွန်အား အကြံပြုချက်';
    } else if (type === 'news') {
      topicText =
        'ယနေ့ခေတ် လူငယ်များအတွက် အထူးသင့်လျော်သော AI Avatar နည်းပညာ မိတ်ဆက်';
    }
    onChange({ ...config, topic: topicText });
  };

  const wordsA = countWordsBurmese(config.optionA);
  const wordsB = countWordsBurmese(config.optionB);
  const estSecondsA = Math.max(3, Math.ceil(wordsA / 2.5));
  const estSecondsB = Math.max(10, Math.ceil(wordsB / 2.5));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
      {/* Left Column: Topic & Tone Form (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5">
        <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col gap-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">အဆင့် ၂။</span>
              <span>စကားပြော (Script) ရွေးချယ်မှု</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              AI Voice & Lip-Sync အတွက် အကောင်းဆုံး စကားပြောများကို ဖန်တီးပေးပါမည်
            </p>
          </div>

          {/* Q1: Topic */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                ၁
              </span>
              <span>အကြောင်းအရာ (Topic)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => handleTopicPreset('business')}
                className="p-2.5 text-left rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 text-xs text-slate-300 transition flex items-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">ကုန်ပစ္စည်း/ဝန်ဆောင်မှု ကြော်ငြာ</span>
              </button>
              <button
                type="button"
                onClick={() => handleTopicPreset('tech_tips')}
                className="p-2.5 text-left rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 text-xs text-slate-300 transition flex items-center gap-2"
              >
                <Lightbulb className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">AI နည်းပညာ အကြံပြုချက်</span>
              </button>
              <button
                type="button"
                onClick={() => handleTopicPreset('motivation')}
                className="p-2.5 text-left rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 text-xs text-slate-300 transition flex items-center gap-2"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">စိတ်ခွန်အားဖြည့် သင်ခန်းစာ</span>
              </button>
              <button
                type="button"
                onClick={() => handleTopicPreset('news')}
                className="p-2.5 text-left rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 text-xs text-slate-300 transition flex items-center gap-2"
              >
                <Radio className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">သတင်း သို့မဟုတ် မိတ်ဆက်</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={config.topic}
              onChange={(e) => onChange({ ...config, topic: e.target.value })}
              placeholder="သင်ပြောလိုသောအကြောင်းအရာကို အသေးစိတ်ရေးပါ..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs font-burmese text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Q2: Tone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                ၂
              </span>
              <span>လေသံ (Tone)</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'friendly', emoji: '😊', label: 'ရင်းနှီးဖော်ရွေ', sub: 'Casual' },
                { id: 'professional', emoji: '💼', label: 'ပရော်ဖက်ရှင်နယ်', sub: 'Authoritative' },
                { id: 'urgent', emoji: '⚡', label: 'စိတ်လှုပ်ရှားဖွယ်', sub: 'High Energy' },
              ].map((t) => {
                const checked = config.tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      onChange({ ...config, tone: t.id as ScriptTone })
                    }
                    className={`p-2.5 rounded-xl border text-center transition ${
                      checked
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-medium block">
                      {t.emoji} {t.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{t.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q3: Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                ၃
              </span>
              <span>ဘာသာစကား (Language)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...config, lang: 'burmese' })}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                  config.lang === 'burmese'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-base">🇲🇲</span>
                <span className="text-xs font-medium">မြန်မာစကားပြော သီးသန့်</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...config, lang: 'burmish' })}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                  config.lang === 'burmish'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-base">🌐</span>
                <span className="text-xs font-medium">မြန်မာ + အင်္ဂလိပ် ဝေါဟာရတွဲလျက်</span>
              </button>
            </div>
          </div>

          {/* Action Buttons: Local Fast Generation & Gemini Gem Link */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                const generated = generateLocalScripts(
                  config.topic,
                  config.tone,
                  config.lang
                );
                onChange({
                  ...config,
                  optionA: generated.optionA,
                  optionB: generated.optionB,
                });
                onCopy(
                  `Topic: ${config.topic}`,
                  'စကားပြော ပုံစံ ၂ မျိုးကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ!'
                );
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition active:scale-95 cursor-pointer"
            >
              <Wand className="w-4 h-4" />
              <span>စကားပြော ပုံစံ ၂ မျိုး အသင့်ထုတ်ပေးရန်</span>
            </button>

            <a
              href={GEMINI_GEM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                const topicPrompt = `အကြောင်းအရာ: "${config.topic}"\nလေသံ: "${config.tone}"\nဘာသာစကား: "${config.lang}"\nကျေးဇူးပြု၍ TikTok စတိုင်လ် တိုတို (Option A) နှင့် အသေးစိတ်ရှင်းပြချက် (Option B) စကားပြော ၂ မျိုး ရေးပေးပါ။`;
                onCopy(
                  topicPrompt,
                  'စကားပြောမေးခွန်းကို Copy ယူပြီးပါပြီ! Gemini Gem သို့ ဖွင့်ပေးနေပါသည်...'
                );
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-800/40 hover:to-indigo-800/40 text-purple-200 border border-purple-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition shrink-0" />
              <span className="truncate">
                Gemini Gem တွင် စကားပြော ရေးခိုင်းမည် (Copy & Open Gem)
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-purple-400 shrink-0 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: 2 Script Options (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        {/* Script Option A: Short & Punchy */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border-l-4 border-emerald-500 flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 block">
                Option A (Short & Punchy)
              </span>
              <h4 className="text-xs font-semibold text-white">
                TikTok & Reels စတိုင်လ် (တိုတိုနှင့် ထိရောက်)
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                ~ {wordsA} words ({estSecondsA}s)
              </span>
              <button
                type="button"
                onClick={() =>
                  onCopy(config.optionA, 'Option A Script ကို ကူးယူပြီးပါပြီ!')
                }
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Copy Script A"
                aria-label="Option A စကားပြော စာသားကို Copy ယူပါ (Copy Option A Script)"
              >
                {copiedKey === config.optionA ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <textarea
            rows={4}
            value={config.optionA}
            onChange={(e) => onChange({ ...config, optionA: e.target.value })}
            className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-burmese text-slate-200 leading-relaxed focus:outline-none focus:border-emerald-500"
          />

          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-burmese">
              <Clock className="w-3 h-3 shrink-0" />
              <span>ခန့်မှန်းကြာချိန်: ၈ စက္ကန့်ခန့် (Shot ၁ ခုတည်းနှင့် ပြီးပြည့်စုံပါသည်)</span>
            </span>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onSendToGoogleVids?.(config.optionA)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-950/40 cursor-pointer"
                title="Google Vids Storyboard သို့ ပို့မည်"
              >
                <Clapperboard className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Google Vids Storyboard သို့ ပို့မည်</span>
              </button>
              <button
                type="button"
                onClick={() => onSendToChunker(config.optionA)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition text-center cursor-pointer"
              >
                ၈ စက္ကန့် အပိုင်းများ &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Script Option B: Detailed & Professional */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border-l-4 border-blue-500 flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 block">
                Option B (Detailed & Professional)
              </span>
              <h4 className="text-xs font-semibold text-white">
                သင်ခန်းစာ & အသေးစိတ်ရှင်းပြချက် (Longer Video)
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                ~ {wordsB} words ({estSecondsB}s)
              </span>
              <button
                type="button"
                onClick={() =>
                  onCopy(config.optionB, 'Option B Script ကို ကူးယူပြီးပါပြီ!')
                }
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Copy Script B"
                aria-label="Option B စကားပြော စာသားကို Copy ယူပါ (Copy Option B Script)"
              >
                {copiedKey === config.optionB ? (
                  <Check className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <textarea
            rows={5}
            value={config.optionB}
            onChange={(e) => onChange({ ...config, optionB: e.target.value })}
            className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-burmese text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500"
          />

          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-[11px] text-blue-400 flex items-center gap-1 font-burmese">
              <Layers className="w-3 h-3 shrink-0" />
              <span>ရှည်လျားသော စာသားဖြစ်၍ ၈ စက္ကန့် အပိုင်းများ ခွဲရန် အကြံပြုပါသည်</span>
            </span>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onSendToGoogleVids?.(config.optionB)}
                className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-950/40 cursor-pointer"
                title="Google Vids Storyboard သို့ ပို့မည်"
              >
                <Clapperboard className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Google Vids Storyboard သို့ ပို့မည်</span>
              </button>
              <button
                type="button"
                onClick={() => onSendToChunker(config.optionB)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition font-medium text-center cursor-pointer"
              >
                ၈ စက္ကန့် အပိုင်းများ ခွဲမည် &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Confirmed Script Quick Actions Bar */}
        <div className="glass-card p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-emerald-950/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Clapperboard className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                အတည်ပြုပြီးသော စကားပြော (Confirmed Script Action)
              </span>
              <p className="text-xs text-slate-300 font-burmese">
                စကားပြောကို Google Vids သို့မဟုတ် Video Chunker စနစ်သို့ ပို့ဆောင်ပါ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                const target = config.optionB || config.optionA;
                onCopy(target, 'အတည်ပြုပြီးသော စကားပြော Script ကို ကူးယူပြီးပါပြီ!');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700/80"
              title="Copy Confirmed Script"
              aria-label="အတည်ပြုပြီးသော စကားပြော Script ကို Copy ယူပါ"
            >
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onSendToChunker(config.optionB || config.optionA)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer flex items-center gap-1.5 font-burmese"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
              <span>Send to Chunker</span>
            </button>
            <button
              type="button"
              onClick={() => onSendToGoogleVids?.(config.optionB || config.optionA)}
              className="flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer font-burmese"
            >
              <Clapperboard className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Google Vids Storyboard သို့ ပို့မည် (Send to Google Vids)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
