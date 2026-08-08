import React, { useState, useEffect } from 'react';
import { Award, QrCode, Calendar, CheckCircle2, Clock, Sparkles, Trophy, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Registration } from '../types';
import { fetchStudentRegistrations } from '../services/api';

interface StudentDashboardProps {
  onOpenQR: (registration: Registration) => void;
}

// this function is used for rendering student points progress dashboard and registration pass history for more info refer code-wiki.md line 114
export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenQR }) => {
  const { currentUser } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      const regs = await fetchStudentRegistrations(currentUser._id);
      setRegistrations(regs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Calculate Points Breakdown per activity group
  let group1 = 0;
  let group2 = 0;
  let group3 = 0;

  const approvedRegistrations = registrations.filter(r => r.status === 'APPROVED');
  
  approvedRegistrations.forEach((r) => {
    const event = r.eventId as any;
    if (event) {
      if (event.activityGroup === 'Group I') group1 += event.points || 0;
      else if (event.activityGroup === 'Group II') group2 += event.points || 0;
      else if (event.activityGroup === 'Group III') group3 += event.points || 0;
    }
  });

  const totalPoints = group1 + group2 + group3;
  const targetPoints = 100;
  const progressPct = Math.min(100, Math.round((totalPoints / targetPoints) * 100));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REGISTERED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Registered</span>;
      case 'ATTENDED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Gate Attended</span>;
      case 'PENDING_APPROVAL':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">Pending Advisor</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Points Credited</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Welcome & Points Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-zen relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                {currentUser?.studentId || 'KTU Student'}
              </span>
              <span className="text-xs text-slate-500">• {currentUser?.department}</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display text-slate-900">
              {currentUser?.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Automated KTU Activity Points tracking from discovery to teacher approval.
            </p>
          </div>

          {/* Large Points Counter Box */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-5 min-w-[260px] shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-teal-700 to-indigo-600 p-0.5 flex items-center justify-center shadow-md shadow-teal-700/10">
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center text-teal-700">
                <Trophy className="w-7 h-7" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total KTU Points</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-display text-slate-900">{totalPoints}</span>
                <span className="text-xs text-slate-500">/ 100 Target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Graduation Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-700">Mandatory Activity Points Completion</span>
            <span className="text-teal-700">{progressPct}% Completed</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-teal-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Activity Group Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Group 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              Group I
            </span>
            <span className="text-xs text-slate-500 font-semibold">Tech & Seminars</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-slate-900">{group1}</span>
            <span className="text-xs text-slate-500">Points Credited</span>
          </div>
          <p className="text-[11px] text-slate-500">Hackathons, coding contests, technical workshops</p>
        </div>

        {/* Group 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Group II
            </span>
            <span className="text-xs text-slate-500 font-semibold">NSS & Sports</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-slate-900">{group2}</span>
            <span className="text-xs text-slate-500">Points Credited</span>
          </div>
          <p className="text-[11px] text-slate-500">Social initiatives, sports fests, leadership programs</p>
        </div>

        {/* Group 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Group III
            </span>
            <span className="text-xs text-slate-500 font-semibold">Cultural & Arts</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-slate-900">{group3}</span>
            <span className="text-xs text-slate-500">Points Credited</span>
          </div>
          <p className="text-[11px] text-slate-500">Arts fests, music, dance, debates, design</p>
        </div>
      </div>

      {/* Registered Events & Entry Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-700" />
            My Event Passes & Activity History
          </h2>
          <span className="text-xs text-slate-500">{registrations.length} Registrations</span>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">No registered events yet</p>
            <p className="text-xs text-slate-500">Swipe through the Poster Feed to claim your first event pass!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map((reg) => {
              const event = reg.eventId as any;
              if (!event) return null;

              return (
                <div
                  key={reg._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-700">{event.activityGroup}</span>
                        <span className="text-xs text-slate-500">• {event.points} Points</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{event.title}</h3>
                      <p className="text-xs text-slate-500">{event.organizerName} • {event.location}</p>
                    </div>

                    <button
                      onClick={() => onOpenQR(reg)}
                      className="p-3 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-xl transition-all shadow-sm shrink-0 flex flex-col items-center gap-1 group"
                      title="Open Entry QR Pass"
                    >
                      <QrCode className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">QR Pass</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(reg.registeredAt).toLocaleDateString()}</span>
                    </div>

                    {getStatusBadge(reg.status)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
