import React from 'react';
import { Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { GEMINI_GEM_URL } from '../data/presets';

interface NavbarProps {
  onOpenGemModal: () => void;
  onOpenApiModal?: () => void;
  hasServerAi?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGemModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base lg:text-lg leading-tight truncate bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Myanmar Avatar & Video Prompter
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              Gemini Gem Companion & Prompt Engineering Tool
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenGemModal}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition active:scale-95"
            title="Gem System Instructions"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Gem လမ်းညွှန်ချက်များ</span>
            <span className="sm:hidden text-[11px]">လမ်းညွှန်</span>
          </button>

          <a
            href={GEMINI_GEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/60 hover:to-indigo-900/60 text-purple-200 border border-purple-500/40 transition active:scale-95 shadow-sm"
            title="Open Gemini Gem"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold">
              Gemini Gem သို့ သွားမည်
            </span>
            <ExternalLink className="w-3 h-3 text-purple-400 shrink-0 opacity-80" />
          </a>
        </div>
      </div>
    </header>
  );
};

