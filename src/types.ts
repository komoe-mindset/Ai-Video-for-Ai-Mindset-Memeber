export type AvatarStyle =
  | 'hyperrealistic'
  | 'pixar3d'
  | 'anime'
  | 'cinematic'
  | 'digitalArt'
  | 'claymation';

export interface AvatarConfig {
  style: AvatarStyle;
  gender: 'female' | 'male';
  age: string;
  expression: string;
  customDetail: string;
  clothingPreset: string;
  clothingColor: string;
  clothingDescription: string;
  bgPreset: string;
  bgCustomDetail: string;
  aspectRatio: string;
  cameraFraming: string;
}

export type ScriptTone = 'friendly' | 'professional' | 'urgent';
export type ScriptLang = 'burmese' | 'burmish';

export interface ScriptConfig {
  topic: string;
  tone: ScriptTone;
  lang: ScriptLang;
  optionA: string;
  optionB: string;
}

export interface VideoChunk {
  shotNum: number;
  totalShots: number;
  scriptBurmese: string;
  videoPrompt: string;
  wordCount: number;
}

export type ChunkViewMode = 'step' | 'all';
export type ActionVariation = 'dynamic' | 'steady' | 'cinematic';

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

export interface GoogleVidsScene {
  sceneNumber: number;
  title: string;
  narration: string; // Pure Burmese TTS text
  slideVisual: string; // Slide visual composition directive in English
  onScreenText: string; // Concise bullet/title
  avatarMotion: string; // Avatar gesture directive in English
  estDuration: number; // Duration in seconds
}
