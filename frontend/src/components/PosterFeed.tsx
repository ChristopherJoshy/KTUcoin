import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown, 
  Share2, 
  Info, 
  QrCode,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';
import { CampusEvent, Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import { registerForEvent, fetchStudentRegistrations } from '../services/api';

interface PosterFeedProps {
  events: CampusEvent[];
  onOpenDetails: (event: CampusEvent) => void;
  onOpenQR: (registration: Registration) => void;
  onRefreshEvents: () => void;
}

// this function is used for signature TikTok/Reels vertically swipeable event poster feed for more info refer code-wiki.md line 102
export const PosterFeed: React.FC<PosterFeedProps> = ({
  events,
  onOpenDetails,
  onOpenQR,
  onRefreshEvents
}) => {
  const { currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userRegistrations, setUserRegistrations] = useState<Registration[]>([]);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);

  const loadStudentRegs = async () => {
    if (currentUser?._id && currentUser.role === 'STUDENT') {
      try {
        const regs = await fetchStudentRegistrations(currentUser._id);
        setUserRegistrations(regs);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadStudentRegs();
  }, [currentUser]);

  const handleNext = () => {
    if (currentIndex < events.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Keyboard arrow listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, events.length]);

  const currentEvent = events[currentIndex];

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'Group I':
        return 'bg-teal-600/90 text-white border-teal-500/40';
      case 'Group II':
        return 'bg-emerald-600/90 text-white border-emerald-500/40';
      case 'Group III':
        return 'bg-purple-600/90 text-white border-purple-500/40';
      default:
        return 'bg-indigo-600/90 text-white border-indigo-500/40';
    }
  };

  const isRegistered = (eventId: string) => {
    return userRegistrations.find(r => (r.eventId?._id || r.eventId) === eventId);
  };

  const handleRegister = async (event: CampusEvent) => {
    if (!currentUser?._id) return;
    try {
      setRegisteringId(event._id);
      const reg = await registerForEvent(event._id, currentUser._id);
      await loadStudentRegs();
      onRefreshEvents();
      onOpenQR(reg);
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleShare = (event: CampusEvent) => {
    navigator.clipboard.writeText(`${window.location.origin}/#event-${event._id}`);
    setCopiedId(event._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center">
        <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 mb-4 text-teal-700">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold font-display text-slate-900">No Opportunities Listed Yet</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
          Switch to Organizer mode to post the first campus event poster!
        </p>
      </div>
    );
  }

  const existingReg = isRegistered(currentEvent._id);

  return (
    <div className="relative w-full max-w-md mx-auto h-[calc(100vh-7rem)] flex flex-col items-center justify-center py-2 px-3">
      {/* Phone / Card Viewport Container */}
      <div 
        ref={feedRef}
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-zen-lg border border-slate-200 bg-slate-900 flex flex-col justify-between"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEvent._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Poster Image Backdrop */}
            <img
              src={currentEvent.posterUrl}
              alt={currentEvent.title}
              className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] filter brightness-95"
            />

            {/* Gradient Overlays for optimal text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-slate-950/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Top Bar inside Card */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getGroupColor(currentEvent.activityGroup)} flex items-center gap-1.5 shadow-md`}>
                  <Award className="w-3.5 h-3.5" />
                  {currentEvent.activityGroup} • {currentEvent.points} Points
                </span>
              </div>

              <div className="text-[11px] font-semibold text-white bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                {currentIndex + 1} / {events.length}
              </div>
            </div>

            {/* Right Action Rail (TikTok/Reels style) */}
            <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
              {/* Register / QR Action */}
              {existingReg ? (
                <button
                  onClick={() => onOpenQR(existingReg)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-white bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">My Pass</span>
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(currentEvent)}
                  disabled={registeringId === currentEvent._id}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 text-white font-bold flex items-center justify-center shadow-xl shadow-teal-500/30 group-hover:scale-110 transition-transform">
                    {registeringId === currentEvent._id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Zap className="w-6 h-6 fill-white" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-white bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-teal-500/40">Claim</span>
                </button>
              )}

              {/* View Full Details Button */}
              <button
                onClick={() => onOpenDetails(currentEvent)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-950/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform hover:bg-slate-900">
                  <Info className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-white shadow-sm">Details</span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => handleShare(currentEvent)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-950/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform hover:bg-slate-900">
                  {copiedId === currentEvent._id ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                </div>
                <span className="text-[10px] font-medium text-white shadow-sm">
                  {copiedId === currentEvent._id ? 'Copied!' : 'Share'}
                </span>
              </button>
            </div>

            {/* Bottom Card Content Info */}
            <div className="absolute bottom-4 left-4 right-16 z-20 space-y-2 text-white">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>{currentEvent.organizerName}</span>
              </div>

              <h2 className="text-xl font-extrabold font-display text-white leading-snug drop-shadow-md">
                {currentEvent.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2.5 text-xs pt-1">
                <div className="flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>{new Date(currentEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 max-w-[150px] truncate">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{currentEvent.location}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentEvent.registeredCount} / {currentEvent.registrationCap}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Floating Swipe Navigation Controls */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 disabled:opacity-30 transition-all shadow-md"
            title="Previous poster"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === events.length - 1}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 disabled:opacity-30 transition-all shadow-md"
            title="Next poster"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
