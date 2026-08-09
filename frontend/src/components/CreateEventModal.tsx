import React, { useState } from 'react';
import { Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createEvent } from '../services/api';
import { ActivityGroup } from '../types';
import { Modal } from './ui/Modal';
import { useToast } from './ui/Toast';
import { cn } from '../lib/cn';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

// this function is used for event creation modal with KTU activity point category presets and auto credit banner for more info refer code-wiki.md line 116
export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityGroup, setActivityGroup] = useState<ActivityGroup>('Group III Arts');
  const [points, setPoints] = useState<number>(30);
  const [date, setDate] = useState('2026-08-25');
  const [venue, setVenue] = useState('Main Auditorium, CET Trivandrum');
  const [capacity, setCapacity] = useState<number>(150);
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80');
  const [loading, setLoading] = useState(false);

  const ktuRulesPresets = [
    { label: 'Hackathon / Innovation Challenge', group: 'Group III Arts' as ActivityGroup, points: 30 },
    { label: 'National Level Paper Presentation', group: 'Group II Tech' as ActivityGroup, points: 40 },
    { label: 'College Technical Workshop / IEEE Event', group: 'Group II Tech' as ActivityGroup, points: 20 },
    { label: 'NSS Social Service & Green Energy Drive', group: 'Group I Social' as ActivityGroup, points: 20 },
    { label: 'Cultural & Arts Championship', group: 'Group III Arts' as ActivityGroup, points: 25 }
  ];

  const handleApplyPreset = (preset: { group: ActivityGroup; points: number }) => {
    setActivityGroup(preset.group);
    setPoints(preset.points);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      setLoading(true);
      await createEvent({
        title,
        description,
        activityGroup,
        points,
        date,
        venue,
        capacity,
        posterUrl,
        organizerId: currentUser?._id,
        organizerName: currentUser?.name || 'Campus Council'
      });
      toast('Event published', {
        description: `${title} is now live in the poster feed.`,
        variant: 'success'
      });
      onEventCreated();
      onClose();
    } catch (err: any) {
      toast(err.message || 'Failed to create event', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const isPresetActive = (preset: { group: ActivityGroup; points: number }) =>
    activityGroup === preset.group && points === preset.points;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post KTU Opportunity Event"
      subtitle="Publish posters and configure auto-crediting activity points"
      icon={<Sparkles className="w-5 h-5" />}
      size="xl"
    >
      {/* KTU presets */}
      <div className="mb-5 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Official KTU Regulations Presets
        </label>
        <div className="grid grid-cols-1 gap-2">
          {ktuRulesPresets.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={cn(
                'p-2.5 rounded-xl border text-left text-xs font-semibold transition-colors flex items-center justify-between gap-2',
                isPresetActive(preset)
                  ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 dark:border-teal-700 text-teal-900 dark:text-teal-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              )}
            >
              <span className="min-w-0">
                <span className="block truncate">{preset.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                  {preset.group} • +{preset.points} points
                </span>
              </span>
              {isPresetActive(preset) && <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Credit banner */}
      <div className="mb-5 border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-2xl flex items-center gap-3">
        <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shrink-0 font-black text-sm">
          +{points}
        </div>
        <div className="text-xs space-y-0.5">
          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Student Point Benefit
          </h4>
          <p className="text-slate-600 dark:text-slate-400">
            Verified attendees earn{' '}
            <span className="font-bold text-amber-600 dark:text-amber-400">+{points} KTUcoins ({activityGroup})</span>{' '}
            — {Math.round((points / 120) * 100)}% of the 120-point requirement.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Event Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. HackCampus 2026: 24-Hour AI Challenge"
            className="form-input"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              KTU Activity Group
            </label>
            <select
              value={activityGroup}
              onChange={e => setActivityGroup(e.target.value as ActivityGroup)}
              className="form-input"
            >
              <option value="Group I Social">Group I: Social Service & NSS</option>
              <option value="Group II Tech">Group II: Technical & Paper Pres.</option>
              <option value="Group III Arts">Group III: Hackathons & Culturals</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Points Allocation
            </label>
            <input
              type="number"
              required
              min={5}
              max={60}
              value={points}
              onChange={e => setPoints(Number(e.target.value))}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description & Rules
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Detail participation criteria..."
            className="form-input"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Event Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Venue / Location
            </label>
            <input
              type="text"
              required
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder="e.g. Main Auditorium, CET"
              className="form-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Poster Image URL
            </label>
            <input
              type="text"
              required
              value={posterUrl}
              onChange={e => setPosterUrl(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Registration Capacity
            </label>
            <input
              type="number"
              min={10}
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
              className="form-input"
            />
          </div>
        </div>

        <div className="pt-3 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Opportunity'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
