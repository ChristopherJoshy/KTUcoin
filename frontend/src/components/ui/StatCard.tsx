import React from 'react';
import { cn } from '../../lib/cn';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  iconClassName?: string;
  className?: string;
}

// this function is used for consistent analytics stat card component for dashboards for more info refer code-wiki.md line 140
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  hint,
  iconClassName,
  className
}) => (
  <div
    className={cn(
      'bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-zen space-y-2',
      className
    )}
  >
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      {icon && (
        <div
          className={cn(
            'p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200',
            iconClassName
          )}
        >
          {icon}
        </div>
      )}
    </div>
    <p className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-slate-50 tracking-tight">
      {value}
    </p>
    {hint && <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{hint}</div>}
  </div>
);
