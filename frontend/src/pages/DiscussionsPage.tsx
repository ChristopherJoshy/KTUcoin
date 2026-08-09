import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Search,
  Image as ImageIcon,
  Send,
  TrendingUp,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchDiscussions,
  createDiscussion,
  upvoteDiscussion,
  addCommentToDiscussion
} from '../services/api';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { cn } from '../lib/cn';

interface DiscussionThread {
  _id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  hasUpvoted?: boolean;
  comments: {
    _id?: string;
    author: string;
    text: string;
    gifUrl?: string;
    createdAt: string;
  }[];
  createdAt: string;
}

// this function is used for reddit-style public campus discussion threads feed synced with MongoDB for more info refer code-wiki.md line 130
export const DiscussionsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [selectedGifUrl, setSelectedGifUrl] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState<boolean>(false);
  const [showCreateThread, setShowCreateThread] = useState<boolean>(false);

  const [threadTitle, setThreadTitle] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [threadCategory, setThreadCategory] = useState('Group I Tech');

  const presetGifs = [
    { label: 'Coding', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80' },
    { label: 'Hackathon Win', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80' },
    { label: 'Campus Life', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80' },
  ];

  const loadDiscussionsFromDB = async () => {
    try {
      const data = await fetchDiscussions();
      setThreads(data);
    } catch (err) {
      console.error('Failed to load discussions:', err);
    }
  };

  useEffect(() => {
    loadDiscussionsFromDB();
  }, []);

  const categories = ['All', 'Group I Tech', 'Group II Social', 'Group III Arts', 'Internships'];

  const handleToggleUpvote = async (id: string) => {
    try {
      await upvoteDiscussion(id);
      loadDiscussionsFromDB();
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  const handleAddComment = async (threadId: string) => {
    if (!newCommentText.trim() && !selectedGifUrl) return;
    try {
      await addCommentToDiscussion(threadId, {
        author: currentUser?.name || 'Student',
        text: newCommentText,
        gifUrl: selectedGifUrl || undefined
      });
      setNewCommentText('');
      setSelectedGifUrl(null);
      setShowGifPicker(false);
      loadDiscussionsFromDB();
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadTitle || !threadContent) return;

    try {
      await createDiscussion({
        authorName: currentUser?.name || 'Campus Member',
        authorRole: currentUser?.role || 'Student',
        authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        title: threadTitle,
        content: threadContent,
        category: threadCategory
      });
      setThreadTitle('');
      setThreadContent('');
      setShowCreateThread(false);
      toast('Thread published', { description: 'Your discussion is now live in the campus forum.', variant: 'success' });
      loadDiscussionsFromDB();
    } catch (err) {
      toast('Failed to publish thread', { variant: 'error' });
    }
  };

  const filteredThreads = threads.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <PageHeader
        badge={
          <Badge tone="teal" icon={<MessageSquare className="w-3 h-3" />}>
            Public Campus Forum
          </Badge>
        }
        title="Discussions"
        description="Ask questions, share activity point guidance, and discuss campus opportunities."
        actions={
          <button
            onClick={() => setShowCreateThread(true)}
            className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Thread
          </button>
        }
      />

      {/* Category pills & search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors',
                activeCategory === cat
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="form-input pl-9"
          />
        </div>
      </div>

      {/* Threads list */}
      {filteredThreads.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-6 h-6" />}
          title="No discussions found"
          description="Start the conversation by publishing the first thread."
          action={
            <button
              onClick={() => setShowCreateThread(true)}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start a Thread
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredThreads.map(thread => (
            <div
              key={thread._id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-zen space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={thread.authorAvatar}
                    alt={thread.authorName}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {thread.authorName}
                      </span>
                      <Badge tone="teal">{thread.authorRole}</Badge>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Badge tone="neutral">{thread.category}</Badge>
              </div>

              {/* Body */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug mb-1">
                  {thread.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {thread.content}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleUpvote(thread._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    {thread.upvotes}
                  </button>

                  <button
                    onClick={() => setActiveThreadId(activeThreadId === thread._id ? null : thread._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {thread.comments ? thread.comments.length : 0}
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast('Link copied', { description: 'Thread link copied to clipboard.', variant: 'success' });
                  }}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Share Thread"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Comments */}
              {activeThreadId === thread._id && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
                  <div className="space-y-2.5">
                    {thread.comments && thread.comments.length > 0 ? (
                      thread.comments.map((c, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1"
                        >
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{c.author}</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300">{c.text}</p>
                          {c.gifUrl && (
                            <img
                              src={c.gifUrl}
                              alt="GIF"
                              className="w-48 h-28 object-cover rounded-lg mt-2 border border-slate-200 dark:border-slate-700"
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2">No comments yet. Be the first to reply.</p>
                    )}
                  </div>

                  {/* Comment input */}
                  <div className="space-y-2">
                    {selectedGifUrl && (
                      <div className="relative inline-block">
                        <img
                          src={selectedGifUrl}
                          alt="Selected GIF"
                          className="w-32 h-20 object-cover rounded-lg border border-teal-500"
                        />
                        <button
                          onClick={() => setSelectedGifUrl(null)}
                          className="absolute top-1 right-1 p-1 bg-slate-900 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddComment(thread._id)}
                        placeholder="Add a comment..."
                        className="form-input flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGifPicker(!showGifPicker)}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
                        title="Attach GIF"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddComment(thread._id)}
                        className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Send className="w-4 h-4" />
                        Post
                      </button>
                    </div>

                    {showGifPicker && (
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Select Campus GIF
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {presetGifs.map((g, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setSelectedGifUrl(g.url);
                                setShowGifPicker(false);
                              }}
                              className="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-colors"
                            >
                              <img src={g.url} alt={g.label} className="w-full h-16 object-cover" />
                              <span className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] px-1 rounded">
                                {g.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create thread modal */}
      <Modal
        isOpen={showCreateThread}
        onClose={() => setShowCreateThread(false)}
        title="Start a Discussion"
        subtitle="Share a question or topic with the campus"
        icon={<TrendingUp className="w-5 h-5" />}
        size="md"
      >
        <form onSubmit={handleCreateThread} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={threadTitle}
              onChange={e => setThreadTitle(e.target.value)}
              placeholder="e.g. Activity point criteria for hackathon mentors?"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={threadCategory}
              onChange={e => setThreadCategory(e.target.value)}
              className="form-input"
            >
              <option value="Group I Tech">Group I Tech</option>
              <option value="Group II Social">Group II Social</option>
              <option value="Group III Arts">Group III Arts</option>
              <option value="Internships">Internships</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Content
            </label>
            <textarea
              required
              rows={4}
              value={threadContent}
              onChange={e => setThreadContent(e.target.value)}
              placeholder="Provide context or details..."
              className="form-input"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setShowCreateThread(false)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-colors"
            >
              Publish Thread
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
