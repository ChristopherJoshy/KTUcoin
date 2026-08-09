import React, { useState } from 'react';
import {
  Home,
  MessageSquare,
  Bell,
  PlusSquare,
  Sun,
  Moon,
  Menu,
  LogOut,
  GraduationCap,
  Building2,
  UserCheck
} from 'lucide-react';
import { CoinLogo } from './CoinLogo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cn';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateEvent?: () => void;
  onOpenQRScanner?: () => void;
  onOpenCreateProfile: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

// this function is used for instagram style vertical sidebar with monochrome black and white theme icons and collapsing expand hover state for more info refer code-wiki.md line 120
export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateEvent,
  onOpenQRScanner,
  onOpenCreateProfile,
  onOpenNotifications,
  onOpenProfile,
  onLogout
}) => {
  const { currentUser, activeRole } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  const handleCreateAction = () => {
    if (activeRole === 'ORGANIZER' && onOpenCreateEvent) {
      onOpenCreateEvent();
    } else if (activeRole === 'STUDENT') {
      setActiveTab('student');
    } else if (activeRole === 'TEACHER') {
      setActiveTab('teacher');
    }
  };

  const roleDashboard = {
    STUDENT: { tab: 'student', label: 'Dashboard', icon: <GraduationCap className="w-6 h-6" /> },
    ORGANIZER: { tab: 'organizer', label: 'Console', icon: <Building2 className="w-6 h-6" /> },
    TEACHER: { tab: 'teacher', label: 'Advisor Queue', icon: <UserCheck className="w-6 h-6" /> }
  }[activeRole];

  const desktopItems: NavItem[] = [
    {
      key: 'feed',
      label: 'Home',
      icon: <Home className="w-6 h-6" />,
      onClick: () => setActiveTab('feed')
    },
    {
      key: 'discussions',
      label: 'Discussions',
      icon: <MessageSquare className="w-6 h-6" />,
      onClick: () => setActiveTab('discussions')
    },
    {
      key: roleDashboard.tab,
      label: roleDashboard.label,
      icon: roleDashboard.icon,
      onClick: () => setActiveTab(roleDashboard.tab)
    },
    {
      key: 'create',
      label: 'Create',
      icon: <PlusSquare className="w-6 h-6" />,
      onClick: handleCreateAction
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: (
        <div className="relative">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </div>
      ),
      onClick: onOpenNotifications
    }
  ];

  const mobileItems: NavItem[] = [
    {
      key: 'feed',
      label: 'Home',
      icon: <Home className="w-6 h-6" />,
      onClick: () => setActiveTab('feed')
    },
    {
      key: 'discussions',
      label: 'Chat',
      icon: <MessageSquare className="w-6 h-6" />,
      onClick: () => setActiveTab('discussions')
    },
    {
      key: 'create',
      label: 'Create',
      icon: <PlusSquare className="w-6 h-6" />,
      onClick: handleCreateAction
    },
    {
      key: roleDashboard.tab,
      label: roleDashboard.label,
      icon: roleDashboard.icon,
      onClick: () => setActiveTab(roleDashboard.tab)
    },
    {
      key: 'notifications',
      label: 'Alerts',
      icon: (
        <div className="relative">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </div>
      ),
      onClick: onOpenNotifications
    }
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-[76px] hover:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ease-out group shadow-sm">
        <div className="flex flex-col items-start w-full py-6 px-4 space-y-8">
          {/* Brand Header */}
          <div
            className="flex items-center gap-3.5 cursor-pointer overflow-hidden px-0.5 w-full"
            onClick={() => setActiveTab('feed')}
          >
            <CoinLogo size={38} animated={true} />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <span className="font-extrabold font-display text-lg tracking-tight text-slate-900 dark:text-slate-50">
                KTU<span className="text-amber-500">coins</span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Campus Platform
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="w-full space-y-1.5">
            {desktopItems.map(item => (
              <button
                key={item.key}
                onClick={item.onClick}
                className={cn(
                  'w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all relative',
                  activeTab === item.key
                    ? 'font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                )}
                title={item.label}
              >
                <span
                  className={cn(
                    'shrink-0 transition-colors',
                    activeTab === item.key
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                  )}
                >
                  {item.icon}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
                  {item.label}
                </span>

                {/* Active indicator dot */}
                <span
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-teal-700 dark:bg-teal-400 transition-all',
                    activeTab === item.key ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom utilities */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 w-full space-y-1.5 relative">
          {/* Theme switcher */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 shrink-0 text-slate-100 dark:text-white" />
            ) : (
              <Moon className="w-6 h-6 shrink-0 text-slate-900" />
            )}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Profile + More */}
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
            title="Profile"
          >
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={currentUser?.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
            />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium truncate">
              {currentUser?.name}
            </span>
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(prev => !prev)}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
              title="More Options"
            >
              <Menu className="w-6 h-6 shrink-0 text-slate-900 dark:text-white" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium">
                More
              </span>
            </button>

            {showMoreMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-zen-lg p-2 z-50 animate-scale-in">
                <button
                  onClick={onOpenCreateProfile}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <PlusSquare className="w-4 h-4" />
                  <span>Create New Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Switch Role / Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 pb-[env(safe-area-inset-bottom)] flex items-center justify-around shadow-[0_-4px_20px_-8px_rgba(15,23,42,0.08)]">
        {mobileItems.map(item => (
          <button
            key={item.key}
            onClick={item.onClick}
            className="flex flex-col items-center gap-0.5 py-2 px-1.5 min-w-[52px]"
            title={item.label}
          >
            <span
              className={cn(
                'transition-colors',
                activeTab === item.key
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {item.icon}
            </span>
            <span
              className={cn(
                'text-[9px] font-semibold leading-none',
                activeTab === item.key
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 dark:text-slate-500'
              )}
            >
              {item.label}
            </span>
          </button>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex flex-col items-center gap-0.5 py-2 px-1.5 min-w-[52px]"
          title="Toggle Theme"
        >
          <span className={isDarkMode ? 'text-amber-400' : 'text-slate-900 dark:text-white'}>
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </span>
          <span className="text-[9px] font-semibold leading-none text-slate-400 dark:text-slate-500">
            Theme
          </span>
        </button>
      </nav>
    </>
  );
};
