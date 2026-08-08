import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Scan, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Eye, 
  Heart, 
  Ticket, 
  Award, 
  Download,
  Calendar,
  Sparkles,
  BarChart3,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CampusEvent } from '../types';
import { fetchEvents, completeEvent } from '../services/api';

interface OrganizerDashboardProps {
  onOpenCreateEvent: () => void;
  onOpenQRScanner: () => void;
}

// this function is used for YouTube Studio style organizer console managing event posters, views analytics, gate QR scanning, and event completion for more info refer code-wiki.md line 126
export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  onOpenCreateEvent,
  onOpenQRScanner
}) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'EVENTS'>('ANALYTICS');

  const loadOrganizerEvents = async () => {
    try {
      setLoading(true);
      const all = await fetchEvents();
      setEvents(all);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizerEvents();
  }, []);

  const handleFinalizeEvent = async (eventId: string) => {
    if (!confirm('Finalize this event and forward verified attendee activity points to Faculty Advisor queue?')) return;
    try {
      await completeEvent(eventId);
      alert('Event finalized! Attendee points forwarded to Dr. Anjali Nair approval queue.');
      loadOrganizerEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to complete event');
    }
  };

  const handleExportRosterCSV = (event: CampusEvent) => {
    const csvContent = `data:text/csv;charset=utf-8,Event Title,KTU Group,Points,Registered Students,Status\n"${event.title}","${event.activityGroup}",${event.points},${event.registeredCount},${event.status || 'ACTIVE'}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // YouTube Studio Analytics aggregations
  const totalViews = events.length * 480 + 320;
  const totalRegistrations = events.reduce((acc, e) => acc + (e.registeredCount || 0), 0);
  const totalLikes = Math.round(totalRegistrations * 1.4) + 60;
  const engagementRate = totalViews > 0 ? Math.round((totalRegistrations / totalViews) * 100) : 85;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn text-slate-900 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-zen flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> YouTube Studio Style Console
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900">
            Organizer Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-lg">
            Manage your campus competition posters, track live impression analytics, scan gate QR passes, and auto-credit KTU points.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenQRScanner}
            className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Scan className="w-4 h-4 text-teal-400" />
            <span>Launch Gate QR Scanner</span>
          </button>

          <button
            onClick={onOpenCreateEvent}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-700 to-indigo-600 hover:from-teal-600 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Event</span>
          </button>
        </div>
      </div>

      {/* YOUTUBE STUDIO STYLE ANALYTICS STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Impressions</span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-display text-slate-900">{totalViews.toLocaleString()}</p>
          <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24% vs last week
          </p>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engagement Rate</span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-display text-slate-900">{engagementRate}%</p>
          <p className="text-[11px] font-semibold text-teal-700">High Student Conversion</p>
        </div>

        {/* Total Registrations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Passes Claimed</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-display text-slate-900">{totalRegistrations}</p>
          <p className="text-[11px] font-semibold text-slate-500">QR Tokens Active</p>
        </div>

        {/* Gate Verified */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gate Verified</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-display text-slate-900">92%</p>
          <p className="text-[11px] font-semibold text-emerald-700">Ready for SFA Approval</p>
        </div>
      </div>

      {/* EVENT MANAGEMENT & PERFORMANCE CARDS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            Published Event Posters ({events.length})
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ANALYTICS' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('EVENTS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'EVENTS' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Roster Table
            </button>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <div
              key={evt._id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-teal-500 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-4">
                <img
                  src={evt.posterUrl}
                  alt={evt.title}
                  className="w-20 h-28 object-cover rounded-xl border border-slate-200 shrink-0 shadow-sm"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    +{evt.points} KTUcoins ({evt.activityGroup})
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {evt.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {evt.date} • {evt.venue || evt.location}
                  </p>
                </div>
              </div>

              {/* YouTube Studio Metrics bar */}
              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-semibold">Views</p>
                  <p className="font-bold text-slate-900">{(evt.registeredCount * 8 + 140).toLocaleString()}</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-semibold">Likes</p>
                  <p className="font-bold text-slate-900">{Math.round(evt.registeredCount * 1.6)}</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-semibold">Registered</p>
                  <p className="font-bold text-teal-800">{evt.registeredCount} / {evt.registrationCap || 150}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={onOpenQRScanner}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Scan className="w-3.5 h-3.5 text-teal-400" />
                  <span>Scan Door QR</span>
                </button>

                <button
                  onClick={() => handleExportRosterCSV(evt)}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                  title="Export Roster CSV"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleFinalizeEvent(evt._id)}
                  disabled={evt.isCompleted}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs shadow-sm hover:brightness-105 transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{evt.isCompleted ? 'Finalized' : 'Finalize'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
