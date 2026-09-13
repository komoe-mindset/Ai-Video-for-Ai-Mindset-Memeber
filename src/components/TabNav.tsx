import React from 'react';

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

  return (
    <nav className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
        {tabs.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className={`flex items-center gap-2 sm:gap-2.5 py-2.5 px-2.5 sm:px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 text-left min-h-[46px] select-none ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span
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
