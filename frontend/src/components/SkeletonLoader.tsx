import React from 'react';

// this function is used for rendering clean skeleton loading placeholders across all views with dark mode support for more info refer code-wiki.md line 101
export const SkeletonLoader: React.FC<{ type?: 'card' | 'feed' | 'table' | 'profile' }> = ({ type = 'card' }) => {
  const base = 'bg-slate-200 dark:bg-slate-800';
  const soft = 'bg-slate-100 dark:bg-slate-700/50';

  if (type === 'feed') {
    return (
      <div className="w-full max-w-md mx-auto h-[80dvh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-zen p-6 flex flex-col justify-between animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${base}`} />
            <div className="space-y-2">
              <div className={`w-32 h-4 ${base} rounded`} />
              <div className={`w-20 h-3 ${soft} rounded`} />
            </div>
          </div>
          <div className={`w-16 h-6 ${base} rounded-full`} />
        </div>
        <div className={`w-full h-3/5 ${soft} rounded-2xl border border-slate-200 dark:border-slate-800`} />
        <div className="space-y-3">
          <div className={`w-3/4 h-5 ${base} rounded`} />
          <div className={`w-full h-4 ${soft} rounded`} />
          <div className="flex gap-2">
            <div className={`flex-1 h-12 ${base} rounded-xl`} />
            <div className={`flex-1 h-12 ${base} rounded-xl`} />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full space-y-3 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-14 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between"
          >
            <div className={`w-40 h-4 ${base} rounded`} />
            <div className={`w-24 h-4 ${soft} rounded`} />
            <div className={`w-20 h-4 ${base} rounded`} />
            <div className={`w-16 h-6 ${soft} rounded-full`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-zen space-y-4 animate-pulse ${type === 'profile' ? 'max-w-md mx-auto' : ''}`}
    >
      <div className="flex justify-between items-center">
        <div className={`w-28 h-5 ${base} rounded`} />
        <div className={`w-16 h-4 ${soft} rounded`} />
      </div>
      <div className={`w-full h-24 ${soft} rounded-xl`} />
      <div className="flex gap-2 pt-2">
        <div className={`flex-1 h-9 ${base} rounded-lg`} />
        <div className={`flex-1 h-9 ${base} rounded-lg`} />
      </div>
    </div>
  );
};
