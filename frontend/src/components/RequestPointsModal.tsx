import React, { useState } from 'react';
import { Award, Send, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitManualPointRequest } from '../services/api';
import { Modal } from './ui/Modal';
import { useToast } from './ui/Toast';

interface RequestPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted?: () => void;
}

// this function is used for modal allowing students to submit manual activity point requests to staff advisor approval queue for more info refer code-wiki.md line 107
export const RequestPointsModal: React.FC<RequestPointsModalProps> = ({
  isOpen,
  onClose,
  onRequestSubmitted
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [activityGroup, setActivityGroup] = useState<'Group I' | 'Group II' | 'Group III'>('Group I');
  const [points, setPoints] = useState<number>(20);
  const [proofUrl, setProofUrl] = useState('');
  const [proofDescription, setProofDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?._id || !title || !points) return;

    try {
      setIsSubmitting(true);
      await submitManualPointRequest({
        studentId: currentUser._id,
        claimTitle: title,
        claimGroup: activityGroup,
        claimPoints: Number(points),
        proofUrl,
        proofDescription
      });

      toast('Point request submitted', {
        description: 'Your claim is now in the Staff Advisor approval queue.',
        variant: 'success'
      });
      setTitle('');
      setProofUrl('');
      setProofDescription('');
      onClose();
      if (onRequestSubmitted) onRequestSubmitted();
    } catch (err: any) {
      toast(err.message || 'Failed to submit request', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Activity Points"
      subtitle="Submit certificate / event proof for Staff Advisor approval"
      icon={<Award className="w-5 h-5" />}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Event / Certificate Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Hackathon Finalist Certificate / NSS Camp"
            className="form-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Activity Group
            </label>
            <select
              value={activityGroup}
              onChange={e => setActivityGroup(e.target.value as any)}
              className="form-input"
            >
              <option value="Group I">Group I (Social & NSS)</option>
              <option value="Group II">Group II (Tech & Coding)</option>
              <option value="Group III">Group III (Arts & Sports)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Points Claimed
            </label>
            <input
              type="number"
              required
              min={1}
              max={50}
              value={points}
              onChange={e => setPoints(Number(e.target.value))}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Proof Document / Certificate URL
          </label>
          <input
            type="url"
            value={proofUrl}
            onChange={e => setProofUrl(e.target.value)}
            placeholder="https://drive.google.com/your-certificate-link"
            className="form-input"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description / Remarks for Advisor
          </label>
          <textarea
            rows={3}
            value={proofDescription}
            onChange={e => setProofDescription(e.target.value)}
            placeholder="Brief details about your role or contribution..."
            className="form-input"
          />
        </div>

        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Forwards to Faculty Advisor Queue</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2.5 px-5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-700/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Point Request'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
