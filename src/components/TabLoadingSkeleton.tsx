import React from 'react';
import { Loader2 } from 'lucide-react';

export const TabLoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse" aria-busy="true" aria-label="Loading tab content">
      {/* Top Banner / Skeleton Header */}
      <div className="flex items-center justify-between p-4 glass-card rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-32 bg-slate-800 rounded-md"></div>
            <div className="h-2.5 w-48 bg-slate-800/60 rounded-md"></div>
          </div>
        </div>
        <div className="h-7 w-20 bg-slate-800 rounded-lg"></div>
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass-card p-5 rounded-2xl h-36 border border-slate-800/80 flex flex-col gap-3">
            <div className="h-3 w-40 bg-slate-800 rounded"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="h-10 bg-slate-800/70 rounded-xl"></div>
              <div className="h-10 bg-slate-800/70 rounded-xl"></div>
              <div className="h-10 bg-slate-800/70 rounded-xl"></div>
              <div className="h-10 bg-slate-800/70 rounded-xl"></div>
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl h-72 border border-slate-800/80 flex flex-col gap-3">
            <div className="h-4 w-48 bg-slate-800 rounded"></div>
            <div className="h-10 bg-slate-800/60 rounded-xl"></div>
            <div className="h-10 bg-slate-800/60 rounded-xl"></div>
            <div className="h-20 bg-slate-800/50 rounded-xl"></div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-card p-5 rounded-2xl h-80 border border-slate-800/80 flex flex-col gap-3">
            <div className="h-4 w-36 bg-slate-800 rounded"></div>
            <div className="h-44 bg-slate-950/80 rounded-xl border border-slate-800"></div>
            <div className="h-10 bg-slate-800 rounded-xl"></div>
          </div>
          <div className="glass-card p-5 rounded-2xl h-44 border border-slate-800/80 flex flex-col gap-2">
            <div className="h-3 w-28 bg-slate-800 rounded"></div>
            <div className="h-24 bg-slate-950/60 rounded-xl border border-slate-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
