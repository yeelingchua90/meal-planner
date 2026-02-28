'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MacroBar } from '@/components/MacroBar';
import { RecipeSheet } from '@/components/RecipeSheet';
import { Recipe } from '@/data/recipes';
import { formatCalories, formatTime, formatCost } from '@/lib/utils';
import { Shuffle, Clock, Flame } from 'lucide-react';
import { useHousehold } from '@/contexts/HouseholdContext';

interface MealCardProps {
  recipe: Recipe;
  label: string;
  allRecipes: Recipe[];
}

export function MealCard({ recipe: initialRecipe, label, allRecipes }: MealCardProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [key, setKey] = useState(0);
  const { members } = useHousehold();
  const yeeling = members.find((m) => m.is_primary);
  const coveragePct = yeeling
    ? Math.round((recipe.calories / yeeling.nutrition.calories) * 100)
    : null;

  const handleSwap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sameType = allRecipes.filter(
      (r) => r.mealType === recipe.mealType && r.id !== recipe.id
    );
    if (sameType.length === 0) return;
    const next = sameType[Math.floor(Math.random() * sameType.length)];
    setSwapping(true);
    setTimeout(() => {
      setRecipe(next);
      setKey((k) => k + 1);
      setSwapping(false);
    }, 200);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={swapping ? { scale: 0.85, opacity: 0 } : { opacity: 1, scale: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Card
              className="relative cursor-pointer overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md transition-shadow p-4"
              onClick={() => setSheetOpen(true)}
            >
              {/* Meal label */}
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
                {label}
              </p>

              {/* Top row: emoji + info + swap */}
              <div className="flex items-start gap-3">
                <span className="text-4xl leading-none">{recipe.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0A0A0A] leading-snug truncate">
                    {recipe.name}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge className="rounded-full bg-[#F3F4F6] text-[#374151] text-xs font-medium hover:bg-[#E5E7EB]">
                      {recipe.cuisine}
                    </Badge>
                    <Badge className="rounded-full bg-[#F3F4F6] text-[#374151] text-xs font-medium hover:bg-[#E5E7EB]">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 rounded-full text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#2563EB]"
                  onClick={handleSwap}
                  aria-label="Swap meal"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>

              {/* Stats row */}
              <div className="mt-3 flex items-center gap-4 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  {formatCalories(recipe.calories)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                  {formatTime(recipe.prepMins + recipe.cookMins)}
                </span>
                <span className="ml-auto font-medium text-[#2563EB]">
                  {formatCost(recipe.totalCostSGD)}
                </span>
              </div>

              {/* Macro bar */}
              <MacroBar
                protein={recipe.protein}
                carbs={recipe.carbs}
                fat={recipe.fat}
                className="mt-2"
              />

              {/* Nutrition coverage */}
              {coveragePct !== null && (
                <p className="mt-1.5 text-xs text-[#6B7280]">
                  ~{coveragePct}% of {yeeling!.name}&apos;s daily calories
                </p>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <RecipeSheet
        recipe={recipe}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
