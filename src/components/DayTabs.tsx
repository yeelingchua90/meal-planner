'use client';

import { motion } from 'framer-motion';
import { DayKey, DAYS } from '@/data/mealPlan';

interface DayTabsProps {
  activeDay: DayKey;
  onSelect: (day: DayKey) => void;
}

export function DayTabs({ activeDay, onSelect }: DayTabsProps) {
  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-1 pb-1">
      {DAYS.map(({ key, short }) => {
        const isActive = key === activeDay;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="relative flex shrink-0 flex-col items-center px-4 py-2 transition-colors"
          >
            <span
              className={`text-sm font-${isActive ? 'bold' : 'medium'} ${
                isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'
              } transition-colors`}
            >
              {short}
            </span>
            {isActive && (
              <motion.div
                layoutId="day-underline"
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#2563EB]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
