import React, { useState } from 'react';
import { X, PlusCircle, Image as ImageIcon, Award, Calendar, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ActivityGroup } from '../types';
import { createEvent } from '../services/api';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

// this function is used for creator panel modal interface to publish new opportunity event poster for more info refer code-wiki.md line 110
export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated
}) => {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityGroup, setActivityGroup] = useState<ActivityGroup>('Group I');
  const [points, setPoints] = useState<number>(20);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [registrationCap, setRegistrationCap] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const samplePosters = [
    { label: 'Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80' },
    { label: 'AI Tech', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cultural', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80' },
    { label: 'Green Energy', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !date || !location || !currentUser?._id) return;

    try {
      setIsSubmitting(true);
      await createEvent({
        title,
        description,
        organizerId: currentUser._id,
        organizerName: currentUser.name || 'Campus Club',
        activityGroup,
        points: Number(points),
        date,
        location,
        posterUrl: posterUrl || samplePosters[0].url,
        registrationCap: Number(registrationCap) || 100
      });
      onEventCreated();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal w-full max-w-xl rounded-3xl p-6 shadow-zen-lg relative border border-slate-200 text-slate-900 bg-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-teal-50 rounded-2xl text-teal-700 border border-teal-200">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900">Create New Opportunity</h3>
            <p className="text-xs text-slate-500">Post a new poster event to the swipeable campus feed</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Robowars 2026 Competition"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-sm text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">KTU Activity Group</label>
              <select
                value={activityGroup}
                onChange={(e) => setActivityGroup(e.target.value as ActivityGroup)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
              >
                <option value="Group I">Group I (Technical / Seminars)</option>
                <option value="Group II">Group II (NSS / Sports / Leadership)</option>
                <option value="Group III">Group III (Cultural / Arts)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Points Credited</label>
              <input
                type="number"
                required
                min={5}
                max={50}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Registration Cap</label>
              <input
                type="number"
                required
                value={registrationCap}
                onChange={(e) => setRegistrationCap(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Venue Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Main Auditorium / Lab 3"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Poster Image URL</label>
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 placeholder-slate-400 font-medium mb-2"
            />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Quick presets:</span>
              {samplePosters.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setPosterUrl(p.url)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-teal-800 font-semibold transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe event details, guidelines, rules..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-indigo-600 hover:from-teal-600 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Poster Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
