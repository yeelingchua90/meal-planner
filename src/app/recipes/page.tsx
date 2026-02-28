'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedMeal } from '@/data/recipes';
import { allComposedMeals } from '@/data/mealPlan';
import { RecipeSheet } from '@/components/RecipeSheet';
import { Badge } from '@/components/ui/badge';
import { formatCalories, formatCost } from '@/lib/utils';
import { BookOpen, Flame } from 'lucide-react';

type MealFilter = 'All' | 'breakfast' | 'lunch' | 'dinner';
type CuisineFilter = 'All' | 'Chinese' | 'Malay' | 'Indian' | 'Western' | 'Japanese' | 'Thai' | 'Universal';

const MEAL_FILTERS: MealFilter[] = ['All', 'breakfast', 'lunch', 'dinner'];
const CUISINE_FILTERS: CuisineFilter[] = ['All', 'Chinese', 'Malay', 'Indian', 'Western', 'Japanese', 'Thai'];

const MEAL_LABEL: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

function getMealEmoji(meal: ComposedMeal): string {
  return meal.breakfastComponent?.emoji
    ?? meal.protein?.emoji
    ?? meal.base?.emoji
    ?? '🍽️';
}

function getMealDisplayName(meal: ComposedMeal): string {
  if (meal.mealType === 'breakfast') return meal.name;
  return meal.protein?.name ?? meal.name;
}

export default function RecipesPage() {
  const [mealFilter, setMealFilter] = useState<MealFilter>('All');
  const [cuisineFilter, setCuisineFilter] = useState<CuisineFilter>('All');
  const [selectedMeal, setSelectedMeal] = useState<ComposedMeal | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = allComposedMeals.filter((m) => {
    const matchMeal = mealFilter === 'All' || m.mealType === mealFilter;
    const matchCuisine = cuisineFilter === 'All' || m.cuisine === cuisineFilter;
    return matchMeal && matchCuisine;
  });

  const openMeal = (m: ComposedMeal) => {
    setSelectedMeal(m);
    setSheetOpen(true);
  };

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-[#2563EB]" />
        <h1 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
          Our Meals
        </h1>
      </div>

      {/* Meal-type filter pills */}
      <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {MEAL_FILTERS.map((f) => {
          const active = mealFilter === f;
          return (
            <button
              key={f}
              onClick={() => setMealFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
              }`}
            >
              {f === 'All' ? 'All' : MEAL_LABEL[f]}
            </button>
          );
        })}
      </div>

      {/* Cuisine filter pills */}
      <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CUISINE_FILTERS.map((f) => {
          const active = cuisineFilter === f;
          return (
            <button
              key={f}
              onClick={() => setCuisineFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#0A0A0A] text-white'
                  : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Meal grid */}
      <motion.div layout className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {filtered.map((meal) => (
            <motion.button
              key={meal.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => openMeal(meal)}
              className="flex flex-col items-start rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="mb-2 text-4xl">{getMealEmoji(meal)}</span>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-0.5">
                {MEAL_LABEL[meal.mealType]}
              </p>
              <p className="text-sm font-bold leading-snug text-[#0A0A0A] line-clamp-2 min-h-[2.5rem]">
                {getMealDisplayName(meal)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge className="rounded-full bg-[#F3F4F6] text-[#374151] text-xs hover:bg-[#E5E7EB]">
                  {meal.cuisine}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-[#6B7280]">
                <Flame className="h-3 w-3 text-orange-400" />
                <span>{formatCalories(meal.totalCalories)}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-[#2563EB]">
                {formatCost(meal.totalCost)}
              </p>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center text-[#6B7280]">
          <p className="text-4xl mb-2">🍽️</p>
          <p className="text-sm">No meals match your filters.</p>
        </div>
      )}

      <RecipeSheet
        meal={selectedMeal}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
