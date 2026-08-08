import React, { useState } from 'react';
import { X, UserPlus, GraduationCap, Building2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// this function is used for modal interface allowing creation of new custom student, organizer, or teacher profiles for more info refer code-wiki.md line 98
export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose }) => {
  const { addNewProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      setIsSubmitting(true);
      await addNewProfile({
        name,
        email,
        role,
        department,
        studentId: role === 'STUDENT' ? (studentId || `TVE21CS${Math.floor(100 + Math.random() * 900)}`) : undefined
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal w-full max-w-md rounded-3xl p-6 shadow-zen-lg relative border border-slate-200 text-slate-900 bg-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-teal-50 rounded-2xl text-teal-700 border border-teal-200">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900">Create Custom Profile</h3>
            <p className="text-xs text-slate-500">Add a new identity to test platform workflows</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Role Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  role === 'STUDENT'
                    ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole('ORGANIZER')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  role === 'ORGANIZER'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-5 h-5" />
                Organizer
              </button>

              <button
                type="button"
                onClick={() => setRole('TEACHER')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  role === 'TEACHER'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                Advisor
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anish Kumar"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-sm text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. anish@ktu.edu.in"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-sm text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Council</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Mechanical Engineering"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-sm text-slate-900 font-medium"
            />
          </div>

          {role === 'STUDENT' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">KTU Register Number (Optional)</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. TVE21ME012"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-sm text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-all shadow-md shadow-teal-700/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create & Switch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
