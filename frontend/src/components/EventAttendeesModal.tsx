import React, { useState, useEffect } from 'react';
import { Users, Download, CheckCircle2, Clock } from 'lucide-react';
import { CampusEvent, Registration } from '../types';
import { fetchEventAttendees } from '../services/api';
import { Modal } from './ui/Modal';
import { useToast } from './ui/Toast';

interface EventAttendeesModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

// this function is used for organizer view to display registered student participants list and gate verification status for more info refer code-wiki.md line 109
export const EventAttendeesModal: React.FC<EventAttendeesModalProps> = ({
  event,
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [attendees, setAttendees] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendees = async () => {
    if (!event?._id) return;
    try {
      setLoading(true);
      const list = await fetchEventAttendees(event._id);
      setAttendees(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && event) {
      loadAttendees();
    }
  }, [isOpen, event]);

  const handleExportCSV = () => {
    const header = 'Student Name,Student ID,Email,Department,Registered Time,Gate Status\n';
    const rows = attendees.map(reg => {
      const student = reg.studentId as any;
      return `"${student?.name || 'Student'}","${student?.studentId || 'N/A'}","${student?.email || ''}","${student?.department || ''}","${new Date(reg.registeredAt).toLocaleString()}","${reg.status}"`;
    }).join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(header + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${event!.title.replace(/\s+/g, '_')}_Attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast('CSV exported', {
      description: `${attendees.length} participants saved.`,
      variant: 'success'
    });
  };

  const attendedCount = attendees.filter(reg => reg.attended).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event?.title || ''}
      subtitle={`Registered Participants List (${attendees.length} Registered)`}
      icon={<Users className="w-5 h-5" />}
      size="xl"
      headerAction={
        <button
          onClick={handleExportCSV}
          className="py-2 px-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-4 h-4 text-teal-400" />
          <span>Export CSV</span>
        </button>
      }
    >
      {/* Summary strip */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
          <Users className="w-3.5 h-3.5" />
          {attendees.length} Registered
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {attendedCount} Verified
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          {attendees.length - attendedCount} Pending
        </div>
      </div>

      {/* Attendees List Table */}
      <div className="overflow-y-auto max-h-[50vh] border border-slate-200 dark:border-slate-700 rounded-2xl">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 animate-pulse">
            Loading participant list...
          </div>
        ) : attendees.length === 0 ? (
          <div className="py-12 text-center space-y-1">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Registrations Found</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Students registering via poster feed will appear here.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Student ID / Branch</th>
                <th className="py-3 px-4 hidden sm:table-cell">Registered At</th>
                <th className="py-3 px-4">Gate Scan Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {attendees.map(reg => {
                const student = reg.studentId as any;
                return (
                  <tr key={reg._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {student?.name || 'Student'}
                      <div className="text-[10px] text-slate-400 font-normal">{student?.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-teal-700 dark:text-teal-400">
                        {student?.studentId || 'TVE21CS045'}
                      </span>
                      <div className="text-[10px] text-slate-400">{student?.department}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono hidden sm:table-cell">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {reg.attended ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Attended
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          Registered Pass
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Modal>
  );
};
