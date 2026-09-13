import React from 'react';
import { Package, Image as ImageIcon, Smile, ExternalLink, Sparkles } from 'lucide-react';
import { REFERENCE_TOOLS, ReferenceTool } from '../data/presets';

interface ReferenceToolsBarProps {
  variant?: 'compact' | 'cards' | 'inline';
}

export const ReferenceToolsBar: React.FC<ReferenceToolsBarProps> = ({ variant = 'compact' }) => {
  const getIcon = (category: ReferenceTool['category']) => {
    switch (category) {
      case 'product':
        return <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'scene':
        return <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'avatar':
        return <Smile className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
    }
  };

  const getStyle = (category: ReferenceTool['category']) => {
    switch (category) {
      case 'product':
        return 'bg-amber-950/30 hover:bg-amber-900/40 text-amber-200 border-amber-500/30 hover:border-amber-400/60';
      case 'scene':
        return 'bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-200 border-cyan-500/30 hover:border-cyan-400/60';
      case 'avatar':
        return 'bg-pink-950/30 hover:bg-pink-900/40 text-pink-200 border-pink-500/30 hover:border-pink-400/60';
    }
  };

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {REFERENCE_TOOLS.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tool.name} - ${tool.nameMm} (Opens Gemini Share in a new tab)`}
            className="glass-card p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group active:scale-98"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center" aria-hidden="true">
                  {getIcon(tool.category)}
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {tool.badge}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-100 group-hover:text-white flex items-center gap-1">
                <span>{tool.name}</span>
              </h5>
              <p className="text-[10px] text-emerald-400 font-burmese font-medium mt-0.5">
                {tool.nameMm}
              </p>
              <p className="text-[11px] text-slate-400 font-burmese mt-1.5 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-emerald-400 transition">
              <span>Gemini Share ဖွင့်မည်</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" aria-hidden="true" />
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800/90 rounded-2xl p-2.5 sm:p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center" aria-hidden="true">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-200">
            AI Video Reference Tools
          </span>
          <span className="hidden sm:inline text-[11px] text-slate-400 ml-1.5 font-burmese">
            (ရုပ်ပုံ & နောက်ခံ Reference Image ပြုလုပ်ရန် လင့်ခ်များ)
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        {REFERENCE_TOOLS.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tool.name}: ${tool.description} (Opens Gemini Share in a new tab)`}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 transition active:scale-95 shadow-sm ${getStyle(
              tool.category
            )}`}
            title={`${tool.name} - ${tool.description}`}
          >
            <span aria-hidden="true">{getIcon(tool.category)}</span>
            <span className="text-[11px] font-semibold">{tool.name}</span>
            <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
};
