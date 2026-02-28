export interface DayMeal {
  breakfastId: string;
  lunchId: string;
  dinnerId: string;
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: 'mon', label: 'Monday', short: 'Mon' },
  { key: 'tue', label: 'Tuesday', short: 'Tue' },
  { key: 'wed', label: 'Wednesday', short: 'Wed' },
  { key: 'thu', label: 'Thursday', short: 'Thu' },
  { key: 'fri', label: 'Friday', short: 'Fri' },
  { key: 'sat', label: 'Saturday', short: 'Sat' },
];

export const weekMealPlan: Record<DayKey, DayMeal> = {
  mon: {
    breakfastId: 'kaya-toast',
    lunchId: 'chicken-rice',
    dinnerId: 'steamed-fish',
  },
  tue: {
    breakfastId: 'roti-prata',
    lunchId: 'wonton-noodle-soup',
    dinnerId: 'sambal-chicken',
  },
  wed: {
    breakfastId: 'fried-bee-hoon',
    lunchId: 'ban-mian',
    dinnerId: 'tofu-claypot',
  },
  thu: {
    breakfastId: 'nasi-lemak',
    lunchId: 'fish-tofu-soup',
    dinnerId: 'teriyaki-chicken',
  },
  fri: {
    breakfastId: 'overnight-oats',
    lunchId: 'mee-goreng',
    dinnerId: 'butter-chicken',
  },
  sat: {
    breakfastId: 'congee-century-egg',
    lunchId: 'tom-yum-noodles',
    dinnerId: 'lemon-herb-chicken',
  },
};
