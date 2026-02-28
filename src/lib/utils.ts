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
