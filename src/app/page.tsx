'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayTabs } from '@/components/DayTabs';
import { MealSection } from '@/components/MealSection';
import { LayoutToggle } from '@/components/LayoutToggle';
import { ComponentDetailDrawer } from '@/components/ComponentDetailDrawer';
import { weekMealPlan, DAYS, DayKey } from '@/data/mealPlan';
import { MealComponent } from '@/data/recipes';
import { formatCost } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useHousehold } from '@/contexts/HouseholdContext';

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-indigo-500',
];

function getTodayKey(): DayKey {
  const day = new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const map: Record<number, DayKey> = { 0: 'sat', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };
  return map[day];
}

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
    const yeeling = day.yeelingsLunch?.totalCost ?? 0;
    return total + day.breakfast.totalCost + day.lunch.totalCost + day.dinner.totalCost + yeeling;
  }, 0);
}

export default function WeeklyPlanPage() {
  const [activeDay, setActiveDay] = useState<DayKey>(getTodayKey);
  const [layoutMode, setLayoutMode] = useState<'compact' | 'expanded'>('compact');
  const [selectedComponent, setSelectedComponent] = useState<MealComponent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { members } = useHousehold();

  const dayPlan = weekMealPlan[activeDay];
  const weekCost = getTotalWeekCost();

  const handleComponentTap = (component: MealComponent) => {
    setSelectedComponent(component);
    setIsDrawerOpen(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-[#0A0A0A]">MealPlanner</h1>
            <p className="text-sm text-gray-500 mt-0.5">{getWeekDateRange()}</p>
          </div>
          <div className="flex items-center gap-2">
            <LayoutToggle mode={layoutMode} onChange={setLayoutMode} />
            <Badge className="rounded-full bg-[#2563EB] text-white px-3 py-1 text-sm font-semibold hover:bg-[#1d4ed8]">
              {formatCost(weekCost)}
            </Badge>
          </div>
        </div>

        {/* Household avatars */}
        <div className="flex gap-1.5 flex-wrap">
          {members.map((member, i) => (
            <div
              key={member.id}
              className={`w-7 h-7 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
              title={member.name}
            >
              {member.name.slice(0, 1)}
            </div>
          ))}
        </div>
      </div>

      {/* Day tabs */}
      <div className="mb-4 -mx-4 px-4 border-b border-[#E5E7EB]">
        <DayTabs activeDay={activeDay} onSelect={setActiveDay} />
      </div>

      {/* Meal sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <MealSection
            label="Breakfast"
            meal={dayPlan.breakfast}
            layoutMode={layoutMode}
            emoji="🌅"
            onComponentTap={handleComponentTap}
          />
          {dayPlan.yeelingsLunch && (
            <MealSection
              label="Yeeling's Lunch (12pm)"
              meal={dayPlan.yeelingsLunch}
              layoutMode={layoutMode}
              emoji="🌿"
              onComponentTap={handleComponentTap}
              labelColor="text-teal-500"
            />
          )}
          <MealSection
            label="Lunch"
            meal={dayPlan.lunch}
            layoutMode={layoutMode}
            emoji="☀️"
            onComponentTap={handleComponentTap}
          />
          <MealSection
            label="Dinner"
            meal={dayPlan.dinner}
            layoutMode={layoutMode}
            emoji="🌙"
            onComponentTap={handleComponentTap}
          />
        </motion.div>
      </AnimatePresence>

      {/* Component detail drawer */}
      <ComponentDetailDrawer
        component={selectedComponent}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
