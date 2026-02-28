'use client';

import { ComposedMeal, MealComponent } from '@/data/recipes';
import { useHousehold } from '@/contexts/HouseholdContext';
import { ComponentCard } from './ComponentCard';
import { ExpandedMealRow } from './ExpandedMealRow';

interface MealSectionProps {
  label: 'Breakfast' | 'Lunch' | 'Dinner';
  meal: ComposedMeal;
  layoutMode: 'compact' | 'expanded';
  emoji: string;
  onComponentTap: (component: MealComponent) => void;
}

export function MealSection({ label, meal, layoutMode, emoji, onComponentTap }: MealSectionProps) {
  const { members } = useHousehold();
  const primary = members.find((m) => m.is_primary);
  const coveragePct = primary
    ? ((meal.totalCalories / primary.nutrition.calories) * 100).toFixed(0)
    : null;

  const isBreakfast = meal.mealType === 'breakfast';

  const components: MealComponent[] = isBreakfast
    ? (meal.breakfastComponent ? [meal.breakfastComponent] : [])
    : ([meal.base, meal.protein, meal.vegetable] as Array<MealComponent | undefined>).filter(
        (c): c is MealComponent => c !== undefined
      );

  return (
    <div className="mb-6">
      {/* Section header: ── 🌅 Breakfast ── */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">
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
      </div>
    </div>
  );
}
