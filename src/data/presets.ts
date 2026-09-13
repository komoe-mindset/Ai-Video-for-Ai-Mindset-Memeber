import { AvatarConfig } from '../types';

export const GEMINI_GEM_URL =
  'https://gemini.google.com/gem/1ovsqxG_MOuB1VPHxkjGtPKAOmoIJBl0h?usp=sharing';

export interface ReferenceTool {
  id: string;
  name: string;
  nameMm: string;
  description: string;
  url: string;
  badge: string;
  category: 'product' | 'scene' | 'avatar';
}

export const REFERENCE_TOOLS: ReferenceTool[] = [
  {
    id: 'product-studio',
    name: 'Product Image Studio',
    nameMm: 'ကုန်ပစ္စည်း ဓာတ်ပုံ စတူဒီယို',
    description:
      'ကုန်ပစ္စည်းကြော်ငြာနှင့် AI Video ထဲ ထည့်သွင်းမည့် Product Reference Image များ ထုတ်လုပ်ရန်',
    url: 'https://gemini.google.com/share/2a43a27a3f3c?skid=b22d3e5a-3872-452a-b9eb-a21970086db1',
    badge: 'Product Reference',
    category: 'product',
  },
  {
    id: 'cartoon-scene',
    name: '2D Cartoon Scene Compositor',
    nameMm: '2D ကာတွန်း နောက်ခံအခင်းအကျင်း',
    description:
      'ကာတွန်း ဗီဒီယိုများအတွက် အခန်းနောက်ခံ (Scene & Environment) Reference Image ရေးဆွဲရန်',
    url: 'https://gemini.google.com/share/40f1d88c578c?skid=1e5489bd-ff2c-4a55-8cb1-239b86d622f3',
    badge: 'Scene Reference',
    category: 'scene',
  },
  {
    id: 'cartoon-avatar',
    name: '2D Cartoon Avatar Compositor',
    nameMm: '2D ကာတွန်း ဇာတ်ကောင် Avatar',
    description:
      '2D ကာတွန်းဇာတ်ကောင်နှင့် ကာတွန်း Avatar Reference ရုပ်ပုံများ တည်ဆောက်ရန်',
    url: 'https://gemini.google.com/share/0bfacba66746?skid=0164a496-4aa1-4d84-918f-c0e9f2d04307',
    badge: 'Cartoon Avatar',
    category: 'avatar',
  },
];

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  style: 'hyperrealistic',
  gender: 'female',
  age: 'mid 20s',
  expression: 'warm confident smile, inviting eyes',
  customDetail: 'Neat modern bun hairstyle, flawless natural tan skin, bright expressive eyes',
  clothingPreset: 'modern_blouse',
  clothingColor: 'Emerald green with gold floral embroidery',
  clothingDescription: 'Elegant traditional modern Myanmar blouse with subtle delicate neckline embroidery',
  bgPreset: 'studio_warm',
  bgCustomDetail: 'Clean soft warm rim lighting, blurred bokeh plants in background',
  aspectRatio: '--ar 9:16',
  cameraFraming: 'Medium close-up portrait, chest up',
};

export const PRESETS: Record<string, Partial<AvatarConfig>> = {
  myanmar_influencer: {
    style: 'hyperrealistic',
    gender: 'female',
    age: 'mid 20s',
    expression: 'warm confident smile, inviting eyes',
    customDetail:
      'Naturally radiant warm tan skin, modern wavy hair tied back neatly, soft cosmetic makeup, realistic Burmese aesthetic',
    clothingPreset: 'modern_blouse',
    clothingColor: 'Emerald green silk with golden trims',
    clothingDescription:
      'Chic fitted modern Burmese Yinzi blouse with jade frog buttons',
    bgPreset: 'studio_warm',
    bgCustomDetail:
      'Soft aesthetic content creator studio, diffused lighting, subtle houseplants in background',
    aspectRatio: '--ar 9:16',
    cameraFraming: 'Medium close-up portrait, chest up',
  },
  traditional_acheik: {
    style: 'cinematic',
    gender: 'female',
    age: 'early 20s',
    expression: 'calm peaceful gentle expression',
    customDetail:
      'Traditional high floral hair bun, jasmine flower garland, golden earrings, graceful posture',
    clothingPreset: 'traditional_silk',
    clothingColor: 'Ruby red and gold intricate wave patterns',
    clothingDescription:
      'Authentic traditional Amarapura silk Acheik htamein and delicate lace Yinzi blouse',
    bgPreset: 'bagan_sunset',
    bgCustomDetail:
      'Panoramic view of ancient Bagan brick pagodas bathed in warm golden hour sunset glow',
    aspectRatio: '--ar 16:9',
    cameraFraming: 'Waist-up portrait showing hand gestures',
  },
  pixar_3d: {
    style: 'pixar3d',
    gender: 'female',
    age: 'early 20s',
    expression: 'cheerful energetic smiling expression',
    customDetail:
      'Big expressive Pixar eyes, adorable smile, smooth cartoon stylized features, glossy hair',
    clothingPreset: 'modern_blouse',
    clothingColor: 'Vibrant pastel yellow and teal',
    clothingDescription:
      'Stylized 3D animated modern Burmese blouse with cute round buttons',
    bgPreset: 'studio_warm',
    bgCustomDetail:
      'Playful colorful 3D studio background, soft volumetric lighting, vibrant cartoon depth',
    aspectRatio: '--ar 9:16',
    cameraFraming: 'Medium close-up portrait, chest up',
  },
  corporate_male: {
    style: 'hyperrealistic',
    gender: 'male',
    age: 'early 30s',
    expression: 'serious professional articulate look',
    customDetail:
      'Clean-cut modern hairstyle, sharp jawline, charismatic friendly executive look',
    clothingPreset: 'men_taikpon',
    clothingColor: 'Charcoal black Taikpon jacket with crisp white collar',
    clothingDescription:
      'Modern formal Myanmar Taikpon jacket worn over a crisp mandarin collar shirt',
    bgPreset: 'modern_office',
    bgCustomDetail:
      'Modern architectural tech office with floor-to-ceiling glass windows and soft ambient light',
    aspectRatio: '--ar 16:9',
    cameraFraming: 'Medium close-up portrait, chest up',
  },
};

export const GEM_SYSTEM_INSTRUCTION = `You are a friendly and expert Avatar Prompt Engineer. Your job is to help Myanmar users create the perfect prompt for generating AI avatars.

Core Rules:
1. Language: You MUST communicate, ask questions, and explain things to the user entirely in the Myanmar language (Burmese). Do not use any Thai script or other languages.
2. Output Language: The final prompt you generate for them MUST be in highly detailed English, as this works best for AI image generators.
3. Conversational Approach: Do not ask them to provide everything at once. Greet them warmly and ask them 4 simple questions to build their avatar:
   - ၁။ ပုံစံ (Style): 3D ကာတွန်းပုံစံလား၊ အစစ်လို (Realistic) လား၊ Anime ပုံစံလား။
   - ၂။ ဇာတ်ကောင် (Character): အသက်အရွယ်၊ ကျား/မ၊ ဆံပင်ပုံစံ၊ နဲ့ မျက်နှာသွင်ပြင် ဘယ်လိုရှိမလဲ။
   - ၃။ အဝတ်အစား (Clothing): ဘယ်လိုအဝတ်အစား ဝတ်ထားစေချင်လဲ (ဥပမာ - မြန်မာဝတ်စုံ၊ ရုံးဝတ်စုံ၊ ပေါ့ပေါ့ပါးပါး)။
   - ၄။ နောက်ခံ (Background): နောက်ခံမှာ ဘာတွေပါစေချင်လဲ (ဥပမာ - ရုံးခန်း၊ သဘာဝရှုခင်း၊ ရိုးရိုးအရောင်)။

Step 2: Generate the English Prompt (Professional, detailed photography or 3D art terms).
Step 3: Presentation: Present prompt in English, explain briefly in Myanmar.
Step 4: Confirm and Transition to Dialogue.
Step 5: Dialogue Questionnaire (Topic, Tone, Language).
Step 6: Speech-Optimized Script (Option A: Short/Catchy, Option B: Detailed/Pro). Short sentences, simple words.
Step 7 & 8: 8-Second Shot Chunker. Break script into 8-second chunks (under 20 words per shot). Provide ONLY one chunk at a time formatted with Video Animation Prompt (English) and Audio TTS Prompt (Burmese).
Step 9 & 10: Wait for "Next" or "နောက်တစ်ပိုင်း" before generating the next chunk.`;

export const VOCABULARY_ITEMS = {
  femaleAttire: [
    {
      titleMy: 'ချိတ်ထဘီ နှင့် ရင်ဖုံးအင်္ကျီ',
      prompt: 'traditional Myanmar Acheik silk htamein with woven wavy patterns, matching high-collared tailored blouse',
    },
    {
      titleMy: 'ခေတ်မီ ရင်စေ့ (Yinzi) ကျောက်ကြယ်သီး',
      prompt: 'elegant modern Yinzi blouse with jade buttons, delicate lace sleeve hems, paired with slim silk longyi',
    },
    {
      titleMy: 'မန္တလေးနန်းတွင်း ဝတ်စုံစတိုင်လ်',
      prompt: 'regal Mandalay era court attire, velvet gold-threaded cape, ornate golden earplugs, refined royal poise',
    },
    {
      titleMy: 'ပန်းရိုက် ချည်ထည် ပေါ့ပါးဝတ်စုံ',
      prompt: 'casual youth pastel floral printed Burmese cotton blouse, modern minimalist styling',
    },
  ],
  maleAttire: [
    {
      titleMy: 'တိုက်ပုံအင်္ကျီ နှင့် ပိုးပုဆိုး',
      prompt: 'traditional Myanmar formal Taikpon jacket over collarless white shirt, paired with deep colored silk Paso, gentle authoritative demeanor',
    },
    {
      titleMy: 'ခေါင်းပေါင်း နှင့် မင်္ဂလာဝတ်စုံ',
      prompt: 'ceremonial Gaung Baung silk headwrap, golden embroidery Taikpon, distinguished Myanmar gentleman',
    },
  ],
  lightingAndCamera: [
    {
      titleMy: 'Studio Soft Rim Light (အနုပညာဆန်သောအလင်း)',
      prompt: 'soft Rembrandt studio lighting, subtle golden edge rim light, 85mm lens f/1.8 shallow depth of field',
    },
    {
      titleMy: 'Ultra-Realistic Skin (အသားအရေ အစစ်အတိုင်း)',
      prompt: 'photorealistic 8k octane render, hyper-detailed skin texture, realistic subsurface scattering, masterpiece',
    },
  ],
};
