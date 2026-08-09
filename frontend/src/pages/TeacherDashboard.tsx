import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Award,
  Users,
  GraduationCap,
  Search,
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Registration, RosterItem, User, PermissionLetter } from '../types';
import {
  fetchPendingApprovals,
  approvePointRequest,
  rejectPointRequest,
  fetchStudentRoster,
  searchStudents,
  assignStudentRole,
  notifyStudentDeficiency,
  fetchPermissionLetters,
  decidePermissionLetter
} from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { cn } from '../lib/cn';

type TeacherTab = 'APPROVALS' | 'LETTERS' | 'ROSTER' | 'STUDENTS';

// this function is used for staff advisor and HOD console reviewing point approvals, HOD permission letters, roster, and student management for more info refer code-wiki.md line 118
export const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { confirm } = useConfirm();
  const { toast } = useToast();
  const [pendingQueue, setPendingQueue] = useState<Registration[]>([]);
  const [letters, setLetters] = useState<PermissionLetter[]>([]);
  const [roster, setRoster] = useState<RosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TeacherTab>('APPROVALS');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pendingList, rosterData, lettersData] = await Promise.all([
        fetchPendingApprovals(),
        fetchStudentRoster(),
        fetchPermissionLetters()
      ]);
      setPendingQueue(pendingList);
      setRoster(rosterData);
      setLetters(lettersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleSearchStudents = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const results = await searchStudents(query);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if confetti fails
    }
  };

  const handleApprove = async (reg: Registration) => {
    if (!currentUser?._id) return;
    try {
      setProcessingId(reg._id);
      await approvePointRequest(reg._id, currentUser._id, currentUser.name);
      triggerConfetti();
      toast('Points credited', {
        description: 'The student has been notified of the credit.',
        variant: 'success'
      });
      await loadData();
    } catch (err: any) {
      toast(err.message || 'Approval failed', { variant: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reg: Registration) => {
    const ok = await confirm({
      title: 'Reject this point request?',
      message: 'You will be asked to provide feedback for the student.',
      confirmLabel: 'Continue',
      tone: 'danger'
    });
    if (!ok) return;

    const reason = prompt('Enter rejection feedback for the student:');
    if (reason === null) return;
    try {
      setProcessingId(reg._id);
      await rejectPointRequest(reg._id, currentUser?.name, reason);
      toast('Request rejected', {
        description: 'The student was notified with your feedback.',
        variant: 'warning'
      });
      await loadData();
    } catch (err: any) {
      toast(err.message || 'Rejection failed', { variant: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleLetterDecision = async (letter: PermissionLetter, decision: 'APPROVED' | 'REJECTED') => {
    const ok = await confirm({
      title: decision === 'APPROVED' ? 'Grant HOD permission?' : 'Decline HOD permission?',
      message:
        decision === 'APPROVED'
          ? `Approve ${letter.studentName} to attend "${letter.eventTitle}". Event details will be forwarded to advisor records.`
          : `Decline ${letter.studentName}'s request to attend "${letter.eventTitle}".`,
      confirmLabel: decision === 'APPROVED' ? 'Approve Letter' : 'Decline Letter',
      tone: decision === 'APPROVED' ? 'primary' : 'danger'
    });
    if (!ok) return;

    let note = '';
    if (decision === 'REJECTED') {
      const entered = prompt('Reason for declining (sent to student):');
      if (entered === null) return;
      note = entered;
    }

    try {
      setProcessingId(letter._id);
      const res = await decidePermissionLetter(letter._id, decision, note, currentUser?.name || 'HOD');
      toast(res.message || (decision === 'APPROVED' ? 'Permission granted' : 'Request declined'), {
        variant: decision === 'APPROVED' ? 'success' : 'warning'
      });
      await loadData();
    } catch (err: any) {
      toast(err.message || 'Failed to update letter', { variant: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleCRRole = async (student: User) => {
    const nextCRState = !student.isCR;
    const ok = await confirm({
      title: nextCRState ? `Appoint ${student.name} as CR?` : `Revoke CR role from ${student.name}?`,
      message: nextCRState
        ? 'The student will be notified of their new Class Representative role.'
        : 'The student will be notified that their CR role was removed.',
      confirmLabel: nextCRState ? 'Assign CR' : 'Revoke CR'
    });
    if (!ok) return;

    try {
      await assignStudentRole(student._id, nextCRState, currentUser?.name);
      toast('Role updated', {
        description: `Notification sent to ${student.name}.`,
        variant: 'success'
      });
      await loadData();
      if (searchQuery) handleSearchStudents(searchQuery);
    } catch (err: any) {
      toast(err.message || 'Role update failed', { variant: 'error' });
    }
  };

  const handleSendDeficiencyAlert = async (student: User, points: number) => {
    const ok = await confirm({
      title: `Send deficiency alert to ${student.name}?`,
      message: `They currently have ${points} / 120 points. A warning notification will be sent.`,
      confirmLabel: 'Send Alert'
    });
    if (!ok) return;

    try {
      await notifyStudentDeficiency(student._id, currentUser?.name || 'Staff Advisor', points);
      toast('Alert sent', {
        description: `Deficiency warning sent to ${student.name}.`,
        variant: 'success'
      });
    } catch (err: any) {
      toast(err.message || 'Failed to send notification', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="table" />
      </div>
    );
  }

  const pendingLetters = letters.filter(l => l.status === 'PENDING');

  const tabs: { key: TeacherTab; label: string; count?: number }[] = [
    { key: 'APPROVALS', label: 'Approvals', count: pendingQueue.length },
    { key: 'LETTERS', label: 'HOD Letters', count: pendingLetters.length },
    { key: 'ROSTER', label: 'Roster', count: roster.length },
    { key: 'STUDENTS', label: 'Students' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <PageHeader
        badge={
          <Badge tone="emerald" icon={<UserCheck className="w-3 h-3" />}>
            Staff Advisor & HOD Console
          </Badge>
        }
        title="Advisor & HOD Queue"
        description="Approve activity point claims, review HOD permission letters, and manage your class roster."
        actions={
          <div className="flex items-center gap-4">
            <StatCard
              label="Pending Requests"
              value={pendingQueue.length}
              icon={<Award className="w-4 h-4" />}
              className="py-3 px-4"
            />
          </div>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Approvals"
          value={pendingQueue.length}
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <StatCard
          label="HOD Letters"
          value={pendingLetters.length}
          icon={<FileText className="w-4 h-4" />}
          hint={pendingLetters.length > 0 ? 'Awaiting decision' : 'All reviewed'}
        />
        <StatCard
          label="Students Tracked"
          value={roster.length}
          icon={<GraduationCap className="w-4 h-4" />}
        />
        <StatCard
          label="Class CRs"
          value={roster.filter(item => item.student.isCR).length}
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5',
              activeTab === tab.key
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'APPROVALS' && (
        <div className="space-y-4">
          {pendingQueue.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Approval queue is clear"
              description="All student activity point claims and gate scans have been reviewed."
            />
          ) : (
            <div className="space-y-3">
              {pendingQueue.map(reg => {
                const isManual = reg.isManualClaim;
                const student = reg.studentId as any;
                const title = isManual ? reg.claimTitle : (reg.eventId as any)?.title;
                const points = isManual ? reg.claimPoints : (reg.eventId as any)?.points;
                const group = isManual ? reg.claimGroup : (reg.eventId as any)?.activityGroup;

                if (!student) return null;

                return (
                  <div
                    key={reg._id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-zen"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {student.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          ({student.studentId || 'KTU Student'}) • {student.department}
                        </span>
                        {isManual && <Badge tone="amber">Manual Submission</Badge>}
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
                        {title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <Badge tone="indigo">{group}</Badge>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          +{points} Points Requested
                        </span>
                      </div>

                      {reg.proofDescription && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                          "{reg.proofDescription}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleReject(reg)}
                        disabled={processingId === reg._id}
                        className="py-2 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(reg)}
                        disabled={processingId === reg._id}
                        className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {processingId === reg._id ? 'Approving...' : 'Approve & Credit'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HOD PERMISSION LETTERS */}
      {activeTab === 'LETTERS' && (
        <div className="space-y-4">
          {letters.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-6 h-6" />}
              title="No permission letters yet"
              description="When students join events and request HOD permission, their letters will appear here for review."
            />
          ) : (
            <div className="space-y-3">
              {letters.map(letter => (
                <div
                  key={letter._id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-zen space-y-3"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {letter.studentName}{' '}
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            ({letter.studentRoll || 'Student'} • {letter.classGroup || letter.studentName})
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(letter.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {letter.status === 'PENDING' ? (
                      <Badge tone="amber">Awaiting Decision</Badge>
                    ) : letter.status === 'APPROVED' ? (
                      <Badge tone="emerald">Approved</Badge>
                    ) : (
                      <Badge tone="red">Declined</Badge>
                    )}
                  </div>

                  {/* Letter body */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      I, <span className="font-semibold text-slate-900 dark:text-slate-100">{letter.studentName}</span>{' '}
                      ({letter.studentRoll || 'Student'}, {letter.classGroup || letter.eventGroup}), humbly request
                      permission to attend{' '}
                      <span className="font-semibold text-slate-900 dark:text-slate-100">"{letter.eventTitle}"</span>.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                        <Calendar className="w-3 h-3 text-teal-600 dark:text-teal-400" /> {letter.eventDate || 'TBD'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> {letter.eventVenue || 'TBD'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 font-bold text-amber-700 dark:text-amber-400">
                        +{letter.eventPoints || 0} pts ({letter.eventGroup})
                      </span>
                    </div>

                    {letter.message && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{letter.message}"</p>
                    )}
                  </div>

                  {letter.responseNote && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 rounded-lg p-2.5">
                      <span className="font-bold text-teal-700 dark:text-teal-400">Response:</span> {letter.responseNote}
                    </p>
                  )}

                  {letter.status === 'PENDING' && (
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleLetterDecision(letter, 'REJECTED')}
                        disabled={processingId === letter._id}
                        className="py-2 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </button>
                      <button
                        onClick={() => handleLetterDecision(letter, 'APPROVED')}
                        disabled={processingId === letter._id}
                        className="py-2 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {processingId === letter._id ? 'Updating...' : 'Approve & Forward'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ROSTER */}
      {activeTab === 'ROSTER' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-zen">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Role & Class</th>
                  <th className="py-3.5 px-4">Group I</th>
                  <th className="py-3.5 px-4">Group II</th>
                  <th className="py-3.5 px-4">Group III</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {roster.map(item => (
                  <tr key={item.student._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {item.student.name}
                      <div className="text-[10px] text-slate-400 font-normal">{item.student.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{item.student.classGroup || 'S6 CSE A'}</span>
                        {item.student.isCR && <Badge tone="amber">CR</Badge>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-teal-700 dark:text-teal-400">
                      {item.pointsSummary.group1} pts
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700 dark:text-emerald-400">
                      {item.pointsSummary.group2} pts
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-700 dark:text-indigo-400">
                      {item.pointsSummary.group3} pts
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {item.pointsSummary.totalPoints} / 120
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCRRole(item.student)}
                          className={cn(
                            'px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors border',
                            item.student.isCR
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          )}
                        >
                          {item.student.isCR ? 'Revoke CR' : 'Assign CR'}
                        </button>

                        {item.pointsSummary.totalPoints < 120 && (
                          <button
                            onClick={() => handleSendDeficiencyAlert(item.student, item.pointsSummary.totalPoints)}
                            className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900 transition-colors"
                            title="Send Low Points Alert"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {roster.map(item => (
              <div key={item.student._id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                      {item.student.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.student.studentId} • {item.student.classGroup || 'S6 CSE A'}
                      {item.student.isCR && ' • CR'}
                    </p>
                  </div>
                  <span className="font-black text-slate-900 dark:text-slate-100 text-sm shrink-0">
                    {item.pointsSummary.totalPoints} / 120
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2 border border-slate-100 dark:border-slate-700">
                    <p className="text-[9px] text-slate-400 font-semibold">Group I</p>
                    <p className="font-bold text-teal-700 dark:text-teal-400">{item.pointsSummary.group1}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2 border border-slate-100 dark:border-slate-700">
                    <p className="text-[9px] text-slate-400 font-semibold">Group II</p>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">{item.pointsSummary.group2}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2 border border-slate-100 dark:border-slate-700">
                    <p className="text-[9px] text-slate-400 font-semibold">Group III</p>
                    <p className="font-bold text-indigo-700 dark:text-indigo-400">{item.pointsSummary.group3}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleCRRole(item.student)}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg font-bold text-[10px] transition-colors border',
                      item.student.isCR
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    )}
                  >
                    {item.student.isCR ? 'Revoke CR' : 'Assign CR'}
                  </button>
                  {item.pointsSummary.totalPoints < 120 && (
                    <button
                      onClick={() => handleSendDeficiencyAlert(item.student, item.pointsSummary.totalPoints)}
                      className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900 transition-colors"
                      title="Send Low Points Alert"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SEARCH & MANAGE STUDENTS */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-zen space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearchStudents(e.target.value)}
              placeholder="Search by name, Student ID, or class..."
              className="form-input pl-9"
            />
          </div>

          <div className="space-y-2">
            {isSearching ? (
              <div className="py-8 text-center text-xs text-slate-400 animate-pulse">Searching students...</div>
            ) : searchResults.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Type a query above to search registered student records.
              </p>
            ) : (
              searchResults.map(s => (
                <div
                  key={s._id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{s.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2 font-mono">
                      ({s.studentId || 'Student'})
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 ml-2">• {s.department}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleToggleCRRole(s)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg font-bold text-xs transition-colors border',
                        s.isCR
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      )}
                    >
                      {s.isCR ? 'Class Representative (CR)' : 'Make CR'}
                    </button>

                    <button
                      onClick={() => handleSendDeficiencyAlert(s, 25)}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-900 transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Deficiency Alert
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
