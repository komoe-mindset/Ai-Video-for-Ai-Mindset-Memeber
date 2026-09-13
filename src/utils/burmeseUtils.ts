import { ActionVariation, AvatarConfig, VideoChunk } from '../types';

export function countWordsBurmese(str: string): number {
  if (!str) return 0;
  const clean = str.replace(/[။၊,.?!]/g, ' ');
  const tokens = clean.trim().split(/\s+/).filter(Boolean);
  return tokens.length;
}

export function buildEnglishAvatarPrompt(config: AvatarConfig): string {
  let styleKeywords = '';
  switch (config.style) {
    case 'hyperrealistic':
      styleKeywords =
        'Ultra-photorealistic portrait photograph, 8k resolution, shot on 85mm lens f/1.4, cinematic natural lighting, hyper-detailed skin texture, raw photo, masterpiece';
      break;
    case 'pixar3d':
      styleKeywords =
        'Cute 3D animated avatar, Disney Pixar character design style, Octane 3D render, smooth subsurface scattering skin, volumetric studio lighting, vibrant colors, expressive features';
      break;
    case 'anime':
      styleKeywords =
        'Modern high-end anime character art style, Makoto Shinkai aesthetic, finely detailed anime eyes, cinematic composition, radiant atmosphere, crisp line-art';
      break;
    case 'cinematic':
      styleKeywords =
        'Cinematic 35mm film still, Kodak Portra color grading, dramatic soft Rembrandt lighting, shallow depth of field, subtle motion blur, high visual storytelling';
      break;
    case 'digitalArt':
      styleKeywords =
        'Highly detailed digital character portrait, ArtStation trending, concept art by famous character illustrators, rim lighting, dynamic color harmony';
      break;
    case 'claymation':
      styleKeywords =
        'Adorable handcrafted claymation sculpture, soft clay textures, cute felt clothing details, stop-motion animation aesthetic, miniature studio lighting';
      break;
  }

  const clothingPart = config.clothingColor
    ? `${config.clothingColor}, ${config.clothingDescription}`
    : config.clothingDescription;

  return `${config.cameraFraming} of a ${config.age} Myanmar ${config.gender}, ${config.expression}, ${config.customDetail}. Wearing ${clothingPart}. Background: ${config.bgCustomDetail}. ${styleKeywords} ${config.aspectRatio} --v 6.1`;
}

export function getStyleBurmeseName(style: string): string {
  switch (style) {
    case 'hyperrealistic':
      return 'အစစ်လို (Hyper-realistic 8K ဓာတ်ပုံစတိုင်လ်)';
    case 'pixar3d':
      return '3D Pixar ကာတွန်းပုံစံ (Cute & Stylized)';
    case 'anime':
      return 'Anime အနုပညာပုံစံ (Makoto Shinkai စတိုင်လ်)';
    case 'cinematic':
      return 'ရုပ်ရှင်ဆန်သော ရုပ်ထွက် (Cinematic Film 35mm)';
    case 'digitalArt':
      return 'Digital Concept Art စတိုင်လ်';
    case 'claymation':
      return 'Claymation ရွှံ့စေးကာတွန်းပုံစံ';
    default:
      return 'စိတ်ကြိုက်စတိုင်လ်';
  }
}

export function buildBurmeseExplanation(config: AvatarConfig): string {
  const styleName = getStyleBurmeseName(config.style);
  const genderName = config.gender === 'female' ? 'မြန်မာအမျိုးသမီး' : 'မြန်မာအမျိုးသား';
  return `ဒီ Prompt လေးကတော့ ${styleName} ဖြင့် ဖန်တီးထားပြီး၊ ${config.age} ${genderName} ဇာတ်ကောင်ဖြစ်ပါသည်။ ${config.clothingDescription} ကို ဝတ်ဆင်ထားပြီး နောက်ခံတွင် ${config.bgCustomDetail} ဖြင့် အလင်းအမှောင် ကျကျနန စီစဉ်ပေးထားပါသည်။ Aspect Ratio ကို ${config.aspectRatio} သတ်မှတ်ထားသဖြင့် Video သို့မဟုတ် Social Media တွင် တိုက်ရိုက် သုံးနိုင်ပါသည်ခင်ဗျာ။`;
}

export function buildGemAnswer(config: AvatarConfig): string {
  const styleName = getStyleBurmeseName(config.style);
  const genderName = config.gender === 'female' ? 'အမျိုးသမီး' : 'အမျိုးသား';
  return `၁။ ပုံစံ - ${styleName}
၂။ ဇာတ်ကောင် - ${config.age}၊ ${genderName}၊ ${config.customDetail}
၃။ အဝတ်အစား - ${config.clothingDescription} (${config.clothingColor})
၄။ နောက်ခံ - ${config.bgCustomDetail}
၅။ ဗီဒီယိုဆိုဒ် - ${config.aspectRatio}`;
}

export function generateLocalScripts(
  topic: string,
  tone: string,
  lang: string
): { optionA: string; optionB: string } {
  const t = topic.trim() || 'AI နည်းပညာ အသုံးပြုနည်း';
  let scriptA = '';
  let scriptB = '';

  if (tone === 'friendly') {
    scriptA = `မင်္ဂလာပါ! ${t} နဲ့ ပတ်သက်ပြီး လူတိုင်းသိထားသင့်တဲ့ အလွယ်ဆုံးနည်းလမ်းလေးကို ဒီ ၈ စက္ကန့်အတွင်းမှာ မျှဝေပေးချင်ပါတယ်ခင်ဗျာ။ အခုပဲ စမ်းကြည့်လိုက်ပါ။`;
    scriptB = `မင်္ဂလာပါခင်ဗျာ။ ဒီနေ့မှာတော့ ${t} အကြောင်းကို အသေးစိတ် ရှင်းပြပေးသွားပါမယ်။ လူအများစု သတိမထားမိကြတဲ့ အဓိက အချက် ၂ ချက်ရှိပါတယ်။ ပထမအချက်ကတော့ အချိန်ကို မှန်ကန်စွာ စီမံခန့်ခွဲဖို့ဖြစ်ပြီး၊ ဒုတိယအချက်ကတော့ စနစ်တကျ လက်တွေ့လေ့ကျင့်ဖို့ ဖြစ်ပါတယ်။ ဒီအဆင့်တွေကို လိုက်လုပ်ရုံနဲ့ သိသာတဲ့ ရလဒ်ကောင်းတွေ ချက်ချင်း ရရှိလာမှာ သေချာပါတယ်ခင်ဗျာ။`;
  } else if (tone === 'professional') {
    scriptA = `မင်္ဂလာပါရှင်။ ${t} ၏ အဓိက မဟာဗျူဟာနှင့် လုပ်ငန်းခွင် အသုံးချမှု လျှို့ဝှက်ချက်များကို တိုတိုတုတ်တုတ် တင်ပြပေးပါမည်။`;
    scriptB = `မင်္ဂလာပါခင်ဗျာ။ ယနေ့ခေတ် ပြိုင်ဆိုင်မှုပြင်းထန်သော ဈေးကွက်အတွင်း ${t} သည် အလွန်အရေးပါသော ကဏ္ဍမှ ပါဝင်နေပါသည်။ ကျွမ်းကျင်သူများ၏ သုတေသနပြုချက်များအရ ဤနည်းပညာကို ထိရောက်စွာ အသုံးပြုခြင်းဖြင့် ကုန်ထုတ်လုပ်မှုကို နှစ်ဆ တိုးတက်စေနိုင်ပါသည်။ စနစ်တကျ အကောင်အထည်ဖော်ရန် လိုအပ်သော အဆင့်များကို ဆက်လက် တင်ပြပေးသွားပါမည်။`;
  } else {
    // urgent
    scriptA = `ဒါကို လုံးဝ လက်မလွှတ်ပါနဲ့! ${t} ကို အခုချက်ချင်း မသိထားရင် သင် အများကြီး နောက်ကျကျန်ခဲ့ပါလိမ့်မယ်။ အခုပဲ ကြည့်လိုက်ပါ!`;
    scriptB = `သတိထားပါ! ၂၀၂၆ ခုနှစ်မှာ ${t} ကို မသုံးတတ်သေးဘူးဆိုရင် သင့်အတွက် အခွင့်အရေးတွေ ဆုံးရှုံးနေပါပြီ။ မိနစ်အနည်းငယ်အတွင်းမှာပဲ သင့်ဘဝကို အလှည့်အပြောင်း ဖြစ်စေမယ့် လျှို့ဝှက်နည်းလမ်းကို ဒီဗီဒီယိုမှာ ချက်ချင်း ဖော်ပြပေးလိုက်ပါတယ်။ နောက်မကျခင် အခုပဲ စတင်လိုက်ပါ!`;
  }

  if (lang === 'burmish') {
    scriptA = scriptA
      .replace('နည်းလမ်းလေး', 'Simple Tips & Tricks လေး')
      .replace('စမ်းကြည့်လိုက်ပါ', 'Try လုပ်ကြည့်လိုက်ပါ');
  }

  return { optionA: scriptA, optionB: scriptB };
}

export function chunkScriptFor8Seconds(
  text: string,
  variation: ActionVariation
): VideoChunk[] {
  const cleanText = text.trim();
  if (!cleanText) return [];

  // Split by sentence ends: Myanmar '။', '!', '?', newline
  let sentences = cleanText
    .split(/(?<=[။!?\n])/)
    .map((s) => s.trim())
    .filter(Boolean);

  // If sentence is too long or only 1 big block, also split by Myanmar comma '၊'
  if (sentences.length === 1 && countWordsBurmese(sentences[0]) > 20) {
    sentences = cleanText
      .split(/(?<=[၊,])/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const chunksText: string[] = [];
  let currentGroup = '';
  let currentCount = 0;

  for (const s of sentences) {
    const wCount = countWordsBurmese(s);
    if (currentCount + wCount > 18 && currentGroup) {
      chunksText.push(currentGroup.trim());
      currentGroup = s;
      currentCount = wCount;
    } else {
      currentGroup += (currentGroup ? ' ' : '') + s;
      currentCount += wCount;
    }
  }
  if (currentGroup.trim()) {
    chunksText.push(currentGroup.trim());
  }

  // Camera variations
  const dynamicActions = [
    'Medium close-up shot, confident warm smile, speaking directly to camera, subtle affirmative nod. Smooth cinematic motion, realistic lip-sync matching Burmese speech.',
    'Slightly closer portrait shot, animated gentle hand gestures emphasizing speech points, natural eye contact, expressive eyebrows. High fidelity, stable camera.',
    'Waist-up framing, open welcoming body language, dynamic subtle tilt, friendly enthusiastic vocal cadence. Lifelike mouth movement, photorealistic render.',
    'Close-up shot on face, cheerful friendly goodbye gesture, warm smile, articulate mouth movements. Smooth 4k output.',
  ];

  const steadyActions = [
    'Centered medium shot, stable tripod camera, natural blinking, precise speech articulation and subtle head gestures. Realistic lip-sync.',
    'Centered medium shot, steady framing, calm professional posture, articulate speech movement.',
    'Centered medium shot, stable framing, warm concluding expression, natural head motion.',
  ];

  const cinematicActions = [
    'Cinematic medium shot, soft camera push-in, engaging speaker posture, natural speech motion.',
    'Close-up camera cut, shallow focus, expressive facial articulation, clear lip-sync.',
    'Return to medium shot, slight camera pan, confident conclusion gesture.',
  ];

  const actionList =
    variation === 'dynamic'
      ? dynamicActions
      : variation === 'steady'
      ? steadyActions
      : cinematicActions;

  return chunksText.map((chunkText, idx) => {
    const act = actionList[idx % actionList.length];
    return {
      shotNum: idx + 1,
      totalShots: chunksText.length,
      scriptBurmese: chunkText,
      videoPrompt: `Animate the uploaded avatar. ${act} Maintain character identity, consistent clothing, and lighting.`,
      wordCount: countWordsBurmese(chunkText),
    };
  });
}
