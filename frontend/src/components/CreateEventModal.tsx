import React, { useState } from 'react';
import { X, Sparkles, Plus, Award, Calendar, MapPin, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createEvent } from '../services/api';
import { ActivityGroup } from '../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

// this function is used for event creation modal supporting KTU activity point category rules selection and auto credit calculation banner for more info refer code-wiki.md line 116
export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated
}) => {
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityGroup, setActivityGroup] = useState<ActivityGroup>('Group III Arts');
  const [points, setPoints] = useState<number>(30);
  const [date, setDate] = useState('2026-08-25');
  const [venue, setVenue] = useState('Main Auditorium, CET Trivandrum');
  const [capacity, setCapacity] = useState<number>(150);
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80');
  const [loading, setLoading] = useState(false);

  // Standard KTU Activity Point Presets
  const ktuRulesPresets = [
    { label: 'Group III: Hackathon / Innovation Challenge (+30 Points)', group: 'Group III Arts' as ActivityGroup, points: 30 },
    { label: 'Group II: National Level Paper Presentation (+40 Points)', group: 'Group II Tech' as ActivityGroup, points: 40 },
    { label: 'Group II: College Technical Workshop / IEEE Event (+20 Points)', group: 'Group II Tech' as ActivityGroup, points: 20 },
    { label: 'Group I: NSS Social Service & Green Energy Drive (+20 Points)', group: 'Group I Social' as ActivityGroup, points: 20 },
    { label: 'Group III: Cultural & Arts Championship (+25 Points)', group: 'Group III Arts' as ActivityGroup, points: 25 },
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
      onEventCreated();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn text-slate-900 font-sans">
      <div className="glass-modal w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-zen-lg relative border border-slate-200 bg-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Event Organizer Studio
          </span>
        </div>

        <h2 className="text-2xl font-black font-display text-slate-900">
          Post KTU Opportunity Event
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Publish event posters and configure auto-crediting KTU Activity Points.
        </p>

        {/* OFFICIAL KTU RULES CATEGORY PRESETS */}
        <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Official KTU Regulations Preset (Auto-calculates student points)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {ktuRulesPresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                  activityGroup === preset.group && points === preset.points
                    ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{preset.label}</span>
                {activityGroup === preset.group && points === preset.points && (
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AUTO-CALCULATED KTU CREDIT REWARD BANNER */}
        <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-indigo-500/10 border border-amber-300 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shrink-0 font-black text-sm">
            +{points}
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Student Activity Point Benefit Banner
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Verified attendees earn <span className="font-bold text-amber-600">+{points} KTUcoins ({activityGroup})</span> — fulfilling <span className="font-bold text-teal-700">{Math.round((points/100)*100)}%</span> of the 100-point graduation requirement.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Event Opportunity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HackCampus 2026: 24-Hour AI Challenge"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">KTU Activity Group</label>
              <select
                value={activityGroup}
                onChange={(e) => setActivityGroup(e.target.value as ActivityGroup)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
              >
                <option value="Group I Social">Group I: Social Service & NSS</option>
                <option value="Group II Tech">Group II: Technical & Paper Pres.</option>
                <option value="Group III Arts">Group III: Hackathons & Culturals</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Points Allocation</label>
              <input
                type="number"
                required
                min={5}
                max={60}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description & Rules</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail participation criteria..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Venue / Location</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Main Auditorium, CET"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Poster Image URL</label>
            <input
              type="text"
              required
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-indigo-600 hover:from-teal-600 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <span>Publishing...</span> : <span>Publish Opportunity</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
