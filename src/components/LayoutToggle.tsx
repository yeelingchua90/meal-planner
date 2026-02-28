'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';

interface LayoutToggleProps {
  mode: 'compact' | 'expanded';
  onChange: (mode: 'compact' | 'expanded') => void;
}

const MODES = [
  { key: 'compact' as const,  Icon: LayoutGrid },
  { key: 'expanded' as const, Icon: List },
] as const;

export function LayoutToggle({ mode, onChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5">
      {MODES.map(({ key, Icon }) => {
        const isActive = mode === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative rounded-full p-1.5"
            aria-label={`${key} layout`}
          >
            {isActive && (
              <motion.div
                layoutId="layout-toggle-bg"
                className="absolute inset-0 bg-[#2563EB] rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 flex items-center justify-center ${isActive ? 'text-white' : 'text-gray-500'}`}>
              <Icon size={14} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
