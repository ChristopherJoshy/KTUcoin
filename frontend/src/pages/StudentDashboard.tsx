import React, { useState, useEffect } from 'react';
import { Award, QrCode, Calendar, CheckCircle2, Clock, Trophy, Plus, GraduationCap, TicketCheck, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Registration } from '../types';
import { fetchStudentRegistrations } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

interface StudentDashboardProps {
  onOpenQR: (registration: Registration) => void;
  onOpenRequestPoints: () => void;
  onOpenProfile: () => void;
}

// this function is used for rendering student points progress dashboard with activity group breakdown and entry passes for more info refer code-wiki.md line 114
export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenQR,
  onOpenRequestPoints,
  onOpenProfile
}) => {
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <SkeletonLoader type="card" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }

  // Points breakdown per activity group
  let group1 = 0;
  let group2 = 0;
  let group3 = 0;

  const approvedRegistrations = registrations.filter(r => r.status === 'APPROVED');

  approvedRegistrations.forEach(r => {
    if (r.isManualClaim) {
      if (r.claimGroup?.includes('Group I')) group1 += r.claimPoints || 0;
      else if (r.claimGroup?.includes('Group II')) group2 += r.claimPoints || 0;
      else if (r.claimGroup?.includes('Group III')) group3 += r.claimPoints || 0;
    } else {
      const event = r.eventId as any;
      if (event) {
        if (event.activityGroup?.includes('Group I')) group1 += event.points || 0;
        else if (event.activityGroup?.includes('Group II')) group2 += event.points || 0;
        else if (event.activityGroup?.includes('Group III')) group3 += event.points || 0;
      }
    }
  });

  const totalPoints = group1 + group2 + group3;
  const targetPoints = 120;
  const progressPct = Math.min(100, Math.round((totalPoints / targetPoints) * 100));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REGISTERED':
        return <Badge tone="teal">Registered</Badge>;
      case 'ATTENDED':
        return <Badge tone="indigo">Gate Attended</Badge>;
      case 'PENDING_APPROVAL':
        return <Badge tone="amber">Pending Advisor</Badge>;
      case 'APPROVED':
        return <Badge tone="emerald">Points Credited</Badge>;
      case 'REJECTED':
        return <Badge tone="red">Rejected</Badge>;
      default:
        return null;
    }
  };

  const groupCards = [
    {
      label: 'Group I',
      sub: 'Social & NSS',
      value: group1,
      tone: 'teal' as const
    },
    {
      label: 'Group II',
      sub: 'Tech & Hackathons',
      value: group2,
      tone: 'emerald' as const
    },
    {
      label: 'Group III',
      sub: 'Arts & Sports',
      value: group3,
      tone: 'indigo' as const
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <PageHeader
        badge={
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone="teal" icon={<GraduationCap className="w-3 h-3" />}>
              {currentUser?.studentId || 'KTU Student'}
            </Badge>
            {currentUser?.isCR && <Badge tone="amber">Class Representative (CR)</Badge>}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser?.department} ({currentUser?.classGroup || 'S6 CSE A'})
            </span>
          </div>
        }
        title={currentUser?.name || 'Student'}
        description="Track KTU activity points from event discovery to advisor approval."
        actions={
          <button
            onClick={onOpenRequestPoints}
            className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Point Claim</span>
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total KTU Points"
          value={`${totalPoints} / ${targetPoints}`}
          icon={<Trophy className="w-4 h-4" />}
          hint={`${progressPct}% of graduation target`}
        />

        {groupCards.map(card => (
          <StatCard
            key={card.label}
            label={`${card.label} • ${card.sub}`}
            value={`${card.value} pts`}
            icon={<Award className="w-4 h-4" />}
            hint="Points credited"
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-zen space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-300">Mandatory Activity Points Progress</span>
          <span className="text-teal-700 dark:text-teal-400">{progressPct}% Completed</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Passes & Claims */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            My Passes & Point Claims
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">{registrations.length} Entries</span>
        </div>

        {registrations.length === 0 ? (
          <EmptyState
            icon={<TicketCheck className="w-6 h-6" />}
            title="No entries yet"
            description="Swipe through the poster feed to claim an event pass, or submit a manual activity claim."
            action={
              <button
                onClick={onOpenRequestPoints}
                className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit First Claim
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map(reg => {
              const isManual = reg.isManualClaim;
              const title = isManual ? reg.claimTitle : (reg.eventId as any)?.title;
              const pointsVal = isManual ? reg.claimPoints : (reg.eventId as any)?.points;
              const group = isManual ? reg.claimGroup : (reg.eventId as any)?.activityGroup;
              const orgOrLocation = isManual
                ? 'Manual Claim Submission'
                : `${(reg.eventId as any)?.organizerName} • ${(reg.eventId as any)?.location}`;

              return (
                <div
                  key={reg._id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-colors flex flex-col justify-between gap-4 shadow-zen"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge tone="neutral">{group || 'Group I'}</Badge>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          +{pointsVal} Points
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
                        {title || 'Activity Entry'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{orgOrLocation}</p>
                    </div>

                    {!isManual && (
                      <button
                        onClick={() => onOpenQR(reg)}
                        className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-400 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shrink-0 flex flex-col items-center gap-1"
                        title="Open Entry QR Pass"
                      >
                        <QrCode className="w-6 h-6" />
                        <span className="text-[10px] font-bold">QR Pass</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
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
