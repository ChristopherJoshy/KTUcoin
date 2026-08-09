import React from 'react';
import { cn } from '../../lib/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

// this function is used for consistent page header banner across all dashboards for more info refer code-wiki.md line 139
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  className
}) => (
  <div
    className={cn(
      'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-zen p-5 sm:p-7',
      'flex flex-col md:flex-row md:items-center justify-between gap-5',
      className
    )}
  >
    <div className="min-w-0">
      {badge && <div className="mb-2">{badge}</div>}
      <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </div>

    {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
  </div>
);
