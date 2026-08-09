import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  UserCheck,
  ArrowRight,
  Sparkles,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { CoinLogo } from './CoinLogo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
import { cn } from '../lib/cn';

interface LoginScreenProps {
  onCompleteLogin: () => void;
  onOpenCreateProfile: () => void;
}

// this function is used for split login screen with preset profile selection and role perspective picker for more info refer code-wiki.md line 118
export const LoginScreen: React.FC<LoginScreenProps> = ({ onCompleteLogin, onOpenCreateProfile }) => {
  const { profiles, selectProfile, loginAsRole, isLoading } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [emailInput, setEmailInput] = useState('');
  const [step, setStep] = useState<'LOGIN' | 'ROLE_SELECT'>('LOGIN');

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setStep('ROLE_SELECT');
  };

  const handleChooseRole = (role: UserRole) => {
    loginAsRole(role);
    onCompleteLogin();
  };

  const handlePickPresetProfile = (p: any) => {
    selectProfile(p);
    onCompleteLogin();
  };

  const roleOptions: { role: UserRole; icon: React.ReactNode; title: string; subtitle: string }[] = [
    {
      role: 'STUDENT',
      icon: <GraduationCap className="w-5 h-5" />,
      title: 'Student',
      subtitle: 'Swipe posters, claim passes, track points'
    },
    {
      role: 'ORGANIZER',
      icon: <Building2 className="w-5 h-5" />,
      title: 'Organizer',
      subtitle: 'Publish events, scan gate QR codes'
    },
    {
      role: 'TEACHER',
      icon: <UserCheck className="w-5 h-5" />,
      title: 'Staff Advisor & HOD',
      subtitle: 'Approve letters, points, and roster'
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row items-stretch relative overflow-hidden transition-colors duration-300">
      {/* LEFT SHOWCASE PANEL */}
      <div className="flex-1 bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <SunIcon />
          ) : (
            <MoonIcon />
          )}
        </button>

        <div className="flex items-center gap-3">
          <CoinLogo size={46} animated={true} />
          <div>
            <h1 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-slate-50">
              KTU<span className="text-amber-500">coins</span>
            </h1>
            <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
              Campus Platform
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="my-10 max-w-lg space-y-5 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Discover. Attend. Earn Points.
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display leading-tight text-slate-900 dark:text-slate-50">
            Campus events, one swipe away.
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
            From poster discovery to gate QR verification and advisor point crediting — the full KTU
            activity lifecycle in one feed.
          </p>

          {/* Feature bullets */}
          <div className="space-y-2.5 pt-2">
            {[
              'Swipe a TikTok-style event feed',
              'HOD permission letters with one tap',
              'Verified attendance via QR scans'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-teal-700 dark:bg-teal-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          KTUcoins • Campus Opportunities & Activity Points
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="w-full md:w-[460px] bg-slate-50 dark:bg-slate-950 p-5 sm:p-10 flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-zen-lg space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-50">
              Enter the portal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick a profile or continue with a custom identity
            </p>
          </div>

          {/* Quick profile pick */}
          <div className="space-y-2">
            {isLoading ? (
              <>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-3 animate-pulse"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-2 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-slate-400 font-medium pt-1">
                  Loading campus profiles...
                </p>
              </>
            ) : (
              profiles.slice(0, 3).map(p => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => handlePickPresetProfile(p)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-teal-500 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 flex items-center justify-between text-left transition-colors w-full"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {p.department} ({p.studentId || p.role})
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-1 rounded-md shrink-0',
                      p.role === 'STUDENT'
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900'
                        : p.role === 'ORGANIZER'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                    )}
                  >
                    {p.role === 'STUDENT' ? 'Student' : p.role === 'ORGANIZER' ? 'Organizer' : 'Advisor'}
                  </span>
                </button>
              ))
            )}
            {!isLoading && profiles.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl p-3 text-center">
                No seeded profiles found. Create a new identity below or wait for backend to sync.
              </p>
            )}
          </div>

          {/* Manual login */}
          {step === 'LOGIN' ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Or enter a custom name
                </label>
                <input
                  type="text"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="e.g. Anish Kumar"
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-3 pt-2 animate-fade-in">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Select role perspective
              </h4>

              <div className="grid grid-cols-1 gap-2">
                {roleOptions.map(option => (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => handleChooseRole(option.role)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-teal-500 dark:hover:border-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 flex items-center gap-3 text-left transition-colors w-full"
                  >
                    <span className="text-teal-700 dark:text-teal-400 shrink-0">{option.icon}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{option.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{option.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep('LOGIN')}
                className="w-full py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-center font-medium"
              >
                &larr; Back
              </button>
            </div>
          )}

          <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={onOpenCreateProfile}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 inline-flex items-center gap-1.5 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" />
              + Create Custom Profile
            </button>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Demo mode — no password required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SunIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);
