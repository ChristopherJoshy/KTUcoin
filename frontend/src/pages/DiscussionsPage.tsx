import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Plus, 
  Sparkles, 
  Search, 
  Image as ImageIcon, 
  Send, 
  CheckCircle2,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DiscussionThread {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  hasUpvoted?: boolean;
  commentsCount: number;
  createdAt: string;
  comments: {
    id: string;
    author: string;
    text: string;
    gifUrl?: string;
    createdAt: string;
  }[];
}

// this function is used for reddit-style public campus discussions thread feed for more info refer code-wiki.md line 130
export const DiscussionsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [selectedGifUrl, setSelectedGifUrl] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState<boolean>(false);
  const [showCreateThread, setShowCreateThread] = useState<boolean>(false);

  // New Thread state
  const [threadTitle, setThreadTitle] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [threadCategory, setThreadCategory] = useState('Group I Tech');

  const presetGifs = [
    { label: 'Coding', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80' },
    { label: 'Hackathon Win', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80' },
    { label: 'Campus Life', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80' },
  ];

  const [threads, setThreads] = useState<DiscussionThread[]>([
    {
      id: 'disc-1',
      authorName: 'Rahul V. S.',
      authorRole: 'Student (S6 CSE)',
      authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      title: 'How many Group I Activity Points does HackCampus 2026 award?',
      content: 'I noticed HackCampus is listed under Group I. Is the 30 points allocation credited directly to the advisor portal upon gate verification?',
      category: 'Group I Tech',
      upvotes: 24,
      hasUpvoted: false,
      commentsCount: 3,
      createdAt: '2 hours ago',
      comments: [
        {
          id: 'c1',
          author: 'IEEE Student Branch',
          text: 'Yes! Once you scan your QR pass at the entrance and the event completes, points forward automatically to Dr. Anjali Nair queue.',
          createdAt: '1 hour ago'
        },
        {
          id: 'c2',
          author: 'Anish Kumar',
          text: 'Thanks for clarifying! Just registered my slot.',
          createdAt: '45 mins ago'
        }
      ]
    },
    {
      id: 'disc-2',
      authorName: 'Dr. Anjali Nair',
      authorRole: 'Staff Advisor',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      title: 'Guide to KTU Group II Social & Green Energy Drive Approvals',
      content: 'All S6 & S8 students participating in the Green Campus initiative must ensure gate QR scanning is recorded. Unverified attendance cannot be credited.',
      category: 'Group II Social',
      upvotes: 42,
      hasUpvoted: true,
      commentsCount: 1,
      createdAt: '5 hours ago',
      comments: [
        {
          id: 'c3',
          author: 'NSS Unit 104',
          text: 'Organizers will be equipped with live scanners at Campus Square starting 9 AM.',
          createdAt: '3 hours ago'
        }
      ]
    }
  ]);

  const categories = ['All', 'Group I Tech', 'Group II Social', 'Group III Arts', 'Internships'];

  const handleToggleUpvote = (id: string) => {
    setThreads(prev =>
      prev.map(t => {
        if (t.id === id) {
          const hasUpvoted = !t.hasUpvoted;
          return {
            ...t,
            hasUpvoted,
            upvotes: hasUpvoted ? t.upvotes + 1 : t.upvotes - 1
          };
        }
        return t;
      })
    );
  };

  const handleAddComment = (threadId: string) => {
    if (!newCommentText.trim() && !selectedGifUrl) return;

    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: currentUser?.name || 'Student',
            text: newCommentText,
            gifUrl: selectedGifUrl || undefined,
            createdAt: 'Just now'
          };
          return {
            ...t,
            commentsCount: t.commentsCount + 1,
            comments: [...t.comments, newComment]
          };
        }
        return t;
      })
    );

    setNewCommentText('');
    setSelectedGifUrl(null);
    setShowGifPicker(false);
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadTitle || !threadContent) return;

    const newT: DiscussionThread = {
      id: `disc-${Date.now()}`,
      authorName: currentUser?.name || 'Campus Member',
      authorRole: currentUser?.role || 'Student',
      authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      title: threadTitle,
      content: threadContent,
      category: threadCategory,
      upvotes: 1,
      hasUpvoted: true,
      commentsCount: 0,
      createdAt: 'Just now',
      comments: []
    };

    setThreads([newT, ...threads]);
    setThreadTitle('');
    setThreadContent('');
    setShowCreateThread(false);
  };

  const filteredThreads = threads.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fadeIn text-slate-900">
      {/* Top Banner & Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-zen flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> Public Campus Forum
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900">
            Public Discussions
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-lg">
            Ask questions, share activity points guidance, and discuss campus opportunities with peers & advisors.
          </p>
        </div>

        <button
          onClick={() => setShowCreateThread(true)}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-700 to-indigo-600 hover:from-teal-600 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Discussion Thread</span>
        </button>
      </div>

      {/* Filter Category Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Discussion Threads List */}
      <div className="space-y-4">
        {filteredThreads.map((thread) => (
          <div
            key={thread.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
          >
            {/* Thread Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={thread.authorAvatar}
                  alt={thread.authorName}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{thread.authorName}</span>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
                      {thread.authorRole}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{thread.createdAt}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {thread.category}
              </span>
            </div>

            {/* Thread Body */}
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                {thread.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {thread.content}
              </p>
            </div>

            {/* Action Bar (Upvotes, Comments, Share - NO EMOJIS) */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleUpvote(thread.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all font-semibold ${
                    thread.hasUpvoted
                      ? 'bg-teal-50 border-teal-200 text-teal-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${thread.hasUpvoted ? 'fill-teal-700' : ''}`} />
                  <span>{thread.upvotes} Upvotes</span>
                </button>

                <button
                  onClick={() => setActiveThreadId(activeThreadId === thread.id ? null : thread.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>{thread.commentsCount} Comments</span>
                </button>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Thread link copied to clipboard!');
                }}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Share Thread"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded Comments Section */}
            {activeThreadId === thread.id && (
              <div className="pt-4 border-t border-slate-100 space-y-4 animate-fadeIn">
                <div className="space-y-3">
                  {thread.comments.map((comment) => (
                    <div key={comment.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900">{comment.author}</span>
                        <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-700">{comment.text}</p>
                      {comment.gifUrl && (
                        <img src={comment.gifUrl} alt="GIF" className="w-48 h-28 object-cover rounded-lg mt-2 border border-slate-200" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Comment Input Box */}
                <div className="space-y-2">
                  {selectedGifUrl && (
                    <div className="relative inline-block">
                      <img src={selectedGifUrl} alt="Selected GIF" className="w-32 h-20 object-cover rounded-lg border border-teal-500" />
                      <button
                        onClick={() => setSelectedGifUrl(null)}
                        className="absolute top-1 right-1 p-1 bg-slate-900 text-white rounded-full text-[10px]"
                      >
                        X
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a public comment..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 placeholder-slate-400 font-medium"
                    />

                    <button
                      type="button"
                      onClick={() => setShowGifPicker(!showGifPicker)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700"
                      title="Attach GIF"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddComment(thread.id)}
                      className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post</span>
                    </button>
                  </div>

                  {/* GIF Picker Container */}
                  {showGifPicker && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-md space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Campus GIF</p>
                      <div className="grid grid-cols-3 gap-2">
                        {presetGifs.map((g, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setSelectedGifUrl(g.url);
                              setShowGifPicker(false);
                            }}
                            className="group relative rounded-lg overflow-hidden border border-slate-200 hover:border-teal-500"
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

      {/* Create New Thread Modal */}
      {showCreateThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
          <div className="glass-modal w-full max-w-md rounded-3xl p-6 shadow-zen-lg relative border border-slate-200 text-slate-900 bg-white">
            <button
              onClick={() => setShowCreateThread(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 border border-slate-200 transition-colors"
            >
              X
            </button>

            <h3 className="text-xl font-bold font-display text-slate-900 mb-4">Start Public Discussion</h3>

            <form onSubmit={handleCreateThread} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discussion Title</label>
                <input
                  type="text"
                  required
                  value={threadTitle}
                  onChange={(e) => setThreadTitle(e.target.value)}
                  placeholder="e.g. Activity point criteria for hackathon mentors?"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 placeholder-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={threadCategory}
                  onChange={(e) => setThreadCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 font-medium"
                >
                  <option value="Group I Tech">Group I Tech</option>
                  <option value="Group II Social">Group II Social</option>
                  <option value="Group III Arts">Group III Arts</option>
                  <option value="Internships">Internships</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content / Question</label>
                <textarea
                  required
                  rows={4}
                  value={threadContent}
                  onChange={(e) => setThreadContent(e.target.value)}
                  placeholder="Provide context or details..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs text-slate-900 placeholder-slate-400 font-medium"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateThread(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all"
                >
                  Publish Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
