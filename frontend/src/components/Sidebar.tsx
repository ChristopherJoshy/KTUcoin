import React from 'react';
import { 
  Compass, 
  MessageSquare, 
  GraduationCap, 
  Building2, 
  UserCheck, 
  User as UserIcon, 
  LogOut, 
  PlusCircle, 
  Scan,
  Sparkles
} from 'lucide-react';
import { CoinLogo } from './CoinLogo';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateEvent?: () => void;
  onOpenQRScanner?: () => void;
  onOpenCreateProfile: () => void;
  onLogout: () => void;
}

// this function is used for instagram-style left side navigation bar on desktop and bottom navigation bar on mobile for more info refer code-wiki.md line 120
export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateEvent,
  onOpenQRScanner,
  onOpenCreateProfile,
  onLogout
}) => {
  const { currentUser, profiles, selectProfile, activeRole } = useAuth();

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">Student</span>;
      case 'ORGANIZER':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">Organizer</span>;
      case 'TEACHER':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">Advisor</span>;
    }
  };

  return (
    <>
      {/* DESKTOP SIDE NAVBAR (Left Vertical Bar - Instagram Reels Style) */}
      <aside className="hidden md:flex flex-col justify-between w-20 hover:w-64 bg-white border-r border-slate-200 fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 group shadow-sm">
        <div className="flex flex-col items-start w-full py-6 px-4 space-y-8">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer overflow-hidden px-1" onClick={() => setActiveTab('feed')}>
            <CoinLogo size={42} animated={true} />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <span className="font-extrabold font-display text-xl text-slate-900 tracking-tight">
                KTU<span className="text-amber-500">coins</span>
              </span>
              <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest">Campus Hub</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="w-full space-y-2">
            {/* Feed / Discover */}
            <button
              onClick={() => setActiveTab('feed')}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all relative ${
                activeTab === 'feed'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="Posters Feed"
            >
              <Compass className="w-6 h-6 shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
                Posters Feed
              </span>
            </button>

            {/* Public Discussions (Replaces Messages icon) */}
            <button
              onClick={() => setActiveTab('discussions')}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all relative ${
                activeTab === 'discussions'
                  ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="Public Discussions"
            >
              <MessageSquare className="w-6 h-6 shrink-0 text-indigo-600" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
                Discussions
              </span>
            </button>

            {/* Role Specific Dashboard */}
            {activeRole === 'STUDENT' && (
              <button
                onClick={() => setActiveTab('student')}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all relative ${
                  activeTab === 'student'
                    ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title="Points Dashboard"
              >
                <GraduationCap className="w-6 h-6 shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
                  Points Dashboard
                </span>
              </button>
            )}

            {activeRole === 'ORGANIZER' && (
              <button
                onClick={() => setActiveTab('organizer')}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all relative ${
                  activeTab === 'organizer'
                    ? 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title="Organizer Console"
              >
                <Building2 className="w-6 h-6 shrink-0 text-indigo-600" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
                  Organizer Console
                </span>
              </button>
            )}

            {activeRole === 'TEACHER' && (
              <button
                onClick={() => setActiveTab('teacher')}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all relative ${
                  activeTab === 'teacher'
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title="Advisor Queue"
              >
                <UserCheck className="w-6 h-6 shrink-0 text-emerald-600" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
                  Advisor Queue
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* User Profile & Actions at Bottom */}
        <div className="p-4 border-t border-slate-200 w-full space-y-2">
          {/* Current Profile Card */}
          <div className="flex items-center gap-3 overflow-hidden px-1 py-1">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-left min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-500">{currentUser?.role}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Switch Role / Logout"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-xs font-medium">
              Switch Role
            </span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVBAR (Instagram Reels Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('feed')}
          className={`p-2.5 rounded-xl transition-colors ${
            activeTab === 'feed' ? 'bg-teal-50 text-teal-800' : 'text-slate-500'
          }`}
          title="Feed"
        >
          <Compass className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('discussions')}
          className={`p-2.5 rounded-xl transition-colors ${
            activeTab === 'discussions' ? 'bg-teal-50 text-teal-800' : 'text-slate-500'
          }`}
          title="Discussions"
        >
          <MessageSquare className="w-6 h-6 text-indigo-600" />
        </button>

        {activeRole === 'STUDENT' && (
          <button
            onClick={() => setActiveTab('student')}
            className={`p-2.5 rounded-xl transition-colors ${
              activeTab === 'student' ? 'bg-teal-50 text-teal-800' : 'text-slate-500'
            }`}
            title="Dashboard"
          >
            <GraduationCap className="w-6 h-6" />
          </button>
        )}

        {activeRole === 'ORGANIZER' && (
          <button
            onClick={() => setActiveTab('organizer')}
            className={`p-2.5 rounded-xl transition-colors ${
              activeTab === 'organizer' ? 'bg-indigo-50 text-indigo-800' : 'text-slate-500'
            }`}
            title="Console"
          >
            <Building2 className="w-6 h-6" />
          </button>
        )}

        {activeRole === 'TEACHER' && (
          <button
            onClick={() => setActiveTab('teacher')}
            className={`p-2.5 rounded-xl transition-colors ${
              activeTab === 'teacher' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'
            }`}
            title="Queue"
          >
            <UserCheck className="w-6 h-6" />
          </button>
        )}

        <button
          onClick={onLogout}
          className="p-2.5 rounded-xl text-slate-500"
          title="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};
