'use client';

import { useState } from 'react';
import { BudgetBar } from '@/components/BudgetBar';
import { ShoppingList } from '@/components/ShoppingList';
import { weekMealPlan, DAYS, DayKey } from '@/data/mealPlan';
import { ShoppingCart } from 'lucide-react';

function getWeekDateRange(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mon = new Date(now);
  mon.setDate(now.getDate() + diff);
  const sat = new Date(mon);
  sat.setDate(mon.getDate() + 5);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
  return `${fmt(mon)} – ${fmt(sat)}`;
}

function getTotalWeekCost(): number {
  return DAYS.reduce((total, { key }) => {
    const day = weekMealPlan[key as DayKey];
    return total + day.breakfast.totalCost + day.lunch.totalCost + day.dinner.totalCost;
  }, 0);
}

export default function ShoppingPage() {
  const [budget, setBudget] = useState(150);
  const totalCost = getTotalWeekCost();

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-[#2563EB]" />
          <h1 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Shopping List
          </h1>
        </div>
        <p className="mt-0.5 text-sm text-[#6B7280]">{getWeekDateRange()}</p>
      </div>

      {/* Budget input + bar */}
      <div className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-semibold text-[#0A0A0A]" htmlFor="budget">
            Weekly Budget
          </label>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-[#6B7280]">SGD</span>
            <input
              id="budget"
              type="number"
              value={budget}
              min={0}
              onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
              className="w-20 rounded-lg border border-[#E5E7EB] px-2 py-1 text-right text-sm font-bold text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>
        <BudgetBar spent={totalCost} budget={budget} />
      </div>

      {/* Shopping list */}
      <ShoppingList budget={budget} />
    </div>
  );
}
