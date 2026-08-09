import React, { useState } from 'react';
import { UserPlus, GraduationCap, Building2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Modal } from './ui/Modal';
import { useToast } from './ui/Toast';
import { cn } from '../lib/cn';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// this function is used for creating new custom student, organizer, or teacher profiles for more info refer code-wiki.md line 98
export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose }) => {
  const { addNewProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast('Profile created', {
        description: `${name} is now active.`,
        variant: 'success'
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions: { key: UserRole; icon: React.ReactNode; label: string }[] = [
    { key: 'STUDENT', icon: <GraduationCap className="w-5 h-5" />, label: 'Student' },
    { key: 'ORGANIZER', icon: <Building2 className="w-5 h-5" />, label: 'Organizer' },
    { key: 'TEACHER', icon: <UserCheck className="w-5 h-5" />, label: 'Advisor' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Profile"
      subtitle="Add a new identity to the platform"
      icon={<UserPlus className="w-5 h-5" />}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Role Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roleOptions.map(option => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRole(option.key)}
                className={cn(
                  'p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors text-xs font-medium',
                  role === option.key
                    ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 dark:border-teal-600 text-teal-700 dark:text-teal-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Anish Kumar"
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Campus Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. anish@ktu.edu.in"
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Department / Council
          </label>
          <input
            type="text"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            placeholder="e.g. Mechanical Engineering"
            className="form-input"
          />
        </div>

        {role === 'STUDENT' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              KTU Register Number <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              placeholder="e.g. TVE21ME012"
              className="form-input"
            />
          </div>
        )}

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create & Switch'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
