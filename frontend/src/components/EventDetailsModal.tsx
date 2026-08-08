import React from 'react';
import { X, Award, Calendar, MapPin, Users, Building2, Zap, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { CampusEvent, Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import { registerForEvent } from '../services/api';

interface EventDetailsModalProps {
  event: CampusEvent | null;
  userRegistration?: Registration;
  onClose: () => void;
  onRegistered: (reg: Registration) => void;
}

// this function is used for displaying detailed opportunity breakdown, requirements, and registration action for more info refer code-wiki.md line 110
export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  userRegistration,
  onClose,
  onRegistered
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = React.useState(false);

  if (!event) return null;

  const handleRegister = async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      const reg = await registerForEvent(event._id, currentUser._id);
      onRegistered(reg);
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const percentCredit = Math.round((event.points / 100) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn text-slate-900 font-sans">
      <div className="glass-modal w-full max-w-lg rounded-3xl overflow-hidden shadow-zen-lg relative border border-slate-200 text-slate-900 max-h-[90vh] flex flex-col bg-white">
        {/* Top Image Banner */}
        <div className="relative h-48 w-full bg-slate-100 shrink-0">
          <img
            src={event.posterUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-5">
            <div className="space-y-1">
              <span className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-widest inline-flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> +{event.points} KTUcoins ({event.activityGroup})
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white leading-tight">
                {event.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white bg-slate-950/60 hover:bg-slate-950 rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* OFFICIAL KTU CREDIT REWARD BANNER */}
          <div className="bg-gradient-to-r from-teal-50 via-indigo-50 to-amber-50 border border-teal-200 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-3 bg-teal-700 text-white rounded-xl font-extrabold text-sm shrink-0">
              +{event.points} AP
            </div>
            <div className="text-xs space-y-0.5">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-teal-700" /> KTU Regulations Compliant
              </h4>
              <p className="text-slate-600">
                Verified attendance grants <span className="font-bold text-teal-800">+{event.points} Activity Points</span> ({event.activityGroup}). Fulfills <span className="font-bold text-amber-600">{percentCredit}%</span> of your 100-point graduation target.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Event Date</p>
                <p className="font-bold text-slate-900">{event.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-indigo-700 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Venue Location</p>
                <p className="font-bold text-slate-900 truncate">{event.location || event.venue}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Users className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Seats Registered</p>
                <p className="font-bold text-slate-900">{event.registeredCount || 0} / {event.registrationCap || event.capacity || 150}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Host Council</p>
                <p className="font-bold text-slate-900 truncate">{event.organizerName || 'Campus Authority'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
          >
            Close
          </button>

          {userRegistration ? (
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Registered (Pass Claimed)</span>
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={loading || currentUser?.role !== 'STUDENT'}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-700 to-indigo-600 hover:from-teal-600 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Claiming Pass...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Claim Slot & Pass</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
