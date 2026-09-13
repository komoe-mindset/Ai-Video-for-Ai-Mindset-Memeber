import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (remember: boolean) => void;
}

const CORRECT_PASSWORD = 'AiMindset';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmed = password.trim();

    // Check with backend API if available, with direct fallback
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.valid) {
          onLoginSuccess(rememberMe);
          return;
        }
      }
    } catch {
      // Backend request failed or offline; check client-side
    }

    // Direct match check (allows exact or clean trimmed)
    if (trimmed === CORRECT_PASSWORD) {
      onLoginSuccess(rememberMe);
      return;
    }

    // Failed
    setIsSubmitting(false);
    setShake(true);
    setTimeout(() => setShake(false), 500);

    if (trimmed.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
      setError('စကားဝှက် အကြီးအသေး စာလုံးမှားနေပါသည် ("AiMindset" အတိုင်း အတိအကျ ရိုက်ထည့်ပါ)');
    } else {
      setError('စကားဝှက် မမှန်ကန်ပါ။ (Incorrect password)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background ambient decorative glows */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div
        className={`w-full max-w-md glass-card rounded-2xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative z-10 transition-transform ${
          shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
        }`}
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-4 ring-4 ring-emerald-500/10">
            <Lock className="w-7 h-7 text-white" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AiMindset Protected Access</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
            Myanmar AI Avatar & Video Prompter
          </h1>
          <p className="text-xs text-slate-400 font-burmese mt-1.5 leading-relaxed">
            ဝဘ်ဆိုဒ်သို့ ဝင်ရောက်အသုံးပြုရန် လျှို့ဝှက်စကားဝှက် ထည့်သွင်းပါ
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="font-burmese leading-relaxed">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="studio-password"
              className="block text-xs font-medium text-slate-300 mb-1.5 font-burmese"
            >
              Password (စကားဝှက်)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="studio-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="စကားဝှက် ရိုက်ထည့်ပါ..."
                autoFocus
                required
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-200 font-burmese select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer"
              />
              <span>ဤစက်တွင် မှတ်ထားမည် (Remember this device)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm shadow-lg shadow-emerald-500/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 font-burmese">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                စစ်ဆေးနေပါသည်...
              </span>
            ) : (
              <>
                <span className="font-burmese">ဝင်ရောက်မည်</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Hint / Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-burmese">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AiMindset Creator Platform Passcode Gate</span>
          </p>
        </div>
      </div>
    </div>
  );
};
