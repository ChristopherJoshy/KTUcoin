import React from 'react';
import { Compass, GraduationCap, Building2, UserCheck, Flame, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateProfile: () => void;
  onLogout: () => void;
}

// this function is used for top navigation header bar in Zen Light theme with role switching and profile selector for more info refer code-wiki.md line 100
export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateProfile,
  onLogout
}) => {
  const { currentUser, profiles, selectProfile, activeRole } = useAuth();

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Student</span>;
      case 'ORGANIZER':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Organizer</span>;
      case 'TEACHER':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Staff Advisor</span>;
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-700 to-indigo-600 p-0.5 flex items-center justify-center shadow-md shadow-teal-700/10">
            <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center text-teal-700">
              <Flame className="w-6 h-6 fill-teal-700/20 text-teal-700" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-display text-xl text-slate-900 tracking-tight">Campus<span className="text-teal-700">Pulse</span></span>
              <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-teal-200 uppercase tracking-widest">KTU</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Activity Points & Opportunities Hub</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'feed'
                ? 'bg-gradient-to-r from-teal-700 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Posters Feed</span>
          </button>

          {activeRole === 'STUDENT' && (
            <button
              onClick={() => setActiveTab('student')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'student'
                  ? 'bg-teal-700 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Points Dashboard</span>
            </button>
          )}

          {activeRole === 'ORGANIZER' && (
            <button
              onClick={() => setActiveTab('organizer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'organizer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Organizer Console</span>
            </button>
          )}

          {activeRole === 'TEACHER' && (
            <button
              onClick={() => setActiveTab('teacher')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Advisor Queue</span>
            </button>
          )}
        </nav>

        {/* Profile Switcher & Logout */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl transition-all text-left">
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentUser?.studentId || currentUser?.department}
                </div>
              </div>
            </button>

            {/* Profile select menu */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl border border-slate-200 p-2 shadow-zen-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Active Identity</p>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {profiles.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => selectProfile(p)}
                    className={`w-full p-2 rounded-lg flex items-center justify-between text-left transition-colors ${
                      currentUser?._id === p._id ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.role} • {p.department}</p>
                    </div>
                    {getRoleBadge(p.role)}
                  </button>
                ))}
              </div>

              <div className="pt-2 mt-1 border-t border-slate-100 space-y-1">
                <button
                  onClick={onOpenCreateProfile}
                  className="w-full text-xs font-medium text-teal-700 hover:text-teal-900 py-1.5 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  + Create New Profile
                </button>

                <button
                  onClick={onLogout}
                  className="w-full text-xs font-medium text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Switch Role / Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
