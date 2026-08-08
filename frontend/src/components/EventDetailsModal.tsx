import React from 'react';
import { X, Award, Calendar, MapPin, Users, Building2, Zap, CheckCircle2 } from 'lucide-react';
import { CampusEvent, Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import { registerForEvent } from '../services/api';

interface EventDetailsModalProps {
  event: CampusEvent | null;
  userRegistration?: Registration;
  onClose: () => void;
  onRegistered: (reg: Registration) => void;
}

// this function is used for displaying detailed opportunity breakdown, requirements, and registration action for more info refer code-wiki.md line 104
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal w-full max-w-lg rounded-3xl overflow-hidden shadow-zen-lg relative border border-slate-200 text-slate-900 max-h-[90vh] flex flex-col bg-white">
        {/* Header Poster Image */}
        <div className="relative h-56 w-full">
          <img
            src={event.posterUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white hover:text-slate-200 rounded-full bg-slate-950/60 border border-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 mb-2 shadow-md">
              <Award className="w-3.5 h-3.5" />
              {event.activityGroup} • {event.points} KTU Activity Points
            </span>
            <h2 className="text-2xl font-extrabold font-display text-white leading-tight">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span className="font-semibold text-slate-900">{event.organizerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>{event.registeredCount} / {event.registrationCap} Slots</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <p className="text-slate-400 text-[10px]">Date & Time</p>
                <p className="font-semibold text-slate-900">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <p className="text-slate-400 text-[10px]">Venue Location</p>
                <p className="font-semibold text-slate-900 truncate">{event.location}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">About This Opportunity</h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-slate-500">KTU Credit Status</p>
            <p className="text-xs font-bold text-teal-800">Direct Advisor Forwarding</p>
          </div>

          {userRegistration ? (
            <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Registered
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={loading || currentUser?.role !== 'STUDENT'}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-700 to-indigo-600 hover:from-teal-600 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Register Now</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
