import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart,
  MessageSquare,
  Share2,
  ChevronUp,
  ChevronDown,
  Eye,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
  Bookmark,
  Repeat,
  TicketCheck,
  ShieldCheck,
  FileText,
  Users
} from 'lucide-react';
import { CampusEvent, Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import { registerForEvent } from '../services/api';
import { Badge } from './ui/Badge';
import { cn } from '../lib/cn';

interface PosterFeedProps {
  events: CampusEvent[];
  onOpenDetails: (event: CampusEvent) => void;
  onOpenQR: (registration: Registration) => void;
  onRefreshEvents: () => void;
}

// this function is used for tiktok style infinite scroll poster reel feed with desktop side details panel and monochrome action rail for more info refer code-wiki.md line 35
export const PosterFeed: React.FC<PosterFeedProps> = ({
  events,
  onOpenDetails,
  onOpenQR,
  onRefreshEvents
}) => {
  const { currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [likedEvents, setLikedEvents] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [savedEvents, setSavedEvents] = useState<Record<string, boolean>>({});
  const [registering, setRegistering] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const isCooldownRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const rulesRef = useRef<HTMLDivElement>(null);

  // Track viewport width to decide whether details live beside the poster (desktop) or in a modal (mobile)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const totalEvents = events.length;
  const currentEvent = events[currentIndex % totalEvents] || events[0];

  const handleNext = useCallback(() => {
    if (totalEvents === 0) return;
    setDirection('up');
    setCurrentIndex(prev => (prev + 1) % totalEvents);
  }, [totalEvents]);

  const handlePrev = useCallback(() => {
    if (totalEvents === 0) return;
    setDirection('down');
    setCurrentIndex(prev => (prev - 1 + totalEvents) % totalEvents);
  }, [totalEvents]);

  // Wheel navigation with cooldown
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isCooldownRef.current) return;
      if (Math.abs(e.deltaY) > 30) {
        isCooldownRef.current = true;
        if (e.deltaY > 0) handleNext();
        else handlePrev();
        setTimeout(() => {
          isCooldownRef.current = false;
        }, 450);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') handleNext();
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') handlePrev();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev]);

  // Touch swipe navigation (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartYRef.current;
    if (Math.abs(delta) > 60) {
      if (delta < 0) handleNext();
      else handlePrev();
    }
    touchStartYRef.current = null;
  };

  const handleToggleLike = (eventId: string, initialCount: number) => {
    setLikedEvents(prev => {
      const isLiked = !prev[eventId];
      setLikeCounts(c => {
        const current = c[eventId] !== undefined ? c[eventId] : initialCount;
        return { ...c, [eventId]: Math.max(0, current + (isLiked ? 1 : -1)) };
      });
      return { ...prev, [eventId]: isLiked };
    });
  };

  const handleToggleSave = (eventId: string) => {
    setSavedEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleQuickRegister = async (event: CampusEvent) => {
    if (!currentUser?._id) return;
    try {
      setRegistering(true);
      const reg = await registerForEvent(event._id, currentUser._id);
      onOpenQR(reg);
      onRefreshEvents();
    } catch (err: any) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  // On desktop open rules inside the side panel; on mobile open the details modal
  const handleRulesAction = () => {
    if (isDesktop) {
      setIsRulesOpen(true);
      setTimeout(() => rulesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } else {
      onOpenDetails(currentEvent);
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="w-full h-[100dvh] flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400">
        <Sparkles className="w-10 h-10 text-amber-500 mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Loading Opportunities...
        </h3>
      </div>
    );
  }

  const baseLikes = currentEvent.registeredCount || 0;
  const currentLikes = likeCounts[currentEvent._id] !== undefined ? likeCounts[currentEvent._id] : baseLikes;
  const isLiked = !!likedEvents[currentEvent._id];
  const isSaved = !!savedEvents[currentEvent._id];
  const viewsCount = (currentEvent.registeredCount || 0) * 8 + 42;
  const percentCredit = Math.round((currentEvent.points / 120) * 100);

  const actionButtonClass = 'p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-zen';

  const panelTiles = [
    {
      icon: <Calendar className="w-4 h-4 text-teal-700 dark:text-teal-400" />,
      label: 'Event Date',
      value: currentEvent.date
    },
    {
      icon: <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
      label: 'Venue',
      value: currentEvent.location || currentEvent.venue
    },
    {
      icon: <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
      label: 'Seats Registered',
      value: `${currentEvent.registeredCount || 0} / ${currentEvent.registrationCap || currentEvent.capacity || 150}`
    },
    {
      icon: <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
      label: 'Host Council',
      value: currentEvent.organizerName || 'Campus Authority'
    }
  ];

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Reel + side details layout */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-0 sm:gap-6 lg:gap-10 sm:p-4 lg:p-8">
        {/* Poster card — blends into the page background, Instagram style */}
        <div className="relative w-full h-full sm:max-w-xl lg:max-w-none lg:w-[min(46vw,620px)] sm:max-h-[calc(100dvh-3rem)] lg:max-h-[calc(100dvh-4rem)] sm:aspect-[4/5] lg:aspect-auto rounded-none sm:rounded-2xl lg:rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 shrink-0">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={currentEvent._id}
              custom={direction}
              initial={{ y: direction === 'up' ? 80 : -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction === 'up' ? -80 : 80, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {/* Poster image: cover on mobile reels, full poster visible on desktop */}
              <img
                src={currentEvent.posterUrl}
                alt={currentEvent.title}
                className="absolute inset-0 w-full h-full object-cover lg:object-contain"
                draggable={false}
              />

              {/* Top badges */}
              <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-start justify-between gap-3">
                <span className="bg-amber-400 text-slate-950 font-black px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs uppercase tracking-widest shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> +{currentEvent.points} KTUcoins
                </span>
                <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5 shrink-0">
                  <Eye className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                  {viewsCount.toLocaleString()}
                </span>
              </div>

              {/* Bottom info drawer (mobile only — desktop uses the side panel) */}
              <div className="lg:hidden absolute bottom-0 inset-x-0 p-4 sm:p-6 pt-20 pb-28 sm:pb-6 space-y-3 sm:space-y-4 text-white bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center text-white border border-white/40 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{currentEvent.organizerName}</p>
                    <p className="text-xs text-teal-300 font-semibold">Verified Campus Organizer</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-display leading-tight drop-shadow-md pr-14">
                    {currentEvent.title}
                  </h2>
                  <p className="text-[11px] sm:text-sm text-slate-200 line-clamp-2 leading-relaxed pr-14">
                    {currentEvent.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs pr-14">
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" /> {currentEvent.date}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold max-w-[220px] truncate">
                    <MapPin className="w-3.5 h-3.5 text-indigo-300 shrink-0" /> {currentEvent.venue || currentEvent.location}
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3 pr-14">
                  <button
                    onClick={() => onOpenDetails(currentEvent)}
                    className="flex-1 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs sm:text-sm border border-white/30 transition-all text-center"
                  >
                    View Full Details
                  </button>

                  {currentUser?.role === 'STUDENT' && (
                    <button
                      onClick={() => handleQuickRegister(currentEvent)}
                      disabled={registering}
                      className="py-3 px-5 sm:px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 shrink-0 disabled:opacity-60"
                    >
                      <TicketCheck className="w-4 h-4" />
                      <span>{registering ? 'Claiming...' : 'Claim Pass'}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT ACTION RAIL (overlay, monochrome) */}
          <div className="absolute right-2 sm:right-4 bottom-24 sm:bottom-28 z-20 flex flex-col items-center gap-3 sm:gap-4">
            {/* Like */}
            <button
              onClick={() => handleToggleLike(currentEvent._id, baseLikes)}
              className="flex flex-col items-center gap-1"
              title="Like"
            >
              <span className={cn(actionButtonClass, 'transition-colors', isLiked && 'bg-red-500 border-red-500')}>
                <Heart className={cn('w-5 h-5', isLiked ? 'fill-white text-white' : 'text-slate-900 dark:text-white')} />
              </span>
              <span className="text-xs font-bold text-white drop-shadow lg:text-slate-900 lg:drop-shadow-none dark:lg:text-white dark:lg:drop-shadow">{currentLikes}</span>
            </button>

            {/* Rules */}
            <button
              onClick={handleRulesAction}
              className="flex flex-col items-center gap-1"
              title="Rules"
            >
              <span className={cn(actionButtonClass, isRulesOpen && isDesktop && 'bg-teal-700 border-teal-700')}>
                <MessageSquare className="w-5 h-5 text-slate-900 dark:text-white" />
              </span>
              <span className="text-xs font-bold text-white drop-shadow lg:text-slate-900 lg:drop-shadow-none dark:lg:text-white dark:lg:drop-shadow">Rules</span>
            </button>

            {/* Save */}
            <button
              onClick={() => handleToggleSave(currentEvent._id)}
              className="flex flex-col items-center gap-1"
              title="Save"
            >
              <span className={cn(actionButtonClass, 'transition-colors', isSaved && 'bg-amber-500 border-amber-500')}>
                <Bookmark className={cn('w-5 h-5', isSaved ? 'fill-white text-white' : 'text-slate-900 dark:text-white')} />
              </span>
              <span className="text-xs font-bold text-white drop-shadow lg:text-slate-900 lg:drop-shadow-none dark:lg:text-white dark:lg:drop-shadow">Save</span>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="flex flex-col items-center gap-1"
              title="Share"
            >
              <span className={actionButtonClass}>
                <Share2 className="w-5 h-5 text-slate-900 dark:text-white" />
              </span>
              <span className="text-xs font-bold text-white drop-shadow lg:text-slate-900 lg:drop-shadow-none dark:lg:text-white dark:lg:drop-shadow">Share</span>
            </button>

            {/* Reel counter */}
            <div className="flex flex-col items-center text-[10px] font-mono font-bold text-white drop-shadow pt-1 lg:text-slate-900 lg:drop-shadow-none dark:lg:text-white dark:lg:drop-shadow">
              <span>{(currentIndex % totalEvents) + 1}/{totalEvents}</span>
              <span className="text-[9px] text-teal-300 flex items-center gap-0.5 mt-0.5">
                <Repeat className="w-2.5 h-2.5" /> Loop
              </span>
            </div>
          </div>

          {/* Prev / Next arrows (desktop hover) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-slate-950/40 hover:bg-slate-950/60 text-white backdrop-blur-md transition-colors"
              title="Previous Reel"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-slate-950/40 hover:bg-slate-950/60 text-white backdrop-blur-md transition-colors"
              title="Next Reel"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DESKTOP SIDE DETAILS PANEL (hidden below lg — keeps the reels section uncluttered) */}
        <aside className="hidden lg:flex flex-col w-[380px] xl:w-[430px] shrink-0 h-full max-h-[calc(100dvh-4rem)] rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
          {/* Panel body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Organizer */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-white border border-teal-500/40 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {currentEvent.organizerName}
                </p>
                <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Campus Organizer
                </p>
              </div>
            </div>

            {/* Title + summary */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-display text-slate-900 dark:text-slate-50 leading-tight">
                {currentEvent.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {currentEvent.description}
              </p>
            </div>

            {/* Points + activity group */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest inline-flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> +{currentEvent.points} KTUcoins
              </span>
              <Badge tone="neutral">{currentEvent.activityGroup}</Badge>
            </div>

            {/* Info tiles */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {panelTiles.map((tile, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <span className="shrink-0">{tile.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-semibold">{tile.label}</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{tile.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rules & details section (toggled via the rail Rules button) */}
            <div
              ref={rulesRef}
              className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden scroll-mt-4"
            >
              <button
                onClick={() => setIsRulesOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors"
              >
                <span className="flex items-center gap-2 text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-teal-700 dark:text-teal-400" /> Rules & Details
                </span>
                <ChevronDown
                  className={cn('w-4 h-4 text-slate-400 transition-transform duration-300', isRulesOpen && 'rotate-180')}
                />
              </button>

              <AnimatePresence initial={false}>
                {isRulesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {currentEvent.description}
                      </p>
                      <div className="bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-xl p-3 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-teal-800 dark:text-teal-400 flex items-center gap-1 mb-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> KTU Compliant
                        </span>
                        Verified attendance grants +{currentEvent.points} Activity Points (
                        {currentEvent.activityGroup}) — {percentCredit}% of the 120-point KTU target.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Panel footer CTAs */}
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
            {currentUser?.role === 'STUDENT' ? (
              <>
                <button
                  onClick={() => handleQuickRegister(currentEvent)}
                  disabled={registering}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <TicketCheck className="w-4 h-4" />
                  <span>{registering ? 'Claiming...' : `Claim Pass & Earn +${currentEvent.points} Points`}</span>
                </button>
                <button
                  onClick={() => onOpenDetails(currentEvent)}
                  className="w-full py-2.5 rounded-xl border border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Register with HOD Permission Letter</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onOpenDetails(currentEvent)}
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors"
              >
                View Full Details
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
