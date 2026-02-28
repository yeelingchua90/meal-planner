'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recipes, Recipe } from '@/data/recipes';
import { RecipeSheet } from '@/components/RecipeSheet';
import { Badge } from '@/components/ui/badge';
import { formatCalories, formatCost } from '@/lib/utils';
import { BookOpen, Flame } from 'lucide-react';

type MealFilter = 'All' | 'breakfast' | 'lunch' | 'dinner';
type CuisineFilter = 'All' | Recipe['cuisine'];

const MEAL_FILTERS: MealFilter[] = ['All', 'breakfast', 'lunch', 'dinner'];
const CUISINE_FILTERS: (CuisineFilter)[] = ['All', 'Chinese', 'Malay', 'Indian', 'Western', 'Japanese', 'Thai'];

const MEAL_LABEL: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

export default function RecipesPage() {
  const [mealFilter, setMealFilter] = useState<MealFilter>('All');
  const [cuisineFilter, setCuisineFilter] = useState<CuisineFilter>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = recipes.filter((r) => {
    const matchMeal = mealFilter === 'All' || r.mealType === mealFilter;
    const matchCuisine = cuisineFilter === 'All' || r.cuisine === cuisineFilter;
    return matchMeal && matchCuisine;
  });

  const openRecipe = (r: Recipe) => {
    setSelectedRecipe(r);
    setSheetOpen(true);
  };

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-[#2563EB]" />
        <h1 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
          Our Recipes
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

      {/* Recipe grid */}
      <motion.div layout className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {filtered.map((recipe) => (
            <motion.button
              key={recipe.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => openRecipe(recipe)}
              className="flex flex-col items-start rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="mb-2 text-4xl">{recipe.emoji}</span>
              <p className="text-sm font-bold leading-snug text-[#0A0A0A] line-clamp-2 min-h-[2.5rem]">
                {recipe.name}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge className="rounded-full bg-[#F3F4F6] text-[#374151] text-xs hover:bg-[#E5E7EB]">
                  {recipe.cuisine}
                </Badge>
                {recipe.kidFriendly && (
                  <Badge className="rounded-full bg-blue-50 text-blue-600 text-xs hover:bg-blue-100">
                    👶
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-[#6B7280]">
                <Flame className="h-3 w-3 text-orange-400" />
                <span>{formatCalories(recipe.calories)}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-[#2563EB]">
                {formatCost(recipe.totalCostSGD)}
              </p>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center text-[#6B7280]">
          <p className="text-4xl mb-2">🍽️</p>
          <p className="text-sm">No recipes match your filters.</p>
        </div>
      )}

      <RecipeSheet
        recipe={selectedRecipe}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
