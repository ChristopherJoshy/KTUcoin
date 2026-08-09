import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { GachaRewardModal } from './components/GachaRewardModal';
import { PosterFeed } from './components/PosterFeed';
import { EventDetailsModal } from './components/EventDetailsModal';
import { QRModal } from './components/QRModal';
import { QRScannerModal } from './components/QRScannerModal';
import { CreateEventModal } from './components/CreateEventModal';
import { CreateProfileModal } from './components/CreateProfileModal';
import { UserProfileModal } from './components/UserProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { RequestPointsModal } from './components/RequestPointsModal';
import { StudentDashboard } from './pages/StudentDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { DiscussionsPage } from './pages/DiscussionsPage';
import { CampusEvent, Registration, User } from './types';
import { fetchEvents } from './services/api';
import { ToastProvider } from './components/ui/Toast';
import { ConfirmProvider } from './components/ui/ConfirmDialog';

// this function is used for main application container managing router tabs, anime.js gacha rewards, side navbar, and modals for more info refer code-wiki.md line 122
const MainAppContent: React.FC = () => {
  const { activeRole, currentUser, refreshProfiles } = useAuth();
  
  const [isLoadingApp, setIsLoadingApp] = useState<boolean>(true);
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [events, setEvents] = useState<CampusEvent[]>([]);
  
  // Gacha Reward Modal state
  const [gachaReward, setGachaReward] = useState<{
    isOpen: boolean;
    points: number;
    title: string;
    activityGroup: string;
  }>({
    isOpen: false,
    points: 20,
    title: '',
    activityGroup: ''
  });

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [activeQRRegistration, setActiveQRRegistration] = useState<Registration | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState<boolean>(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isRequestPointsOpen, setIsRequestPointsOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [profileModalUser, setProfileModalUser] = useState<User | null>(null);

  const loadEventsList = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  useEffect(() => {
    loadEventsList();
  }, []);

  // When role changes, automatically update primary view tab
  useEffect(() => {
    if (activeRole === 'STUDENT' && activeTab !== 'feed' && activeTab !== 'student' && activeTab !== 'discussions') {
      setActiveTab('feed');
    } else if (activeRole === 'ORGANIZER' && activeTab !== 'organizer' && activeTab !== 'feed' && activeTab !== 'discussions') {
      setActiveTab('organizer');
    } else if (activeRole === 'TEACHER' && activeTab !== 'teacher' && activeTab !== 'feed' && activeTab !== 'discussions') {
      setActiveTab('teacher');
    }
  }, [activeRole]);

  const handleOpenUserProfile = (userToView?: User) => {
    setProfileModalUser(userToView || currentUser);
    setIsProfileModalOpen(true);
  };

  if (isLoadingApp) {
    return (
      <LoadingScreen
        onFinish={() => {
          // Refresh profiles now that the backend is confirmed reachable (Render cold start)
          refreshProfiles();
          setIsLoadingApp(false);
        }}
      />
    );
  }

  if (showLoginScreen) {
    return (
      <LoginScreen
        onCompleteLogin={() => setShowLoginScreen(false)}
        onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300">
      {/* Desktop Left Sidebar & Mobile Bottom Navigation Bar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateEvent={() => setIsCreateEventOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => handleOpenUserProfile()}
        onLogout={() => setShowLoginScreen(true)}
      />

      {/* Main View Container */}
      <div className={`md:pl-20 transition-all duration-300 flex-1 ${activeTab === 'feed' ? 'bg-slate-50 dark:bg-slate-950 pb-16 md:pb-0 min-h-screen flex flex-col justify-center' : 'pb-16 md:pb-8'}`}>
        {activeTab === 'feed' ? (
          <div className="w-full flex-1 flex items-center justify-center">
            <PosterFeed
              events={events}
              onOpenDetails={(evt) => setSelectedEvent(evt)}
              onOpenQR={(reg) => setActiveQRRegistration(reg)}
              onRefreshEvents={loadEventsList}
            />
          </div>
        ) : (
          <main className="max-w-7xl mx-auto py-4">
            {activeTab === 'discussions' && (
              <DiscussionsPage />
            )}

            {activeTab === 'student' && (
              <StudentDashboard
                onOpenQR={(reg) => setActiveQRRegistration(reg)}
                onOpenRequestPoints={() => setIsRequestPointsOpen(true)}
                onOpenProfile={() => handleOpenUserProfile()}
              />
            )}

            {activeTab === 'organizer' && (
              <OrganizerDashboard
                onOpenCreateEvent={() => setIsCreateEventOpen(true)}
                onOpenQRScanner={() => setIsQRScannerOpen(true)}
              />
            )}

            {activeTab === 'teacher' && (
              <TeacherDashboard />
            )}
          </main>
        )}
      </div>

      {/* Anime.js Powered Gacha Summon Celebration Modal */}
      <GachaRewardModal
        isOpen={gachaReward.isOpen}
        points={gachaReward.points}
        title={gachaReward.title}
        activityGroup={gachaReward.activityGroup}
        onClose={() => setGachaReward(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Modals Layer */}
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegistered={(reg) => {
          const event = reg.eventId as any;
          setSelectedEvent(null);
          setActiveQRRegistration(reg);
          if (event) {
            setGachaReward({
              isOpen: true,
              points: event.points || 20,
              title: event.title || 'Campus Event',
              activityGroup: event.activityGroup || 'Group I'
            });
          }
        }}
      />

      <QRModal
        registration={activeQRRegistration}
        onClose={() => setActiveQRRegistration(null)}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={() => {
          loadEventsList();
        }}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onEventCreated={() => {
          loadEventsList();
          setActiveTab('feed');
        }}
      />

      <CreateProfileModal
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
      />

      <UserProfileModal
        user={profileModalUser}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <RequestPointsModal
        isOpen={isRequestPointsOpen}
        onClose={() => setIsRequestPointsOpen(false)}
      />
    </div>
  );
};

// this function is used for initializing root React application component with AuthProvider and global toast/confirm providers for more info refer code-wiki.md line 124
export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <MainAppContent />
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
