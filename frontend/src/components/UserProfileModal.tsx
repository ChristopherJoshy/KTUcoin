import React, { useState } from 'react';
import { X, ShieldCheck, Edit3, Check, Award, UserPlus, UserMinus, CalendarDays } from 'lucide-react';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, toggleFollowUser } from '../services/api';
import { Modal } from './ui/Modal';
import { Badge } from './ui/Badge';
import { useToast } from './ui/Toast';
import { cn } from '../lib/cn';

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150'
];

// this function is used for user profile card with follow action and profile customization editor for more info refer code-wiki.md line 104
export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const { currentUser, refreshCurrentUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [classGroup, setClassGroup] = useState(user?.classGroup || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    Boolean(currentUser?.following?.includes(user?._id || ''))
  );
  const [followersCount, setFollowersCount] = useState<number>(user?.followers?.length || 0);

  if (!isOpen || !user) return null;

  const isSelf = currentUser?._id === user._id;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await updateUserProfile(user._id, {
        name,
        bio,
        department,
        classGroup,
        avatarUrl
      });

      if (isSelf) {
        refreshCurrentUser({
          name,
          bio,
          department,
          classGroup,
          avatarUrl
        });
      }

      setIsEditing(false);
      toast('Profile saved', { variant: 'success' });
      if (onProfileUpdated) onProfileUpdated();
    } catch (err: any) {
      toast(err.message || 'Failed to save profile changes', { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!currentUser?._id || isSelf) return;
    try {
      const res = await toggleFollowUser(currentUser._id, user._id);
      setIsFollowing(!isFollowing);
      setFollowersCount(res.followersCount ?? (isFollowing ? followersCount - 1 : followersCount + 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="items-center"
    >
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-teal-600 via-slate-400 to-amber-500 mb-3 relative">
          <img
            src={avatarUrl || user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={user.name}
            className="w-full h-full object-cover rounded-full bg-white dark:bg-slate-900"
          />
          {user.isCR && (
            <span
              className="absolute bottom-0 right-0 bg-amber-500 text-white p-1.5 rounded-full shadow border-2 border-white dark:border-slate-900"
              title="Class Representative"
            >
              <Award className="w-4 h-4" />
            </span>
          )}
        </div>

        <h2 className="text-xl font-extrabold font-display text-slate-900 dark:text-slate-50 text-center">
          {user.name}
        </h2>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap justify-center">
          <Badge tone="teal">{user.role}</Badge>
          {user.isCR && <Badge tone="amber">Class Representative</Badge>}
          {user.studentId && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user.studentId}</span>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs text-center">
          {user.bio || 'Campus member on KTUcoins platform.'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 my-5 text-center">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{followersCount}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Followers
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {user.following?.length || 0}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Following
            </p>
          </div>
        </div>

        {/* Action */}
        {!isSelf ? (
          <button
            onClick={handleToggleFollow}
            className={cn(
              'w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 mb-4',
              isFollowing
                ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                : 'bg-teal-700 hover:bg-teal-800 text-white'
            )}
          >
            {isFollowing ? (
              <>
                <UserMinus className="w-4 h-4" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Follow Profile
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 mb-4"
          >
            <Edit3 className="w-4 h-4 text-teal-400" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        )}

        {/* Edit form */}
        {isEditing && isSelf && (
          <form onSubmit={handleSaveProfile} className="w-full space-y-3.5 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input" />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Share your interests, projects, or goals..."
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Class / Cohort</label>
                <input
                  type="text"
                  value={classGroup}
                  onChange={e => setClassGroup(e.target.value)}
                  placeholder="e.g. S6 CSE A"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Avatar</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 overflow-hidden shrink-0 transition-transform',
                      avatarUrl === preset
                        ? 'border-teal-600 scale-110'
                        : 'border-slate-200 dark:border-slate-700'
                    )}
                  >
                    <img src={preset} alt="Avatar Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {/* Info details */}
        {!isEditing && (
          <div className="w-full space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-400">Department:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{user.department || 'Computer Science'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-400">Class Cohort:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{user.classGroup || 'S6 CSE A'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Email:</span>
              <span className="font-mono text-slate-900 dark:text-slate-100">{user.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Joined
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {new Date((user as any).createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
