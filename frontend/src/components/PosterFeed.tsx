import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Ticket, 
  Award, 
  ChevronUp, 
  ChevronDown, 
  Eye,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
  Zap
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

// this function is used for instagram reels style vertical swipe poster feed container with action rail and anime animations for more info refer code-wiki.md line 108
export const PosterFeed: React.FC<PosterFeedProps> = ({
  events,
  onOpenDetails,
  onOpenQR,
  onRefreshEvents
}) => {
  const { currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [likedEvents, setLikedEvents] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [registering, setRegistering] = useState<boolean>(false);

  const currentEvent = events[currentIndex] || events[0];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < events.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleToggleLike = (eventId: string) => {
    setLikedEvents(prev => {
      const isLiked = !prev[eventId];
      setLikeCounts(c => ({
        ...c,
        [eventId]: (c[eventId] || 85) + (isLiked ? 1 : -1)
      }));
      return { ...prev, [eventId]: isLiked };
    });
  };

  const handleQuickRegister = async (event: CampusEvent) => {
    if (!currentUser?._id) return;
    try {
      setRegistering(true);
      const reg = await registerForEvent(event._id, currentUser._id);
      onOpenQR(reg);
      onRefreshEvents();
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
        <Sparkles className="w-10 h-10 text-amber-500 mb-3 animate-spin" />
        <h3 className="text-lg font-bold text-slate-900">Loading KTU Opportunity Feed...</h3>
      </div>
    );
  }

  const currentLikes = likeCounts[currentEvent._id] || (currentEvent.registeredCount ? Math.round(currentEvent.registeredCount * 1.5) : 85);
  const isLiked = !!likedEvents[currentEvent._id];
  const viewsCount = (currentEvent.registeredCount || 24) * 9 + 320;

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 flex flex-col md:flex-row items-center justify-center gap-6 font-sans">
      {/* REELS CONTAINER (Instagram Reel aspect ratio frame) */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[680px] rounded-3xl overflow-hidden shadow-zen-lg border border-slate-200 bg-slate-950 flex flex-col justify-between shrink-0 group">
        {/* Background Poster Image */}
        <img
          src={currentEvent.posterUrl}
          alt={currentEvent.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark Ambient Gradient Overlays for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40 pointer-events-none" />

        {/* Top Header Tag */}
        <div className="relative z-10 p-5 flex items-center justify-between text-white">
          <span className="bg-amber-400 text-slate-950 font-black px-3.5 py-1 rounded-full text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> +{currentEvent.points} KTUcoins ({currentEvent.activityGroup})
          </span>

          <div className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-bold text-slate-200">
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span>{viewsCount.toLocaleString()} Views</span>
          </div>
        </div>

        {/* Bottom Poster Information Drawer */}
        <div className="relative z-10 p-6 space-y-3 text-white">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black font-display leading-tight text-white drop-shadow-md">
              {currentEvent.title}
            </h2>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {currentEvent.description}
            </p>
          </div>

          {/* Event Meta Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" /> {currentEvent.date}
            </span>
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xl flex items-center gap-1 max-w-[180px] truncate">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {currentEvent.venue || currentEvent.location}
            </span>
          </div>

          {/* Quick Register CTA Bar */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onOpenDetails(currentEvent)}
              className="flex-1 py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs border border-white/30 transition-all text-center"
            >
              View Full Details & Rules
            </button>

            {currentUser?.role === 'STUDENT' && (
              <button
                onClick={() => handleQuickRegister(currentEvent)}
                disabled={registering}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/30 hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{registering ? 'Claiming...' : 'Claim Pass'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REELS RIGHT ACTION RAIL (Instagram Reels Style Icons & Swipe Controls) */}
      <div className="flex md:flex-col items-center justify-center gap-4 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-zen">
        {/* Swipe Up Navigation */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-colors"
          title="Previous Poster"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Like Button */}
        <button
          onClick={() => handleToggleLike(currentEvent._id)}
          className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl transition-all ${
            isLiked ? 'text-red-500 bg-red-50' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500' : ''}`} />
          <span className="text-[10px] font-bold">{currentLikes}</span>
        </button>

        {/* Details & Comments Drawer Trigger */}
        <button
          onClick={() => onOpenDetails(currentEvent)}
          className="flex flex-col items-center gap-1 p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          <span className="text-[10px] font-bold">Rules</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Poster opportunity link copied to clipboard!');
          }}
          className="p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors"
          title="Share Poster"
        >
          <Share2 className="w-6 h-6" />
        </button>

        {/* Swipe Down Navigation */}
        <button
          onClick={handleNext}
          disabled={currentIndex === events.length - 1}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-colors"
          title="Next Poster"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <span className="text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-200">
          {currentIndex + 1} / {events.length}
        </span>
      </div>
    </div>
  );
};
