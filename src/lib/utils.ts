import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCost(sgd: number): string {
  return `$${sgd.toFixed(2)}`;
}

export function formatCalories(kcal: number): string {
  return `${kcal} kcal`;
}

export function formatMacro(label: string, grams: number): string {
  return `${label} ${grams}g`;
}

export function formatTime(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Day-of-week helpers (0=Monday … 6=Sunday, matching DB schema) ────────────

/** Returns 0=Monday through 6=Sunday (matching our DB schema) */
export function todayDayOfWeek(): number {
  const day = new Date().getDay(); // 0=Sun, 1=Mon...6=Sat
  return day === 0 ? 6 : day - 1;
}

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const DAY_SHORTS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
