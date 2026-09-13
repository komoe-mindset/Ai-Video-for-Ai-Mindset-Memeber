import React, { useRef } from 'react';

export type TabKey = 'avatar' | 'script' | 'video' | 'guide';

interface TabNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: TabKey; num: string; label: string; sub: string }[] = [
    {
      key: 'avatar',
      num: '၁',
      label: 'Avatar Image ဖန်တီးရန်',
      sub: 'ရုပ်ပုံ Prompt ထုတ်ယူခြင်း',
    },
    {
      key: 'script',
      num: '၂',
      label: 'Script & စကားပြော',
      sub: 'စကားပြော ၂ မျိုး ဖန်တီးခြင်း',
    },
    {
      key: 'video',
      num: '၃',
      label: '၈ စက္ကန့် Video ခွဲခြမ်းခြင်း',
      sub: '8s Rule အပိုင်းများ ခွဲထုတ်ခြင်း',
    },
    {
      key: 'guide',
      num: '၄',
      label: 'ဝေါဟာရ & လမ်းညွှန်',
      sub: 'Gem Prompt & စကားလုံးများ',
    },
  ];

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex = index;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    const nextTab = tabs[nextIndex];
    onTabChange(nextTab.key);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <nav className="w-full" aria-label="Workflow Navigation">
      <div
        role="tablist"
        aria-label="အဆင့်များ ရွေးချယ်ရန် (Workflow Steps)"
        className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner"
      >
        {tabs.map((t, idx) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={isActive}
              aria-controls={`panel-${t.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(t.key)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`flex items-center gap-2 sm:gap-2.5 py-2.5 px-2.5 sm:px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 text-left min-h-[46px] select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span
                aria-hidden="true"
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  isActive
                    ? 'bg-black/25 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {t.num}
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <span className="block truncate font-semibold text-[11px] sm:text-xs md:text-sm">
                  {t.label}
                </span>
                <span
                  className={`hidden sm:block text-[10px] truncate ${
                    isActive ? 'text-emerald-100/80' : 'text-slate-500'
                  }`}
                >
                  {t.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
