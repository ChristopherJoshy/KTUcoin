import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserCheck, CheckCircle2, XCircle, Award, Users, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Registration, RosterItem } from '../types';
import { fetchPendingApprovals, approvePointRequest, rejectPointRequest, fetchStudentRoster } from '../services/api';

// this function is used for staff advisor queue panel to review pending student point requests and view student roster progress for more info refer code-wiki.md line 118
export const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [pendingQueue, setPendingQueue] = useState<Registration[]>([]);
  const [roster, setRoster] = useState<RosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pendingList, rosterData] = await Promise.all([
        fetchPendingApprovals(),
        fetchStudentRoster()
      ]);
      setPendingQueue(pendingList);
      setRoster(rosterData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

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
      const res = await approvePointRequest(reg._id, currentUser._id, currentUser.name);
      triggerConfetti();
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reg: Registration) => {
    if (!confirm('Reject this activity point request?')) return;
    try {
      setProcessingId(reg._id);
      await rejectPointRequest(reg._id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Advisor Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-zen flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Staff Advisor & HOD Queue
            </span>
            <span className="text-xs text-slate-500">• {currentUser?.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900">
            KTU Point Approval Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-lg">
            Review completed event gate attendance records and credit mandatory Activity Points to student ledgers.
          </p>
        </div>

        {/* Pending Counter */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-800 border border-amber-200">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</p>
            <p className="text-2xl font-black font-display text-slate-900">{pendingQueue.length}</p>
          </div>
        </div>
      </div>

      {/* Pending Approval Queue */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          Pending Activity Point Requests ({pendingQueue.length})
        </h2>

        {pendingQueue.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Approval Queue All Clear!</p>
            <p className="text-xs text-slate-500">All completed event gate scans have been reviewed.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingQueue.map((reg) => {
              const event = reg.eventId as any;
              const student = reg.studentId as any;
              if (!event || !student) return null;

              return (
                <div
                  key={reg._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-700">{student.name}</span>
                      <span className="text-xs text-slate-500">({student.studentId || 'KTU Student'})</span>
                      <span className="text-xs text-slate-500">• {student.department}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">{event.title}</h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                        {event.activityGroup}
                      </span>
                      <span className="font-bold text-amber-700">+{event.points} Points Requested</span>
                      <span>• Scanned: {reg.attendedAt ? new Date(reg.attendedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Gate Verified'}</span>
                    </div>
                  </div>

                  {/* Approve / Reject buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReject(reg)}
                      disabled={processingId === reg._id}
                      className="py-2 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-red-700 border border-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprove(reg)}
                      disabled={processingId === reg._id}
                      className="py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{processingId === reg._id ? 'Approving...' : 'Approve & Credit'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Roster & Running Point Totals */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Assigned Student Point Roster Overview
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Student Name & ID</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Group I</th>
                  <th className="py-3.5 px-4">Group II</th>
                  <th className="py-3.5 px-4">Group III</th>
                  <th className="py-3.5 px-4">Total Points</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {roster.map((item) => (
                  <tr key={item.student._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.student.name}
                      <div className="text-[10px] text-slate-400 font-normal">{item.student.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.student.department}</td>
                    <td className="py-3.5 px-4 font-semibold text-teal-700">{item.pointsSummary.group1} pts</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">{item.pointsSummary.group2} pts</td>
                    <td className="py-3.5 px-4 font-semibold text-purple-700">{item.pointsSummary.group3} pts</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      {item.pointsSummary.totalPoints} / 100
                    </td>
                    <td className="py-3.5 px-4">
                      {item.pointsSummary.completedMinReq ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Requirements Met
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          In Progress ({100 - item.pointsSummary.totalPoints} left)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
