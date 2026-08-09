import React, { useState } from 'react';
import {
  Award,
  Calendar,
  MapPin,
  Users,
  Building2,
  Zap,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Send,
  ChevronLeft
} from 'lucide-react';
import { CampusEvent, Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import { registerForEvent, sendPermissionLetter } from '../services/api';
import { Modal } from './ui/Modal';
import { Badge } from './ui/Badge';
import { useToast } from './ui/Toast';

interface EventDetailsModalProps {
  event: CampusEvent | null;
  userRegistration?: Registration;
  onClose: () => void;
  onRegistered: (reg: Registration) => void;
}

// this function is used for event details modal with registration and HOD permission letter request flow for more info refer code-wiki.md line 110
export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  userRegistration,
  onClose,
  onRegistered
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [letterStep, setLetterStep] = useState<Registration | null>(null);
  const [letterMessage, setLetterMessage] = useState('');
  const [sendingLetter, setSendingLetter] = useState(false);

  if (!event) return null;

  const handleRegister = async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      const reg = await registerForEvent(event._id, currentUser._id);
      // Ask the student whether to send an HOD permission letter
      setLetterStep(reg);
    } catch (err: any) {
      toast(err.message || 'Registration failed', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendLetter = async () => {
    if (!letterStep || !currentUser?._id) return;
    try {
      setSendingLetter(true);
      const res = await sendPermissionLetter(letterStep._id, currentUser._id, letterMessage);
      toast(res.message || 'Permission letter sent to HOD', {
        description: 'The HOD will review your request before the event.',
        variant: 'success'
      });
      setLetterStep(null);
      onRegistered(letterStep);
    } catch (err: any) {
      toast(err.message || 'Failed to send letter', { variant: 'error' });
    } finally {
      setSendingLetter(false);
    }
  };

  const handleSkipLetter = () => {
    if (!letterStep) return;
    setLetterStep(null);
    onRegistered(letterStep);
  };

  const handleClose = () => {
    setLetterStep(null);
    onClose();
  };

  const percentCredit = Math.round((event.points / 120) * 100);

  const infoTiles = [
    {
      icon: <Calendar className="w-4 h-4 text-teal-700 dark:text-teal-400" />,
      label: 'Event Date',
      value: event.date
    },
    {
      icon: <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
      label: 'Venue',
      value: event.location || event.venue
    },
    {
      icon: <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
      label: 'Seats Registered',
      value: `${event.registeredCount || 0} / ${event.registrationCap || event.capacity || 150}`
    },
    {
      icon: <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
      label: 'Host Council',
      value: event.organizerName || 'Campus Authority'
    }
  ];

  return (
    <Modal
      isOpen={Boolean(event)}
      onClose={handleClose}
      size="lg"
      className="overflow-hidden"
    >
      {/* Letter step: shown after a successful registration */}
      {letterStep ? (
        <div className="space-y-5 -m-5 sm:-m-6 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">
                Request HOD permission
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send a permission letter to the Head of Department
              </p>
            </div>
          </div>

          {/* Letter preview */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-black font-display text-sm text-slate-900 dark:text-slate-100">
                  KTU<span className="text-amber-500">coins</span>
                </span>
              </div>
              <Badge tone="neutral">Permission Letter</Badge>
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="text-slate-500 dark:text-slate-400">To,</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">The Head of Department</p>
              <p className="text-slate-500 dark:text-slate-400">{currentUser?.department}</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                I, <span className="font-bold text-slate-900 dark:text-slate-100">{currentUser?.name}</span>{' '}
                ({currentUser?.studentId || 'Student'}, {currentUser?.classGroup || currentUser?.department}),
                request permission to attend{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">"{event.title}"</span> organized by{' '}
                {event.organizerName}.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  <Calendar className="w-3 h-3" /> {event.date}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3 h-3" /> {event.location || event.venue}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 font-bold text-amber-700 dark:text-amber-400">
                  +{event.points} KTUcoins ({event.activityGroup})
                </span>
              </div>
              <p className="pt-1">
                I assure that I will complete the mandatory coursework obligations on my return.
              </p>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 italic">
              Generated automatically • Reviewed by the HOD before the event date
            </div>
          </div>

          {/* Optional message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Add a note to the HOD <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={letterMessage}
              onChange={e => setLetterMessage(e.target.value)}
              placeholder="e.g. I am the team lead and have completed all pending assignments..."
              className="form-input"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSkipLetter}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleSendLetter}
              disabled={sendingLetter}
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sendingLetter ? 'Sending...' : 'Send Letter to HOD'}
            </button>
          </div>
        </div>
      ) : (
        <div className="-m-5 sm:-m-6">
          {/* Top image banner */}
          <div className="relative h-44 sm:h-52 w-full shrink-0">
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-5">
              <div className="space-y-1.5">
                <span className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full text-[11px] uppercase tracking-widest inline-flex items-center gap-1 shadow-md">
                  +{event.points} KTUcoins ({event.activityGroup})
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-display text-white leading-tight">
                  {event.title}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* Credit banner */}
            <div className="bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-teal-700 text-white rounded-xl font-extrabold text-sm shrink-0">
                +{event.points} AP
              </div>
              <div className="text-xs space-y-0.5">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" /> KTU Compliant
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Verified attendance grants{' '}
                  <span className="font-bold text-teal-800 dark:text-teal-400">+{event.points} Activity Points</span>{' '}
                  ({event.activityGroup}) — {percentCredit}% of your 120-point target.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {infoTiles.map((tile, i) => (
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

            {/* HOD letter hint */}
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-[11px] text-slate-600 dark:text-slate-400">
              <FileText className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
              <span>
                After claiming a pass, you can send an automated{' '}
                <span className="font-bold text-slate-800 dark:text-slate-200">HOD permission letter</span> for
                this event.
              </span>
            </div>

            {/* Footer CTAs */}
            <div className="pt-1 flex items-center justify-between gap-3">
              <button
                onClick={handleClose}
                className="py-2.5 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors"
              >
                Close
              </button>

              {userRegistration ? (
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Registered (Pass Claimed)</span>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={loading || currentUser?.role !== 'STUDENT'}
                  className="py-2.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Claiming Pass...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Claim Slot & Pass</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
