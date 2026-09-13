import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Upload,
  FileVideo,
  Trash2,
  Download,
  AlertCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ActionVariation, ChunkViewMode, VideoChunk } from '../types';

export interface VideoFileChunk {
  id: string;
  partNum: number;
  blob: Blob;
  url: string;
  sizeFormatted: string;
  byteSize: number;
}

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

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
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
  // Tab mode: 'script_prompts' or 'video_slicer'
  const [activeSubTab, setActiveSubTab] = useState<'script_prompts' | 'video_slicer'>('script_prompts');

  // Video File Chunker state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sourceVideoUrl, setSourceVideoUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [chunkStrategy, setChunkStrategy] = useState<'parts' | 'size' | 'stream'>('parts');
  const [targetParts, setTargetParts] = useState<number>(4);
  const [targetSizeMb, setTargetSizeMb] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileChunks, setFileChunks] = useState<VideoFileChunk[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reference to track all created Object URLs for guaranteed leak-free cleanup
  const trackedObjectUrlsRef = useRef<Set<string>>(new Set());

  // Reference for throttling progress state updates (preserves INP & eliminates UI freezes)
  const lastProgressUpdateRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to safely register and track an Object URL
  const createTrackedUrl = useCallback((blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    trackedObjectUrlsRef.current.add(url);
    return url;
  }, []);

  // Helper to revoke a specific Object URL
  const revokeTrackedUrl = useCallback((url: string) => {
    if (trackedObjectUrlsRef.current.has(url)) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Safe ignore
      }
      trackedObjectUrlsRef.current.delete(url);
    }
  }, []);

  // Helper to clean up all tracked Object URLs
  const cleanupAllObjectUrls = useCallback(() => {
    trackedObjectUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Safe ignore
      }
    });
    trackedObjectUrlsRef.current.clear();
  }, []);

  // Explicit cleanup on unmount to prevent severe browser memory leaks
  useEffect(() => {
    return () => {
      cleanupAllObjectUrls();
    };
  }, [cleanupAllObjectUrls]);

  // Throttled progress updater to prevent hundreds of rapid re-renders
  const updateThrottledProgress = useCallback((processed: number, total: number, force = false) => {
    const now = performance.now();
    // Throttle to at most once every 60ms (~16 updates per second) unless forced
    if (force || now - lastProgressUpdateRef.current >= 60) {
      lastProgressUpdateRef.current = now;
      const pct = Math.min(100, Math.max(0, Math.round((processed / total) * 100)));
      setProgress(pct);
    }
  }, []);

  // Handle source file selection
  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv|avi|m4v)$/i)) {
      setErrorMessage('ကျေးဇူးပြု၍ Video ဖိုင် (MP4, WebM, MOV) ကိုသာ ရွေးချယ်ပေးပါခင်ဗျာ။');
      return;
    }

    setErrorMessage(null);
    // Revoke previous source video and previous chunks
    if (sourceVideoUrl) {
      revokeTrackedUrl(sourceVideoUrl);
      setSourceVideoUrl(null);
    }
    fileChunks.forEach((c) => revokeTrackedUrl(c.url));
    setFileChunks([]);
    setProgress(0);

    setVideoFile(file);
    const newSourceUrl = createTrackedUrl(file);
    setSourceVideoUrl(newSourceUrl);
  };

  const handleClearFile = () => {
    if (sourceVideoUrl) {
      revokeTrackedUrl(sourceVideoUrl);
      setSourceVideoUrl(null);
    }
    fileChunks.forEach((c) => revokeTrackedUrl(c.url));
    setFileChunks([]);
    setVideoFile(null);
    setProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Perform Memory-Efficient Chunking (Stream / Slice based)
  const handleProcessVideoChunks = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    setProgress(0);
    setErrorMessage(null);

    // Clean up previous generated chunks
    fileChunks.forEach((c) => revokeTrackedUrl(c.url));
    setFileChunks([]);

    try {
      const fileSize = videoFile.size;
      let chunkSize: number;

      if (chunkStrategy === 'parts') {
        const parts = Math.max(2, Math.min(16, targetParts));
        chunkSize = Math.ceil(fileSize / parts);
      } else if (chunkStrategy === 'size') {
        chunkSize = Math.max(1, targetSizeMb) * 1024 * 1024;
      } else {
        // Stream chunking with 4MB chunks
        chunkSize = 4 * 1024 * 1024;
      }

      const totalChunks = Math.max(1, Math.ceil(fileSize / chunkSize));
      const generatedChunks: VideoFileChunk[] = [];
      const mimeType = videoFile.type || 'video/mp4';

      if (chunkStrategy === 'stream' && typeof videoFile.stream === 'function') {
        // 1. STREAMING APPROACH: Read via stream chunks without loading entire file to RAM
        const stream = videoFile.stream();
        const reader = stream.getReader();
        let bytesRead = 0;
        let currentChunkBuffer: Uint8Array[] = [];
        let currentChunkBytes = 0;
        let partIndex = 1;

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Flush remaining buffer
            if (currentChunkBuffer.length > 0) {
              const combinedBlob = new Blob(currentChunkBuffer, { type: mimeType });
              const url = createTrackedUrl(combinedBlob);
              generatedChunks.push({
                id: `chunk-stream-${partIndex}-${Date.now()}`,
                partNum: partIndex,
                blob: combinedBlob,
                url,
                sizeFormatted: formatBytes(combinedBlob.size),
                byteSize: combinedBlob.size,
              });
            }
            break;
          }

          if (value) {
            currentChunkBuffer.push(value);
            currentChunkBytes += value.byteLength;
            bytesRead += value.byteLength;

            updateThrottledProgress(bytesRead, fileSize);

            if (currentChunkBytes >= chunkSize) {
              const chunkBlob = new Blob(currentChunkBuffer, { type: mimeType });
              const url = createTrackedUrl(chunkBlob);
              generatedChunks.push({
                id: `chunk-stream-${partIndex}-${Date.now()}`,
                partNum: partIndex,
                blob: chunkBlob,
                url,
                sizeFormatted: formatBytes(chunkBlob.size),
                byteSize: chunkBlob.size,
              });
              partIndex++;
              currentChunkBuffer = [];
              currentChunkBytes = 0;

              // Yield to main thread to keep UI interactive and INP optimal
              await new Promise((resolve) => setTimeout(resolve, 0));
            }
          }
        }
      } else {
        // 2. SLICING APPROACH: Zero-copy pointer-based slicing with micro-task yields
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, fileSize);

          // file.slice creates a lightweight slice pointer without cloning entire buffer into memory
          const sliceBlob = videoFile.slice(start, end, mimeType);
          const chunkUrl = createTrackedUrl(sliceBlob);

          generatedChunks.push({
            id: `chunk-slice-${i + 1}-${Date.now()}`,
            partNum: i + 1,
            blob: sliceBlob,
            url: chunkUrl,
            sizeFormatted: formatBytes(sliceBlob.size),
            byteSize: sliceBlob.size,
          });

          // Throttled progress update
          updateThrottledProgress(end, fileSize);

          // Yield execution to the browser main thread
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      updateThrottledProgress(fileSize, fileSize, true);
      setFileChunks(generatedChunks);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ဗီဒီယို ဖိုင် ခွဲခြမ်းရာတွင် အမှားဖြစ်ပေါ်ခဲ့ပါသည်';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

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
    <div className="flex flex-col gap-5">
      {/* Top Header & Sub-tab Switcher */}
      <div className="glass-card p-3 sm:p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">အဆင့် ၃။</span>
            <span>၈ စက္ကန့် စီ ခွဲထုတ်စနစ် & Video File Slicer</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-burmese">
            AI Video Tool များ (Kling, Runway, Hedra) အတွက် Prompt ခွဲခြမ်းခြင်း နှင့် Video File Chunking
          </p>
        </div>

        {/* Mode Selector */}
        <div
          role="radiogroup"
          aria-label="ခွဲခြမ်းမှု အမျိုးအစား ရွေးချယ်ရန်"
          className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 w-full sm:w-auto"
        >
          <button
            type="button"
            role="radio"
            aria-checked={activeSubTab === 'script_prompts'}
            onClick={() => setActiveSubTab('script_prompts')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'script_prompts'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Script & Prompts Chunker</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={activeSubTab === 'video_slicer'}
            onClick={() => setActiveSubTab('video_slicer')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'video_slicer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileVideo className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Video File Slicer (Stream)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Script & Prompt Chunker */}
      {activeSubTab === 'script_prompts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Column: Chunker Setup & Interactive Stepper (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    <span>၈ စက္ကန့် စာသား အပိုင်းခွဲစနစ်</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    8s Rule
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-burmese leading-relaxed">
                  AI Video Tool များသည် ၅ မှ ၈ စက္ကန့်သာ အဆင်ပြေသောကြောင့် တစ်ပိုင်းချင်း အတိအကျ ခွဲပေးပါသည်
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
                type="button"
                onClick={onRunChunker}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950 active:scale-95 cursor-pointer"
              >
                <Scissors className="w-4 h-4" aria-hidden="true" />
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
                    className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition cursor-pointer ${
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
                    className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition cursor-pointer ${
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
                  type="button"
                  onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
                  disabled={currentStepIndex === 0}
                  aria-label="ရှေ့တစ်ပိုင်းသို့ ပြန်သွားမည် (Go to Previous Shot)"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>ရှေ့တစ်ပိုင်း</span>
                </button>

                <span
                  className="text-xs font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800"
                  aria-live="polite"
                >
                  Shot {currentStepIndex + 1} of {chunks.length}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onStepChange(
                      Math.min(chunks.length - 1, currentStepIndex + 1)
                    )
                  }
                  disabled={currentStepIndex === chunks.length - 1}
                  aria-label="နောက်တစ်ပိုင်းသို့ ဆက်သွားမည် (Go to Next Shot)"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white flex items-center gap-1 font-medium disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                >
                  <span>နောက်တစ်ပိုင်း</span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Chunks Output Display (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {chunks.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center flex flex-col items-center justify-center gap-2 text-slate-400">
                <Video className="w-8 h-8 text-slate-600" aria-hidden="true" />
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
                          <Film className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                          <span>Shot {chunk.shotNum} (8 Seconds Duration)</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 font-burmese">
                          စာလုံးရေ: ~{chunk.wordCount} words (ခန့်မှန်းခြေ ၆-၈ စက္ကန့်စာ)
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopySingleShot(chunk)}
                      aria-label={`Shot ${chunk.shotNum} တစ်ခုလုံး Copy ကူးယူမည် (Copy all prompts for Shot ${chunk.shotNum})`}
                      className="self-start sm:self-auto px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Shot {chunk.shotNum} တစ်ခုလုံး Copy</span>
                    </button>
                  </div>

                  {/* 1. Video Animation Prompt */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <Video className="w-3 h-3" aria-hidden="true" />
                        <span>၁။ Video Animation Prompt (English လို Kling / Runway သို့ ထည့်ရန်):</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          onCopy(
                            chunk.videoPrompt,
                            'Video Animation Prompt ကို Copy ကူးပြီးပါပြီ'
                          )
                        }
                        aria-label={`Shot ${chunk.shotNum} Video Animation Prompt ကို Copy ယူပါ`}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        {copiedKey === chunk.videoPrompt ? (
                          <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                        ) : (
                          <Copy className="w-3 h-3" aria-hidden="true" />
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
                        <Mic className="w-3 h-3" aria-hidden="true" />
                        <span>၂။ Audio / Text-to-Speech Prompt (အသံထွက်ရန် ထည့်ရန်):</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          onCopy(
                            chunk.scriptBurmese,
                            'Audio Burmese Prompt ကို Copy ကူးပြီးပါပြီ'
                          )
                        }
                        aria-label={`Shot ${chunk.shotNum} Burmese Audio Script ကို Copy ယူပါ`}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        {copiedKey === chunk.scriptBurmese ? (
                          <Check className="w-3 h-3 text-teal-400" aria-hidden="true" />
                        ) : (
                          <Copy className="w-3 h-3" aria-hidden="true" />
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
                        type="button"
                        onClick={() => onStepChange(chunk.shotNum)}
                        className="px-3 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>"Next" သို့မဟုတ် နောက်တစ်ပိုင်း တောင်းမည်</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Video File Slicer & Stream Chunker */}
      {activeSubTab === 'video_slicer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Column: Upload & Slicer Parameters (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>ဗီဒီယိုဖိုင် တိုက်ရိုက် ခွဲခြမ်းစနစ် (Memory-Safe)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 font-burmese leading-relaxed">
                  ဖိုင်တစ်ခုလုံးကို RAM ထဲ တစ်ပြိုင်နက် မတင်ဘဲ Stream / Blob Slice ဖြင့် UI အေးခဲခြင်းမရှိဘဲ လျင်မြန်စွာ ခွဲခြမ်းပေးပါသည်
                </p>
              </div>

              {/* Upload Dropzone */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                id="video-file-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelected(file);
                }}
              />

              {!videoFile ? (
                <label
                  htmlFor="video-file-input"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const dropped = e.dataTransfer.files?.[0];
                    if (dropped) handleFileSelected(dropped);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition ${
                    isDragging
                      ? 'border-emerald-400 bg-emerald-950/20'
                      : 'border-slate-700/80 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Upload className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      ဗီဒီယို ဖိုင်ကို ဤနေရာတွင် ဆွဲတင်ပါ သို့မဟုတ် နှိပ်၍ ရွေးပါ
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      MP4, WebM, MOV (Any size supported)
                    </p>
                  </div>
                </label>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <FileVideo className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {videoFile.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {formatBytes(videoFile.size)} &bull; {videoFile.type || 'video/mp4'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearFile}
                      aria-label="ရွေးချယ်ထားသော ဖိုင် ဖျက်မည် (Remove selected file)"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Video preview with tracked object URL */}
                  {sourceVideoUrl && (
                    <div className="rounded-lg overflow-hidden bg-black aspect-video max-h-48 border border-slate-800">
                      <video
                        src={sourceVideoUrl}
                        controls
                        muted
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Chunking Strategy Configuration */}
              <div className="flex flex-col gap-3">
                <label className="block text-xs font-semibold text-slate-300">
                  ခွဲခြမ်းမှု နည်းလမ်း (Chunking Strategy)
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setChunkStrategy('parts')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                      chunkStrategy === 'parts'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    အပိုင်းအရေအတွက်
                  </button>
                  <button
                    type="button"
                    onClick={() => setChunkStrategy('size')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                      chunkStrategy === 'size'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ဖိုင်ဆိုဒ်အလိုက်
                  </button>
                  <button
                    type="button"
                    onClick={() => setChunkStrategy('stream')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                      chunkStrategy === 'stream'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Stream Read
                  </button>
                </div>

                {chunkStrategy === 'parts' && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span>ခွဲမည့် အပိုင်းအရေအတွက်:</span>
                      <span className="font-mono text-emerald-400 font-bold">{targetParts} ပိုင်း</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      step={1}
                      value={targetParts}
                      onChange={(e) => setTargetParts(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-500 cursor-pointer"
                      aria-label="ခွဲမည့် အပိုင်းအရေအတွက်"
                    />
                  </div>
                )}

                {chunkStrategy === 'size' && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span>တစ်ပိုင်းစီ၏ အများဆုံးဆိုဒ် (MB):</span>
                      <span className="font-mono text-emerald-400 font-bold">{targetSizeMb} MB</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={50}
                      step={2}
                      value={targetSizeMb}
                      onChange={(e) => setTargetSizeMb(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-500 cursor-pointer"
                      aria-label="တစ်ပိုင်းစီ၏ အများဆုံးဆိုဒ်"
                    />
                  </div>
                )}

                {chunkStrategy === 'stream' && (
                  <p className="text-[11px] text-slate-400 font-burmese bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    ReadableStreamDefaultReader ဖြင့် 4MB binary blocks အဖြစ် RAM သုံးစွဲမှု အနိမ့်ဆုံးဖြင့် ဆွဲထုတ်ဖတ်ရှုပါမည်။
                  </p>
                )}
              </div>

              {/* Progress Bar (Throttled for smooth 60fps & low INP) */}
              {isProcessing && (
                <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300 font-burmese">ဖိုင် ခွဲခြမ်းနေပါသည်...</span>
                    <span className="text-emerald-400 font-mono" aria-live="polite">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-75 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Process Button */}
              <button
                type="button"
                onClick={handleProcessVideoChunks}
                disabled={!videoFile || isProcessing}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950 cursor-pointer"
              >
                <Scissors className="w-4 h-4" aria-hidden="true" />
                <span>
                  {isProcessing ? 'ခွဲခြမ်းနေပါသည်...' : 'ဗီဒီယို အပိုင်းများ ခွဲထုတ်မည် (Slice / Stream)'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Chunked Video Files & Download Links (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {fileChunks.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center flex flex-col items-center justify-center gap-2 text-slate-400">
                <Layers className="w-8 h-8 text-slate-600" aria-hidden="true" />
                <p className="text-xs font-burmese">
                  ခွဲထုတ်ထားသော ဗီဒီယို အပိုင်းများ မရှိသေးပါ။ ဘယ်ဘက်မှ ဖိုင်တင်၍ ခွဲခြမ်းပါ
                </p>
                <p className="text-[11px] text-slate-500">
                  Chunk တိုင်းအတွက် Object URL များကို မှတ်ဉာဏ်ယိုစိမ့်မှု (Memory Leak) မဖြစ်အောင် စနစ်တကျ စီမံထားပါသည်
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h5 className="text-xs font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    <span>ခွဲထုတ်ပြီးသော အပိုင်းများ ({fileChunks.length} ပိုင်း)</span>
                  </h5>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Total: {formatBytes(fileChunks.reduce((acc, c) => acc + c.byteSize, 0))}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fileChunks.map((c) => (
                    <div
                      key={c.id}
                      className="glass-card p-3 rounded-xl border border-slate-700/80 shadow-md flex flex-col justify-between gap-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                            {c.partNum}
                          </span>
                          <span>Part {c.partNum}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {c.sizeFormatted}
                        </span>
                      </div>

                      {/* Video clip preview */}
                      <div className="rounded-lg overflow-hidden bg-black aspect-video max-h-32 border border-slate-800">
                        <video
                          src={c.url}
                          controls
                          muted
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                        <a
                          href={c.url}
                          download={`${videoFile?.name?.replace(/\.[^/.]+$/, '') || 'video'}_part${c.partNum}.mp4`}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium flex items-center justify-center gap-1 transition shadow-sm"
                          aria-label={`Part ${c.partNum} ဖိုင်ကို ဒေါင်းလုဒ်ရယူပါ`}
                        >
                          <Download className="w-3 h-3" aria-hidden="true" />
                          <span>Download Part {c.partNum}</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            onCopy(
                              c.url,
                              `Part ${c.partNum} Blob URL ကို Copy ယူပြီးပါပြီ!`
                            );
                          }}
                          aria-label={`Part ${c.partNum} ၏ Object URL ကို ကူးယူပါ`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                          title="Copy Blob URL"
                        >
                          {copiedKey === c.url ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

