import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// this function is used for merging tailwind class names with conditional logic for more info refer code-wiki.md line 132
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
