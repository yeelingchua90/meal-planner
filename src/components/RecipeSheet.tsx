'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ComposedMeal, MealComponent, Ingredient } from '@/data/recipes';
import { MacroBar } from '@/components/MacroBar';
import { formatCost, formatCalories, formatTime } from '@/lib/utils';
import { Clock, ChefHat, Flame } from 'lucide-react';
import { useHousehold } from '@/contexts/HouseholdContext';

function portionLabel(ratio: number): string {
  if (ratio >= 1.15) return '1¼ servings';
  if (ratio >= 0.9) return '1 serving (adult portion)';
  if (ratio >= 0.7) return '¾ serving';
  if (ratio >= 0.55) return '½–¾ serving';
  return '½ serving';
}

function memberEmoji(gender: 'M' | 'F', age: number): string {
  if (gender === 'M') return age <= 12 ? '👦' : '👨';
  return '👩';
}

interface RecipeSheetProps {
  meal: ComposedMeal | null;
  open: boolean;
  onClose: () => void;
}

function ComponentSection({ component, sectionLabel }: { component: MealComponent; sectionLabel: string }) {
  const totalTime = component.prepMins + component.cookMins;
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{component.emoji}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">{sectionLabel}</p>
          <p className="font-bold text-[#0A0A0A]">{component.name}</p>
        </div>
        {totalTime > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs text-[#6B7280]">
            <Clock className="h-3 w-3 text-blue-400" />
            {formatTime(totalTime)}
          </span>
        )}
      </div>

      {/* Mini nutrition row */}
      <div className="flex gap-3 text-xs text-[#6B7280] mb-3">
        <span className="flex items-center gap-1">
          <Flame className="h-3 w-3 text-orange-400" />
          {component.calories} kcal
        </span>
        <span className="text-blue-500 font-medium">{component.protein}g P</span>
        <span className="text-amber-500 font-medium">{component.carbs}g C</span>
        <span className="text-rose-400 font-medium">{component.fat}g F</span>
      </div>

      {/* Ingredients */}
      <ul className="space-y-1.5 mb-3">
        {component.ingredients.map((ing: Ingredient) => (
          <li key={ing.name} className="flex items-center justify-between text-sm">
            <span className="text-[#0A0A0A]">{ing.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-[#6B7280]">{ing.quantity}</span>
              <span className="text-xs text-[#6B7280]">{formatCost(ing.estimatedCostSGD)}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Instructions */}
      {component.instructions.length > 0 && (
        <ol className="space-y-2">
          {component.instructions.map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-[#0A0A0A]">{step}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function RecipeSheet({ meal, open, onClose }: RecipeSheetProps) {
  const { members } = useHousehold();
  if (!meal) return null;

  const isBreakfast = meal.mealType === 'breakfast';
  const mainEmoji = isBreakfast
    ? meal.breakfastComponent?.emoji
    : meal.protein?.emoji ?? '🍽️';

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-4 pb-8"
      >
        <SheetHeader className="mb-4 pt-2">
          <div className="text-5xl mb-2">{mainEmoji}</div>
          <SheetTitle className="text-left text-xl font-bold text-[#0A0A0A]">
            {isBreakfast ? meal.name : (meal.protein?.name ?? meal.name)}
          </SheetTitle>
          {!isBreakfast && (
            <p className="text-sm text-[#6B7280] -mt-1">
              with {[meal.base?.name, meal.vegetable?.name].filter(Boolean).join(' · ')}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary" className="bg-[#F3F4F6] text-[#374151] rounded-full">
              {meal.cuisine}
            </Badge>
          </div>
        </SheetHeader>

        {/* Total nutrition summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center rounded-xl bg-[#F3F4F6] p-3">
            <Flame className="h-4 w-4 text-orange-400 mb-1" />
            <span className="text-sm font-semibold text-[#0A0A0A]">{formatCalories(meal.totalCalories)}</span>
            <span className="text-xs text-[#6B7280]">Total cal</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#F3F4F6] p-3">
            <ChefHat className="h-4 w-4 text-green-400 mb-1" />
            <span className="text-sm font-semibold text-[#0A0A0A]">{formatCost(meal.totalCost)}</span>
            <span className="text-xs text-[#6B7280]">Est. cost</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#F3F4F6] p-3">
            <span className="text-base mb-1">🌾</span>
            <span className="text-sm font-semibold text-[#0A0A0A]">{meal.totalFibre}g</span>
            <span className="text-xs text-[#6B7280]">Fibre</span>
          </div>
        </div>

        {/* Macros */}
        <div className="mb-4 rounded-xl bg-[#F3F4F6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] mb-2">Total Macros</p>
          <MacroBar protein={meal.totalProtein} carbs={meal.totalCarbs} fat={meal.totalFat} className="mb-3" />
          <div className="flex justify-between text-sm">
            <span><span className="font-semibold text-blue-500">P</span> {meal.totalProtein}g</span>
            <span><span className="font-semibold text-amber-500">C</span> {meal.totalCarbs}g</span>
            <span><span className="font-semibold text-rose-400">F</span> {meal.totalFat}g</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Component sections */}
        {isBreakfast && meal.breakfastComponent && (
          <ComponentSection component={meal.breakfastComponent} sectionLabel="Breakfast" />
        )}
        {!isBreakfast && (
          <>
            {meal.protein && (
              <ComponentSection component={meal.protein} sectionLabel="Protein" />
            )}
            {meal.base && (
              <>
                <Separator className="my-4" />
                <ComponentSection component={meal.base} sectionLabel="Base" />
              </>
            )}
            {meal.vegetable && (
              <>
                <Separator className="my-4" />
                <ComponentSection component={meal.vegetable} sectionLabel="Vegetable" />
              </>
            )}
          </>
        )}

        <Separator className="my-4" />

        {/* Portions */}
        {members.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#6B7280] mb-3">Recommended Portions</p>
            <ul className="space-y-2">
              {members.map((member) => {
                const ratio = member.nutrition.calories / 1800;
                return (
                  <li key={member.id} className="flex items-center justify-between">
                    <span className="text-sm text-[#0A0A0A] flex items-center gap-1.5">
                      <span>{memberEmoji(member.gender, member.age)}</span>
                      <span>{member.name}</span>
                      {member.age <= 12 && (
                        <span className="text-[#6B7280] text-xs">({member.age})</span>
                      )}
                    </span>
                    <span className="text-sm text-[#6B7280]">{portionLabel(ratio)}</span>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-[#6B7280] mt-2 italic">
              Based on calorie needs relative to a standard adult portion
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
