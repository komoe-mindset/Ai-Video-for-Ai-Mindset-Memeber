import React from 'react';
import {
  Wand2,
  Copy,
  Sparkles,
  MessageSquare,
  Send,
  ArrowRight,
  Check,
  Camera,
  Layers,
  Palette,
  User,
  Shirt,
  Image as ImageIcon,
  ExternalLink,
  Package,
  Smile,
  Maximize2,
} from 'lucide-react';
import { AvatarConfig, AvatarStyle } from '../types';
import {
  buildEnglishAvatarPrompt,
  buildBurmeseExplanation,
  buildGemAnswer,
} from '../utils/burmeseUtils';
import { PRESETS, GEMINI_GEM_URL, REFERENCE_TOOLS } from '../data/presets';

interface AvatarTabProps {
  config: AvatarConfig;
  onChange: (newConfig: AvatarConfig) => void;
  onGoToScript: () => void;
  onCopy: (text: string, message: string) => void;
  onEnhanceWithAI?: () => void;
  isEnhancing?: boolean;
  copiedKey: string | null;
}

export const AvatarTab: React.FC<AvatarTabProps> = ({
  config,
  onChange,
  onGoToScript,
  onCopy,
  onEnhanceWithAI,
  isEnhancing,
  copiedKey,
}) => {
  const handlePreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      onChange({ ...config, ...preset });
    }
  };

  const handleClothingPresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    let desc = config.clothingDescription;
    let color = config.clothingColor;

    if (val === 'traditional_silk') {
      desc =
        'Traditional authentic Myanmar Acheik silk htamein with intricate wavy tapestry weaving';
      color = 'Ruby red and gold intricate wave patterns';
    } else if (val === 'modern_blouse') {
      desc =
        'Modern tailored Myanmar Yinzi front-buttoned blouse with subtle embroidery';
      color = 'Emerald green silk with golden trims';
    } else if (val === 'men_taikpon') {
      desc =
        'Formal Myanmar Taikpon collarless jacket paired with traditional silk Paso';
      color = 'Charcoal black Taikpon jacket with crisp white collar';
    } else if (val === 'smart_casual') {
      desc =
        'Modern smart casual crisp linen button-down shirt with minimalist tailoring';
      color = 'Off-white linen and neutral chinos';
    } else if (val === 'corporate_suit') {
      desc =
        'Tailored executive navy blue blazer suit, crisp white inner shirt, professional look';
      color = 'Navy blue blazer with subtle satin lapels';
    }

    onChange({
      ...config,
      clothingPreset: val,
      clothingDescription: desc,
      clothingColor: color,
    });
  };

  const handleBgPresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    let detail = config.bgCustomDetail;

    if (val === 'studio_warm') {
      detail = 'Clean soft warm rim lighting, blurred bokeh plants in background';
    } else if (val === 'bagan_sunset') {
      detail =
        'Warm golden sunset hour, ancient Bagan brick pagodas in soft misty background';
    } else if (val === 'modern_office') {
      detail =
        'Modern high-tech co-working office, subtle architectural lights, depth of field';
    } else if (val === 'cozy_cafe') {
      detail =
        'Aesthetic modern cafe, soft morning sunbeams through wooden window frames';
    } else if (val === 'cyberpunk_city') {
      detail =
        'Futuristic high-tech Yangon street at night, neon teal and amber reflections';
    } else if (val === 'solid_gradient') {
      detail =
        'Minimalist neutral dark studio backdrop with a smooth vignette gradient';
    }

    onChange({
      ...config,
      bgPreset: val,
      bgCustomDetail: detail,
    });
  };

  const englishPrompt = buildEnglishAvatarPrompt(config);
  const burmeseExplanation = buildBurmeseExplanation(config);
  const gemAnswer = buildGemAnswer(config);

  const stylesList: { id: AvatarStyle; label: string; sub: string }[] = [
    { id: 'hyperrealistic', label: 'အစစ်လို (Realistic 8K)', sub: 'Photorealistic' },
    { id: 'pixar3d', label: '3D Pixar ကာတွန်း', sub: 'Cute Character' },
    { id: 'anime', label: 'Anime / Shinkai', sub: 'Japanese Anime' },
    { id: 'cinematic', label: 'Cinematic Movie 35mm', sub: 'Film Still' },
    { id: 'digitalArt', label: 'Digital Concept Art', sub: 'ArtStation' },
    { id: 'claymation', label: 'Claymation Cute 3D', sub: 'Stop Motion' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
      {/* Left Column: Form Controls (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
        {/* Quick Presets */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>အမြန်ရွေးချယ်ရန် ပုံစံများ (Quick Presets)</span>
            </h2>
            <span className="text-[10px] sm:text-xs text-slate-400">
              တစ်ခုနှိပ်ပြီး အစပြုပါ
            </span>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <button
              onClick={() => handlePreset('myanmar_influencer')}
              className="badge-chip text-left sm:text-center px-3 py-2 text-xs rounded-xl bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 min-h-[42px] flex items-center"
            >
              <span>🇲🇲 Modern Influencer</span>
            </button>
            <button
              onClick={() => handlePreset('traditional_acheik')}
              className="badge-chip text-left sm:text-center px-3 py-2 text-xs rounded-xl bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 min-h-[42px] flex items-center"
            >
              <span>🌸 ရိုးရာချိတ်ဝတ်စုံ & ပုဂံ</span>
            </button>
            <button
              onClick={() => handlePreset('pixar_3d')}
              className="badge-chip text-left sm:text-center px-3 py-2 text-xs rounded-xl bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 min-h-[42px] flex items-center"
            >
              <span>🎨 3D Pixar Cute Avatar</span>
            </button>
            <button
              onClick={() => handlePreset('corporate_male')}
              className="badge-chip text-left sm:text-center px-3 py-2 text-xs rounded-xl bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 min-h-[42px] flex items-center"
            >
              <span>👔 Corporate Guy</span>
            </button>
          </div>
        </div>

        {/* AI Video Reference Image Tools (Product, Cartoon Scene, Cartoon Avatar, Image Upscale) */}
        <div className="glass-card p-3 sm:p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-xs font-bold text-slate-200">
                AI Video Reference Tools (ရုပ်ပုံ & နောက်ခံ ထုတ်လုပ်ရန်)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-burmese">
              AI Video ထဲ Reference ပေးရန် သုံးပါ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {REFERENCE_TOOLS.map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 transition flex items-center justify-between group active:scale-95 shadow-sm"
                title={`${tool.name} - ${tool.description}`}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    {tool.category === 'product' && (
                      <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    {tool.category === 'scene' && (
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                    {tool.category === 'avatar' && (
                      <Smile className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    )}
                    {tool.category === 'upscale' && (
                      <Maximize2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    )}
                    <span className="text-[11px] font-semibold text-slate-200 group-hover:text-white truncate">
                      {tool.name}
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-burmese truncate mt-0.5">
                    {tool.nameMm}
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0 transition" />
              </a>
            ))}
          </div>
        </div>

        {/* 4 Core Gemini Gem Questions Form */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col gap-4 sm:gap-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">အဆင့် ၁။</span>
              <span>Avatar ပုံစံ အချက်အလက်များ</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              Gemini Gem မေးမည့် မေးခွန်း ၄ ခုကို ဤနေရာတွင် စိတ်ကြိုက် ချိန်ညှိနိုင်ပါသည်
            </p>
          </div>

          {/* Q1: Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                ၁
              </span>
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>ပုံစံ (Style)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {stylesList.map((s) => {
                const checked = config.style === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onChange({ ...config, style: s.id })}
                    className={`cursor-pointer border rounded-xl p-2.5 flex flex-col text-left transition ${
                      checked
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-semibold">{s.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{s.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q2: Character Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                ၂
              </span>
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>ဇာတ်ကောင် (Character)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2.5">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">ကျား / မ</label>
                <select
                  value={config.gender}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      gender: e.target.value as 'female' | 'male',
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="female">အမျိုးသမီး (Female)</option>
                  <option value="male">အမျိုးသား (Male)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">အသက်အရွယ်</label>
                <select
                  value={config.age}
                  onChange={(e) => onChange({ ...config, age: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="early 20s">အသက် ၂၀ ဝန်းကျင် (Youth)</option>
                  <option value="mid 20s">အသက် ၂၅ နှစ်ခန့် (Young Adult)</option>
                  <option value="early 30s">အသက် ၃၀ ဝန်းကျင် (Professional)</option>
                  <option value="mid 40s">အသက် ၄၀ ကျော် (Mature Executive)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">အမူအရာ</label>
                <select
                  value={config.expression}
                  onChange={(e) =>
                    onChange({ ...config, expression: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="warm confident smile, inviting eyes">
                    နွေးထွေးယုံကြည်မှုရှိသောအပြုံး
                  </option>
                  <option value="cheerful energetic smiling expression">
                    တက်ကြွရွှင်လန်းသောအမူအရာ
                  </option>
                  <option value="serious professional articulate look">
                    လေးနက်တည်ကြည်သောအသွင်
                  </option>
                  <option value="calm peaceful gentle expression">
                    အေးချမ်းနူးညံ့သောအသွင်
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">
                ဆံပင်ပုံစံ၊ မျက်နှာသွင်ပြင် အသေးစိတ်
              </label>
              <input
                type="text"
                value={config.customDetail}
                onChange={(e) =>
                  onChange({ ...config, customDetail: e.target.value })
                }
                placeholder="ဆံပင်ပုံစံ၊ မျက်နှာသွင်ပြင် ထပ်ဖြည့်ရန်..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Q3: Clothing */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                ၃
              </span>
              <Shirt className="w-3.5 h-3.5 text-emerald-400" />
              <span>အဝတ်အစား (Clothing)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">ဝတ်စုံပုံစံ</label>
                <select
                  value={config.clothingPreset}
                  onChange={handleClothingPresetChange}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="traditional_silk">
                    ရိုးရာ ပိုးချိတ်ထဘီ နှင့် ရင်စေ့ (Silk Acheik)
                  </option>
                  <option value="modern_blouse">
                    ခေတ်မီ မြန်မာရင်ဖုံးအင်္ကျီ (Modern Yinzi Blouse)
                  </option>
                  <option value="men_taikpon">
                    တိုက်ပုံအင်္ကျီ နှင့် ပိုးပုဆိုး (Taikpon & Paso)
                  </option>
                  <option value="smart_casual">
                    ပေါ့ပေါ့ပါးပါး စတိုင်လ် (Smart Casual Linen)
                  </option>
                  <option value="corporate_suit">
                    ရုံးဝတ်စုံ အနောက်တိုင်းကုတ် (Navy Blue Blazer)
                  </option>
                  <option value="custom">အခြား စိတ်ကြိုက်ထည့်သွင်းမည် (Custom)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">
                  အရောင် သို့မဟုတ် ဒီဇိုင်းအသေးစိတ်
                </label>
                <input
                  type="text"
                  value={config.clothingColor}
                  onChange={(e) =>
                    onChange({ ...config, clothingColor: e.target.value })
                  }
                  placeholder="ဥပမာ- Emerald green with gold floral embroidery"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">
                ဝတ်စုံအသေးစိတ်ဖော်ပြချက် (English)
              </label>
              <input
                type="text"
                value={config.clothingDescription}
                onChange={(e) =>
                  onChange({ ...config, clothingDescription: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Q4: Background */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                ၄
              </span>
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>နောက်ခံ (Background)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">နောက်ခံပုံစံ</label>
                <select
                  value={config.bgPreset}
                  onChange={handleBgPresetChange}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="studio_warm">
                    ခေတ်မီ စတူဒီယို အလင်းပျော့ (Warm Minimalist Studio)
                  </option>
                  <option value="bagan_sunset">
                    ပုဂံနေဝင်ချိန် ရှုခင်း (Bagan Ancient Pagodas at Sunset)
                  </option>
                  <option value="modern_office">
                    ခေတ်မီ အဆင့်မြင့်ရုံးခန်း (Bright Tech Startup Office)
                  </option>
                  <option value="cozy_cafe">
                    ကော်ဖီဆိုင် သဘာဝအလင်း (Cozy Aesthetic Cafe)
                  </option>
                  <option value="cyberpunk_city">
                    Cyberpunk ရန်ကုန်ညရှုခင်း (Futuristic Neon Cityscape)
                  </option>
                  <option value="solid_gradient">
                    သန့်ရှင်းသော အရောင်ပြေး (Clean Studio Gradient)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">
                  နောက်ခံ အလင်းနှင့် အသေးစိတ် (English)
                </label>
                <input
                  type="text"
                  value={config.bgCustomDetail}
                  onChange={(e) =>
                    onChange({ ...config, bgCustomDetail: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Aspect Ratio & Camera Framing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>ဗီဒီယို ဆိုဒ် (Aspect Ratio)</span>
              </label>
              <select
                value={config.aspectRatio}
                onChange={(e) => onChange({ ...config, aspectRatio: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="--ar 9:16">ဒေါင်လိုက် 9:16 (TikTok, Reels, Shorts)</option>
                <option value="--ar 16:9">အလျားလိုက် 16:9 (YouTube, Facebook Video)</option>
                <option value="--ar 1:1">လေးထောင့် 1:1 (Profile Picture, Instagram Post)</option>
                <option value="--ar 4:5">ဒေါင်လိုက်တို 4:5 (FB / IG Feed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>ကင်မရာ အကွာအဝေး (Framing)</span>
              </label>
              <select
                value={config.cameraFraming}
                onChange={(e) =>
                  onChange({ ...config, cameraFraming: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Medium close-up portrait, chest up">
                  အနီးကပ်ပုံတူ ရင်ဘတ်အထက် (Medium Close-up)
                </option>
                <option value="Close-up face portrait focus on facial expression">
                  မျက်နှာအနီးကပ် အမူအရာအဓိက (Close-up)
                </option>
                <option value="Waist-up portrait showing hand gestures">
                  ခါးအထက် လက်ဟန်ခြေဟန်ပါ (Waist-up)
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Generated Outputs (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Card 1: Ready English Prompt */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border-emerald-500/30 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-xs sm:text-sm font-bold text-emerald-300">
                English Avatar Prompt (AI Tool သို့ ထည့်ရန်)
              </h3>
            </div>
            <button
              onClick={() =>
                onCopy(englishPrompt, 'English Avatar Prompt ကို ကူးယူပြီးပါပြီ!')
              }
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 transition flex items-center gap-1 text-xs px-2.5 border border-slate-700"
            >
              {copiedKey === englishPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Midjourney, Flux, Stable Diffusion, Leonardo သို့မဟုတ် Imagen တွင် တိုက်ရိုက် သုံးနိုင်ပါသည်
          </p>

          <div className="bg-slate-950 p-3 sm:p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-200 leading-relaxed break-words min-h-[130px] select-all">
            {englishPrompt}
          </div>

          {/* Gemini Gem Link & Copy Action */}
          <div className="mt-3">
            <a
              href={GEMINI_GEM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                onCopy(
                  gemAnswer,
                  'မေးခွန်းအဖြေများကို Copy ယူပြီးပါပြီ! Gemini Gem သို့ ဖွင့်ပေးနေပါသည်...'
                );
              }}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:via-indigo-500 hover:to-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 transition active:scale-95 group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition shrink-0" />
              <span className="truncate">
                Gemini Gem တွင် စိတ်ကြိုက် ပြင်ဆင်မည် (Copy & Open Gem)
              </span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-0.5 opacity-85" />
            </a>
            <p className="text-[10px] text-slate-400 text-center mt-1.5 font-burmese">
              ကလစ်နှိပ်ပါက မေးခွန်းအဖြေများကို အလိုအလျောက် Copy ယူပြီး Gemini Gem တွင် ချက်ချင်း Paste ပြုလုပ်နိုင်ပါသည်
            </p>
          </div>
        </div>

        {/* Card 2: Burmese Explanation (Step 3 Output) */}
        <div className="glass-card p-4 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>မြန်မာလို ရှင်းပြချက် (Gemini Gem Step 3)</span>
            </h4>
            <button
              type="button"
              onClick={() =>
                onCopy(
                  burmeseExplanation,
                  'မြန်မာလို ရှင်းပြချက်ကို ကူးယူပြီးပါပြီ!'
                )
              }
              className="text-xs text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
              title="Copy"
              aria-label="မြန်မာလို ရှင်းပြချက်ကို Copy ယူပါ (Copy Burmese explanation)"
            >
              {copiedKey === burmeseExplanation ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 font-burmese">
            {burmeseExplanation}
          </div>
        </div>

        {/* Card 3: Ready Burmese Answer to feed the Gemini Gem */}
        <div className="glass-card p-4 rounded-2xl flex flex-col bg-slate-900/40 border-dashed border-slate-700">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>Gemini Gem ထဲသို့ ပြန်လည်ပို့မည့် အဖြေ</span>
            </h4>
            <button
              onClick={() =>
                onCopy(
                  gemAnswer,
                  'Gemini သို့ ပေးပို့မည့် အဖြေကို ကူးယူပြီးပါပြီ!'
                )
              }
              className="p-1 rounded-md bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white text-xs px-2 border border-blue-500/30 transition flex items-center gap-1"
            >
              {copiedKey === gemAnswer ? (
                <>
                  <Check className="w-3 h-3 text-blue-300" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Answer</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Gemini Gem က မေးခွန်း ၄ ခု မေးသောအခါ ဤစာသားကို ကူးပြီး ချက်ချင်းပို့နိုင်ပါသည်:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg text-xs font-burmese text-slate-300 whitespace-pre-line select-all leading-relaxed">
            {gemAnswer}
          </div>
        </div>

        {/* Next Step Transition Button */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onGoToScript}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-medium text-xs flex items-center justify-center gap-2 transition border border-emerald-500/30 shadow-md"
          >
            <span>အဆင့် ၂: Script ဖန်တီးခြင်းသို့ သွားမည်</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
