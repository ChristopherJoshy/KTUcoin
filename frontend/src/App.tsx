import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoAuthBanner } from './components/DemoAuthBanner';
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
import { StudentDashboard } from './pages/StudentDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { DiscussionsPage } from './pages/DiscussionsPage';
import { CampusEvent, Registration } from './types';
import { fetchEvents } from './services/api';

// this function is used for main application container managing router tabs, anime.js gacha rewards, side navbar, and modals for more info refer code-wiki.md line 122
const MainAppContent: React.FC = () => {
  const { activeRole, currentUser } = useAuth();
  
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

  if (isLoadingApp) {
    return <LoadingScreen onFinish={() => setIsLoadingApp(false)} />;
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Hackathon Demo Auth Banner */}
      <DemoAuthBanner onOpenCreateProfile={() => setIsCreateProfileOpen(true)} />

      {/* Desktop Left Sidebar & Mobile Bottom Navigation Bar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateEvent={() => setIsCreateEventOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
        onLogout={() => setShowLoginScreen(true)}
      />

      {/* Main View Container (Padded left on desktop for side navbar) */}
      <div className="md:pl-20 transition-all duration-300 flex-1 pb-16 md:pb-8">
        <main className="max-w-7xl mx-auto py-4">
          {activeTab === 'feed' && (
            <PosterFeed
              events={events}
              onOpenDetails={(evt) => setSelectedEvent(evt)}
              onOpenQR={(reg) => setActiveQRRegistration(reg)}
              onRefreshEvents={loadEventsList}
            />
          )}

          {activeTab === 'discussions' && (
            <DiscussionsPage />
          )}

          {activeTab === 'student' && (
            <StudentDashboard onOpenQR={(reg) => setActiveQRRegistration(reg)} />
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
          // Trigger anime.js gacha summon animation!
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
    </div>
  );
};

// this function is used for initializing root App component with AuthContext wrapper for more info refer code-wiki.md line 124
export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
