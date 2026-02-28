'use client';

import { motion } from 'framer-motion';
import { MealComponent } from '@/data/recipes';

interface ComponentCardProps {
  component: MealComponent;
  onTap: () => void;
  fullWidth?: boolean;
}

export function ComponentCard({ component, onTap, fullWidth = false }: ComponentCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      className={`bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-1.5 text-center${fullWidth ? ' w-full' : ' flex-1'}`}
    >
      <span className="text-3xl leading-none">{component.emoji}</span>
      <p className="text-xs font-medium leading-tight line-clamp-2 w-full">{component.name}</p>
    </motion.button>
  );
}
