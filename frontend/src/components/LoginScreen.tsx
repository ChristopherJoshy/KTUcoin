import React, { useState } from 'react';
import { GraduationCap, Building2, UserCheck, ArrowRight, Sparkles, Info, ShieldCheck, User as UserIcon, Check } from 'lucide-react';
import { CoinLogo } from './CoinLogo';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LoginScreenProps {
  onCompleteLogin: () => void;
  onOpenCreateProfile: () => void;
}

// this function is used for rendering zen paper light theme split login screen with prominent judge identity selector for more info refer code-wiki.md line 118
export const LoginScreen: React.FC<LoginScreenProps> = ({ onCompleteLogin, onOpenCreateProfile }) => {
  const { profiles, selectProfile, loginAsRole } = useAuth();
  
  const [emailInput, setEmailInput] = useState('');
  const [step, setStep] = useState<'LOGIN' | 'ROLE_SELECT'>('LOGIN');
  const [showExplanation, setShowExplanation] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row items-stretch relative overflow-hidden font-sans">
      {/* Soft Zen ambient glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-b from-teal-500/5 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* LEFT SHOWCASE PANEL - Zen Paper Light Style */}
      <div className="flex-1 bg-gradient-to-br from-slate-100 via-slate-50 to-white p-8 lg:p-14 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-200">
        <div className="flex items-center gap-3">
          <CoinLogo size={46} animated={true} />
          <div>
            <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
              KTU<span className="text-amber-500">coins</span>
            </h1>
            <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest">Campus Platform</p>
          </div>
        </div>

        {/* Hero Title & Floating Cards */}
        <div className="my-10 max-w-lg space-y-5 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Reimagine Campus Activity Points
          </span>

          <h2 className="text-4xl sm:text-5xl font-black font-display leading-tight text-slate-900">
            Discover opportunities. Earn <span className="text-amber-600">KTUcoins</span>.
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            Automated lifecycle from poster discovery to gate QR verification and staff advisor point crediting.
          </p>

          {/* Layered floating event cards (Paper Light style) */}
          <div className="relative w-full h-44 mt-6 hidden sm:block">
            <div className="absolute left-0 top-3 w-48 h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-md -rotate-6 transform hover:rotate-0 transition-all duration-300 bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80"
                alt="Hackathon"
                className="w-full h-20 object-cover rounded-xl"
              />
              <div className="p-2 space-y-0.5">
                <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">Group I Tech</span>
                <p className="font-bold text-xs text-slate-900 truncate">HackCampus 2026</p>
              </div>
            </div>

            <div className="absolute left-32 top-0 w-52 h-38 rounded-2xl overflow-hidden border border-amber-300 shadow-md z-10 rotate-3 transform hover:rotate-0 transition-all duration-300 bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80"
                alt="Cultural"
                className="w-full h-22 object-cover rounded-xl"
              />
              <div className="p-2 space-y-0.5">
                <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Group III Arts</span>
                <p className="font-bold text-xs text-slate-900 truncate">Rhythms Cultural Fest</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Stack Wars 24-Hour Solo Hackathon Entry • Zen Light Theme
        </div>
      </div>

      {/* RIGHT LOGIN PANEL - White Paper Box */}
      <div className="w-full md:w-[480px] bg-slate-50 p-6 sm:p-10 flex flex-col justify-center space-y-6 relative">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-zen-lg space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-display text-slate-900">Log into KTUcoins</h3>
            <p className="text-xs text-slate-500">Select a pre-configured judge profile or type an email</p>
          </div>

          {/* Quick Select Personas */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {profiles.slice(0, 3).map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => handlePickPresetProfile(p)}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/50 flex items-center justify-between text-left transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900 group-hover:text-teal-800 transition-colors">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.department} ({p.studentId || p.role})</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                    p.role === 'STUDENT' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                    p.role === 'ORGANIZER' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hackathon Explanation Dropdown */}
          <div className="bg-teal-50/80 border border-teal-200/80 rounded-2xl p-3 text-xs text-teal-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px] leading-relaxed">
              <span className="font-bold text-teal-950">Frictionless Demo Mode:</span> Type any custom name or pick an identity above to test multi-role features immediately.
            </div>
          </div>

          {/* MANUAL LOGIN INPUT FORM */}
          {step === 'LOGIN' ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Or Enter Custom Identifier
                </label>
                <input
                  type="text"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. rahul@ktu.edu.in or Anish Kumar"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-600 focus:bg-white text-sm text-slate-900 placeholder-slate-400 font-medium transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-700 to-indigo-600 hover:from-teal-600 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue & Choose Role</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-3 pt-2 animate-fadeIn">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Select Role Perspective</h4>
                <p className="text-xs text-slate-500">Enter portal as Student, Organizer, or Advisor</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleChooseRole('STUDENT')}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/50 flex items-center gap-3 transition-all text-left shadow-sm"
                >
                  <GraduationCap className="w-5 h-5 text-teal-700 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-slate-900">Student</p>
                    <p className="text-[10px] text-slate-500">Swipe posters, claim slot, view KTU points</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChooseRole('ORGANIZER')}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/50 flex items-center gap-3 transition-all text-left shadow-sm"
                >
                  <Building2 className="w-5 h-5 text-indigo-700 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-slate-900">Organizer</p>
                    <p className="text-[10px] text-slate-500">Post posters, scan gate QR codes, complete event</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChooseRole('TEACHER')}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center gap-3 transition-all text-left shadow-sm"
                >
                  <UserCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-slate-900">Staff Advisor</p>
                    <p className="text-[10px] text-slate-500">Approve pending point requests & view roster</p>
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep('LOGIN')}
                className="w-full py-1 text-xs text-slate-500 hover:text-slate-700 text-center font-medium"
              >
                &larr; Back to login input
              </button>
            </div>
          )}

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={onOpenCreateProfile}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              + Create Custom Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
