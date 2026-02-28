'use client';

import { motion } from 'framer-motion';
import { formatCost } from '@/lib/utils';

interface BudgetBarProps {
  spent: number;
  budget: number;
}

export function BudgetBar({ spent, budget }: BudgetBarProps) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const over = spent > budget;
  const nearLimit = pct >= 80;

  const barColor = over
    ? 'bg-red-500'
    : nearLimit
    ? 'bg-amber-400'
    : 'bg-green-500';

  const textColor = over
    ? 'text-red-500'
    : nearLimit
    ? 'text-amber-500'
    : 'text-green-600';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#6B7280]">Budget used</span>
        <span className={`font-semibold ${textColor}`}>
          {formatCost(spent)} / {formatCost(budget)}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        />
      </div>
      {over && (
        <p className="text-xs text-red-500">
          {formatCost(spent - budget)} over budget
        </p>
      )}
    </div>
  );
}
