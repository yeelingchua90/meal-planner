'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayTabs } from '@/components/DayTabs';
import { MealCard } from '@/components/MealCard';
import { weekMealPlan, DAYS, DayKey, allComposedMeals } from '@/data/mealPlan';
import { formatCost } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const },
  }),
};

export default function WeeklyPlanPage() {
  const [activeDay, setActiveDay] = useState<DayKey>('mon');

  const dayPlan = weekMealPlan[activeDay];
  const meals = [
    { meal: dayPlan.breakfast, label: 'Breakfast' },
    { meal: dayPlan.lunch,     label: 'Lunch'     },
    { meal: dayPlan.dinner,    label: 'Dinner'    },
  ];

  const weekCost = getTotalWeekCost();

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
              MealPlanner
            </h1>
            <p className="mt-0.5 text-sm text-[#6B7280]">
              {getWeekDateRange()} · 👨‍👩‍👧‍👦
            </p>
          </div>
          <Badge className="rounded-full bg-[#2563EB] text-white px-3 py-1 text-sm font-semibold hover:bg-[#1d4ed8]">
            {formatCost(weekCost)}
          </Badge>
        </div>
      </div>

      {/* Day tabs */}
      <div className="mb-4 -mx-4 px-4 border-b border-[#E5E7EB]">
        <DayTabs activeDay={activeDay} onSelect={setActiveDay} />
      </div>

      {/* Meal cards with stagger + day-switch fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-3"
        >
          {meals.map(({ meal, label }, i) => (
            <motion.div
              key={`${activeDay}-${label}`}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <MealCard meal={meal} label={label} allMeals={allComposedMeals} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
