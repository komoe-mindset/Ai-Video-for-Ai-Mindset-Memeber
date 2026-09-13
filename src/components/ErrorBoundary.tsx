import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Unhandled UI error captured by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({
      hasError: false,
      error: null,
    });
  };

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-red-500/30 bg-red-950/20 my-4 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-100 mb-1">
            {this.props.fallbackTitle || 'အစိတ်အပိုင်း ဖွင့်ရာတွင် အမှားဖြစ်ပေါ်ခဲ့ပါသည်'}
          </h3>
          <p className="text-xs text-slate-400 font-burmese mb-4 max-w-md">
            နည်းပညာပိုင်းဆိုင်ရာ ချို့ယွင်းချက်ဖြစ်ပေါ်ခဲ့သဖြင့် ဤအပိုင်းကို ပြန်လည်စတင်ပါ
          </p>
          {this.state.error && (
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-red-300 mb-4 max-w-full overflow-x-auto text-left">
              {this.state.error.message}
            </div>
          )}
          <button
            type="button"
            onClick={this.handleRetry}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition active:scale-95 shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ပြန်လည်စမ်းသပ်မည် (Try Again)</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

