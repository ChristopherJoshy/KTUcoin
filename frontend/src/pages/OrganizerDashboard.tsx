import React, { useState, useEffect } from 'react';
import { Building2, Plus, Scan, CheckCircle2, Users, Calendar, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CampusEvent } from '../types';
import { fetchEvents, completeEvent } from '../services/api';

interface OrganizerDashboardProps {
  onOpenCreateEvent: () => void;
  onOpenQRScanner: () => void;
}

// this function is used for creator panel to manage opportunities, scan student gate passes, and mark event completion for more info refer code-wiki.md line 116
export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  onOpenCreateEvent,
  onOpenQRScanner
}) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const loadOrganizerEvents = async () => {
    try {
      setLoading(true);
      const allEvents = await fetchEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizerEvents();
  }, [currentUser]);

  const handleCompleteEvent = async (event: CampusEvent) => {
    if (!confirm(`Mark "${event.title}" as completed? This will forward all verified student gate scans to the Staff Advisor for point approval.`)) {
      return;
    }

    try {
      setCompletingId(event._id);
      const res = await completeEvent(event._id);
      alert(res.message || 'Event marked complete! Student point requests forwarded.');
      await loadOrganizerEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to complete event');
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-zen flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Organizer Console
            </span>
            <span className="text-xs text-slate-500">• {currentUser?.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900">
            Opportunity Management
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-lg">
            Post campus event posters, verify gate attendance via QR scanning, and trigger advisor point approvals.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onOpenQRScanner}
            className="py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Scan className="w-5 h-5" />
            <span>Scan Gate QR</span>
          </button>

          <button
            onClick={onOpenCreateEvent}
            className="py-3 px-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Post New Poster</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Active & Past Created Opportunities
          </h2>
          <span className="text-xs text-slate-500">{events.length} Events Total</span>
        </div>

        {events.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
            <Sparkles className="w-8 h-8 text-indigo-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No opportunities published yet</p>
            <p className="text-xs text-slate-500">Click "Post New Poster" to publish your first campus event poster!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={event.posterUrl}
                    alt={event.title}
                    className="w-20 h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                  />

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700">{event.activityGroup}</span>
                      <span className="text-xs text-slate-500">• {event.points} Points</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug truncate">{event.title}</h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-700" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        {event.registeredCount} / {event.registrationCap}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    {event.isCompleted ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Registration Open
                      </span>
                    )}
                  </div>

                  {!event.isCompleted && (
                    <button
                      onClick={() => handleCompleteEvent(event)}
                      disabled={completingId === event._id}
                      className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-teal-800 border border-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{completingId === event._id ? 'Completing...' : 'Mark Completed'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
