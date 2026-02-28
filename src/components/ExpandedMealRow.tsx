'use client';

import { motion } from 'framer-motion';
import { MealComponent } from '@/data/recipes';

interface ExpandedMealRowProps {
  component: MealComponent;
  onTap: () => void;
  isLast?: boolean;
}

export function ExpandedMealRow({ component, onTap, isLast = false }: ExpandedMealRowProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className={`w-full flex items-center gap-3 py-3 px-1 text-left${!isLast ? ' border-b border-gray-100' : ''}`}
    >
      <span className="text-2xl leading-none shrink-0">{component.emoji}</span>
      <span className="font-medium text-sm flex-1 min-w-0 truncate">{component.name}</span>
      <span className="text-xs text-gray-500 shrink-0">
        {component.calories} kcal · ${component.totalCostSGD.toFixed(2)}
      </span>
    </motion.button>
  );
}
