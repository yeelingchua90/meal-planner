'use client';

import { useState } from 'react';
import { ComposedMeal, MealComponent } from '@/data/recipes';
import { useHousehold } from '@/contexts/HouseholdContext';
import { ComponentCard } from './ComponentCard';
import { ExpandedMealRow } from './ExpandedMealRow';

interface MealSectionProps {
  label: string;
  meal: ComposedMeal;
  layoutMode: 'compact' | 'expanded';
  emoji: string;
  onComponentTap: (component: MealComponent) => void;
  labelColor?: string;
}

export function MealSection({ label, meal, layoutMode, emoji, onComponentTap, labelColor = 'text-gray-400' }: MealSectionProps) {
  const { members } = useHousehold();
  const primary = members.find((m) => m.is_primary);
  const coveragePct = primary
    ? ((meal.totalCalories / primary.nutrition.calories) * 100).toFixed(0)
    : null;

  const [showPortions, setShowPortions] = useState(false);

  const isBreakfast = meal.mealType === 'breakfast';

  const components: MealComponent[] = isBreakfast
    ? (meal.breakfastComponent ? [meal.breakfastComponent] : [])
    : ([meal.base, meal.protein, meal.vegetable] as Array<MealComponent | undefined>).filter(
        (c): c is MealComponent => c !== undefined
      );

  const topIngredients = meal.allIngredients.slice(0, 4);

  return (
    <div className="mb-6">
      {/* Section header: ── 🌅 Breakfast ── */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className={`text-xs font-medium uppercase tracking-widest whitespace-nowrap ${labelColor}`}>
          {emoji} {label}
        </span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Meal content */}
      {layoutMode === 'compact' ? (
        <div className={isBreakfast ? '' : 'flex gap-2'}>
          {components.map((comp) => (
            <ComponentCard
              key={comp.id}
              component={comp}
              onTap={() => onComponentTap(comp)}
              fullWidth={isBreakfast}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden px-3">
          {components.map((comp, i) => (
            <ExpandedMealRow
              key={comp.id}
              component={comp}
              onTap={() => onComponentTap(comp)}
              isLast={i === components.length - 1}
            />
          ))}
        </div>
      )}

      {/* Summary + coverage row */}
      <div className="mt-2 flex items-center justify-end gap-2">
        {coveragePct !== null && (
          <span className="text-xs text-blue-400">
            ~{coveragePct}% of {primary!.name}&apos;s daily calories
          </span>
        )}
        <span className="bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-600 inline-flex items-center gap-1">
          {meal.totalCalories} kcal · ${meal.totalCost.toFixed(2)}
        </span>
        {topIngredients.length > 0 && (
          <button
            onClick={() => setShowPortions(!showPortions)}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
          >
            portions {showPortions ? '▴' : '▾'}
          </button>
        )}
      </div>

      {/* Portions strip */}
      {showPortions && topIngredients.length > 0 && (
        <div className="mt-1.5 bg-gray-50 rounded-xl px-3 py-2 overflow-x-auto">
          <p className="text-xs text-gray-500 whitespace-nowrap">
            🧺 For 5:{' '}
            {topIngredients.map((ing) => `${ing.name} ${ing.quantity}`).join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}
