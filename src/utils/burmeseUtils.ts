import { ActionVariation, AvatarConfig, GoogleVidsScene, VideoChunk } from '../types';

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

/**
 * Counts Burmese syllables based on consonant onsets (excluding asat killers)
 * and independent vowels, with proportional weighting for mixed English terms.
 */
export function countBurmeseSyllables(text: string): number {
  if (!text) return 0;
  const clean = text.replace(/[။၊,.?!:;"'()\-—]/g, ' ').trim();
  if (!clean) return 0;

  // Burmese syllable onsets: consonants not followed by asat (\u103A), plus independent vowels (\u1023-\u102A),
  // Great Sa (\u103F), and Myanmar letter ဉ/ၐ/ etc.
  const burmeseConsonantsNotAsat = clean.match(
    /[\u1000-\u1021\u103F\u1023-\u102A\u104E](?!\u103A)/g
  );
  const burmeseCount = burmeseConsonantsNotAsat ? burmeseConsonantsNotAsat.length : 0;

  // Mixed English words
  const englishWords = clean.match(/[a-zA-Z0-9]+/g);
  let englishSyllables = 0;
  if (englishWords) {
    for (const word of englishWords) {
      englishSyllables += Math.max(1, Math.ceil(word.length / 3));
    }
  }

  return Math.max(1, burmeseCount + englishSyllables);
}

interface SceneStoryboardTemplate {
  defaultTitle: string;
  defaultOnScreen: string;
  slideVisual: string;
  avatarMotion: string;
}

const GOOGLE_VIDS_STORYBOARD_TEMPLATES: SceneStoryboardTemplate[] = [
  {
    defaultTitle: 'အခန်း ၁ - မိတ်ဆက် (Scene 1: Introduction)',
    defaultOnScreen: 'နိဒါန်း • အဓိက အကြောင်းအရာနှင့် ရည်ရွယ်ချက်',
    slideVisual:
      '16:9 widescreen presentation slide, modern minimalist corporate tech aesthetic, avatar circle placeholder on bottom-right featuring an avatar in a modern Taikpon jacket with crisp mandarin collar, clean typography layout with subtle glassmorphism container and balanced negative space.',
    avatarMotion:
      'Medium close-up, confident presentation stance, subtle nod, open palm gesture toward slide content, direct eye contact with warm welcoming expression.',
  },
  {
    defaultTitle: 'အခန်း ၂ - အဓိက အယူအဆ (Scene 2: Core Concept)',
    defaultOnScreen: 'အဓိက အချက် • စနစ်တကျ ပြင်ဆင်ခြင်းနှင့် နည်းဗျူဟာ',
    slideVisual:
      '16:9 widescreen presentation slide, modern minimalist corporate tech aesthetic, clean infographic card layout with dual-tone emerald and slate styling, avatar circle placeholder on bottom-left featuring an avatar in an elegant traditional Acheik pattern silk scarf and formal attire, clean typography layout with glowing pillar badges.',
    avatarMotion:
      'Waist-up framing, dynamic conversational hand gestures explaining concepts, subtle head tilt, articulate lip movements synchronized with Burmese speech.',
  },
  {
    defaultTitle: 'အခန်း ၃ - လက်တွေ့ အသုံးချမှု (Scene 3: Practical Workflow)',
    defaultOnScreen: 'အဆင့်ဆင့် လုပ်ဆောင်ချက် • ထိရောက်သော အသုံးချနည်းများ',
    slideVisual:
      '16:9 widescreen presentation slide, modern minimalist corporate tech aesthetic, three-pillar workflow diagram with sleek glowing directional vectors, avatar circle placeholder on bottom-right featuring an avatar in an elegant Yinzi lace blouse with subtle Myanmar floral motif, clean typography layout.',
    avatarMotion:
      'Medium shot, attentive and professional posture, points smoothly toward on-screen diagram, calm affirmative blinking, precise cadence.',
  },
  {
    defaultTitle: 'အခန်း ၄ - အကျိုးကျေးဇူး (Scene 4: Key Results & Impact)',
    defaultOnScreen: 'အကျိုးကျေးဇူး • တိုင်းတာနိုင်သော အောင်မြင်မှု ရလဒ်များ',
    slideVisual:
      '16:9 widescreen presentation slide, modern minimalist corporate tech aesthetic, bold metric visualization with circular progress gauge and verified checkmark cards, avatar circle placeholder on bottom-left wearing tailored modern Myanmar silk attire with Acheik patterns, clean typography layout.',
    avatarMotion:
      'Medium close-up, enthusiastic and reassuring expression, emphatic two-handed gesture highlighting key metric, radiant smile.',
  },
  {
    defaultTitle: 'အခန်း ၅ - နိဂုံး & ဆောင်ရွက်ချက် (Scene 5: Summary & Call to Action)',
    defaultOnScreen: 'နိဂုံးချုပ် • ယခုပဲ လက်တွေ့ စတင်လိုက်ပါ',
    slideVisual:
      '16:9 widescreen presentation slide, modern minimalist corporate tech aesthetic, high-impact concluding layout with prominent call-to-action banner, interactive scan placeholder, avatar circle placeholder on bottom-right featuring an avatar in a traditional formal modern Taikpon jacket and Acheik pattern silk Longyi, clean typography layout.',
    avatarMotion:
      'Close-up cut, warm closing smile, graceful traditional polite hand placement, friendly concluding nod toward audience.',
  },
];

function getTemplateForSceneIndex(index: number, total: number): SceneStoryboardTemplate {
  if (index === 0) return GOOGLE_VIDS_STORYBOARD_TEMPLATES[0];
  if (index === total - 1) return GOOGLE_VIDS_STORYBOARD_TEMPLATES[4];
  if (total === 2) {
    return GOOGLE_VIDS_STORYBOARD_TEMPLATES[4];
  }
  if (total === 3) {
    return GOOGLE_VIDS_STORYBOARD_TEMPLATES[2]; // Yinzi lace blouse workflow
  }
  if (total === 4) {
    return index === 1
      ? GOOGLE_VIDS_STORYBOARD_TEMPLATES[1] // Acheik
      : GOOGLE_VIDS_STORYBOARD_TEMPLATES[2]; // Yinzi
  }
  return GOOGLE_VIDS_STORYBOARD_TEMPLATES[index % GOOGLE_VIDS_STORYBOARD_TEMPLATES.length];
}

function getSceneTitle(index: number, total: number, fallbackTitle: string): string {
  const sceneNum = index + 1;
  if (total === 2) {
    return index === 0
      ? 'အခန်း ၁ - မိတ်ဆက် (Scene 1: Introduction)'
      : 'အခန်း ၂ - နိဂုံး & ဆောင်ရွက်ချက် (Scene 2: Summary & Call to Action)';
  }
  if (total === 3) {
    if (index === 0) return 'အခန်း ၁ - မိတ်ဆက် (Scene 1: Introduction)';
    if (index === 1) return 'အခန်း ၂ - အဓိက အချက်အလက် (Scene 2: Core Concept & Workflow)';
    return 'အခန်း ၃ - နိဂုံး & ဆောင်ရွက်ချက် (Scene 3: Summary & Call to Action)';
  }
  if (total === 4) {
    if (index === 0) return 'အခန်း ၁ - မိတ်ဆက် (Scene 1: Introduction)';
    if (index === 1) return 'အခန်း ၂ - အဓိက အယူအဆ (Scene 2: Core Concept)';
    if (index === 2) return 'အခန်း ၃ - လက်တွေ့ အသုံးချမှု (Scene 3: Practical Workflow)';
    return 'အခန်း ၄ - နိဂုံး & ဆောင်ရွက်ချက် (Scene 4: Summary & Call to Action)';
  }
  return fallbackTitle
    .replace(/အခန်း \d+/, `အခန်း ${sceneNum}`)
    .replace(/Scene \d+/, `Scene ${sceneNum}`);
}

function deriveOnScreenText(narration: string, fallback: string, sceneNum: number): string {
  if (!narration) return fallback;
  const firstSentence = narration.split(/[။၊\n,]/)[0].trim();
  const tokens = firstSentence.split(/\s+/).filter(Boolean);
  if (tokens.length >= 1 && tokens.length <= 7) {
    return `အချက် ${sceneNum} • ${firstSentence}`;
  } else if (tokens.length > 7) {
    return `အချက် ${sceneNum} • ${tokens.slice(0, 5).join(' ')}...`;
  }
  return fallback;
}

/**
 * Splits a Burmese script by sentence terminators ('။' and newlines) or clause boundaries,
 * and intelligently groups them into 2 to 5 coherent Google Vids scenes
 * with syllable-paced duration estimation (clamped 5s - 20s), authentic Myanmar cultural attire
 * (Taikpon, Acheik, Yinzi), 16:9 modern minimalist English slide layouts, and avatar gesture directives.
 */
export function generateGoogleVidsScenes(script: string): GoogleVidsScene[] {
  const cleanText = (script || '').trim();

  // 1. Handle empty strings or whitespace-only strings gracefully without returning empty arrays
  const textToProcess =
    cleanText ||
    'မင်္ဂလာပါခင်ဗျာ။ ဤတင်ဆက်မှုတွင် အဓိက အကြောင်းအရာနှင့် နည်းဗျူဟာများကို စနစ်တကျ ရှင်းပြပေးသွားပါမည်။ လက်တွေ့ အသုံးချနိုင်မည့် အဆင့်များကို အတူတကွ ဆက်လက် လေ့လာကြည့်ရှုလိုက်ပါ။';

  // 2. Sentence terminators splitting ('။', newlines, '!', '?')
  let segments = textToProcess
    .split(/(?<=[။\n!?])/)
    .map((s) => s.trim())
    .filter(Boolean);

  // If fewer than 3 sentences, divide logically into 2 or 3 scenes based on comma ('၊') pauses or clause boundaries
  if (segments.length < 3) {
    const commaSplits = textToProcess
      .split(/(?<=[၊,;])/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (commaSplits.length >= 2) {
      segments = commaSplits;
    } else {
      // Split by common Burmese conjunctions / clause boundaries
      const conjunctionRegex =
        /\s*(?:နှင့်|ပြီးနောက်|ပြီးလျှင်|ဖြစ်ပြီး|ထို့ကြောင့်|ထို့နောက်|ဒါ့အပြင်|သို့သော်|ပြီးတော့)\s+/;
      if (conjunctionRegex.test(textToProcess)) {
        segments = textToProcess
          .split(conjunctionRegex)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
  }

  // If still a single continuous sentence/segment, split into 2 or 3 balanced clauses rather than creating a bloated single scene
  if (segments.length === 1) {
    const single = segments[0];
    const words = single.split(/\s+/).filter(Boolean);
    if (words.length >= 6) {
      // Divide into 2 or 3 scenes depending on length
      if (words.length >= 12) {
        const third = Math.ceil(words.length / 3);
        segments = [
          words.slice(0, third).join(' '),
          words.slice(third, third * 2).join(' '),
          words.slice(third * 2).join(' '),
        ];
      } else {
        const mid = Math.ceil(words.length / 2);
        segments = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
      }
    } else if (single.length >= 24) {
      const mid = Math.ceil(single.length / 2);
      segments = [single.slice(0, mid).trim(), single.slice(mid).trim()];
    }
  }

  // Clean trailing punctuation on each segment so commas don't clash with sentence terminators
  const cleanedSegments = segments.map((seg) => seg.replace(/[၊,;]+$/, '').trim()).filter(Boolean);

  // Target between 2 and 5 scenes (divide short scripts into 2 or 3 scenes, longer into up to 5)
  let targetScenes = Math.min(5, Math.max(2, cleanedSegments.length));
  if (cleanedSegments.length <= 2) {
    targetScenes = 2;
  } else if (cleanedSegments.length === 3) {
    targetScenes = 3;
  } else if (cleanedSegments.length === 4) {
    targetScenes = 4;
  }

  // Intelligently group segments into buckets
  const sceneBuckets: string[][] = Array.from({ length: targetScenes }, () => []);
  cleanedSegments.forEach((segment, idx) => {
    const bucketIdx = Math.min(
      targetScenes - 1,
      Math.floor((idx * targetScenes) / cleanedSegments.length)
    );
    sceneBuckets[bucketIdx].push(segment);
  });

  return sceneBuckets.map((bucket, idx) => {
    const sceneNum = idx + 1;
    let narration = bucket.join(' ').trim();

    // Ensure clean Burmese sentence termination
    narration = narration.replace(/[၊,;]+$/, '').trim();
    if (narration && !/[။!?]$/.test(narration)) {
      narration += '။';
    }

    // 3. Clamp maximum scene duration between 5 seconds and 20 seconds
    // Burmese syllable pacing: ~3.5 syllables per second
    const syllables = countBurmeseSyllables(narration);
    const calculatedDuration = Math.round(syllables / 3.5);
    const estDuration = Math.min(20, Math.max(5, calculatedDuration));

    const template = getTemplateForSceneIndex(idx, targetScenes);
    const title = getSceneTitle(idx, targetScenes, template.defaultTitle);
    const onScreenText = deriveOnScreenText(
      narration,
      template.defaultOnScreen,
      sceneNum
    );

    return {
      sceneNumber: sceneNum,
      title,
      narration,
      slideVisual: template.slideVisual,
      onScreenText,
      avatarMotion: template.avatarMotion,
      estDuration,
    };
  });
}
