'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Recipe } from '@/data/recipes';
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
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
}

export function RecipeSheet({ recipe, open, onClose }: RecipeSheetProps) {
  const { members } = useHousehold();
  if (!recipe) return null;

  const totalTime = recipe.prepMins + recipe.cookMins;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-4 pb-8"
      >
        <SheetHeader className="mb-4 pt-2">
          <div className="text-5xl mb-2">{recipe.emoji}</div>
          <SheetTitle className="text-left text-xl font-bold text-[#0A0A0A]">
            {recipe.name}
          </SheetTitle>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary" className="bg-[#F3F4F6] text-[#374151] rounded-full">
              {recipe.cuisine}
            </Badge>
            <Badge variant="secondary" className="bg-[#F3F4F6] text-[#374151] rounded-full">
              {recipe.difficulty}
            </Badge>
            {recipe.kidFriendly && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 rounded-full">
                👶 Kid-friendly
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center rounded-xl bg-[#F3F4F6] p-3">
            <Flame className="h-4 w-4 text-orange-400 mb-1" />
            <span className="text-sm font-semibold text-[#0A0A0A]">{formatCalories(recipe.calories)}</span>
            <span className="text-xs text-[#6B7280]">Calories</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#F3F4F6] p-3">
            <Clock className="h-4 w-4 text-blue-400 mb-1" />
            <span className="text-sm font-semibold text-[#0A0A0A]">{formatTime(totalTime)}</span>
            <span className="text-xs text-[#6B7280]">Total time</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#F3F4F6] p-3">
            <ChefHat className="h-4 w-4 text-green-400 mb-1" />
            <span className="text-sm font-semibold text-[#0A0A0A]">{formatCost(recipe.totalCostSGD)}</span>
            <span className="text-xs text-[#6B7280]">Est. cost</span>
          </div>
        </div>

        {/* Macros */}
        <div className="mb-4 rounded-xl bg-[#F3F4F6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] mb-2">Macros</p>
          <MacroBar protein={recipe.protein} carbs={recipe.carbs} fat={recipe.fat} className="mb-3" />
          <div className="flex justify-between text-sm">
            <span><span className="font-semibold text-blue-500">P</span> {recipe.protein}g</span>
            <span><span className="font-semibold text-amber-500">C</span> {recipe.carbs}g</span>
            <span><span className="font-semibold text-rose-400">F</span> {recipe.fat}g</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Ingredients */}
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#6B7280] mb-3">Ingredients</p>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing) => (
              <li key={ing.name} className="flex items-center justify-between">
                <span className="text-sm text-[#0A0A0A]">{ing.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#6B7280]">{ing.quantity}</span>
                  <span className="text-xs text-[#6B7280]">{formatCost(ing.estimatedCostSGD)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-4" />

        {/* Portions */}
        {members.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#6B7280] mb-3">Recommended Portions</p>
            <ul className="space-y-2">
              {members.map((member) => {
                const ratio = member.nutrition.calories / 1800; // relative to a standard adult baseline
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

        <Separator className="my-4" />

        {/* Instructions */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#6B7280] mb-3">Instructions</p>
          <ol className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-[#0A0A0A]">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </SheetContent>
    </Sheet>
  );
}
