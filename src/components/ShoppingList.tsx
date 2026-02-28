'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Ingredient, recipes } from '@/data/recipes';
import { weekMealPlan, DayKey, DAYS } from '@/data/mealPlan';
import { formatCost } from '@/lib/utils';

interface AggregatedItem {
  name: string;
  category: string;
  quantities: string[];
  totalCost: number;
}

function aggregateIngredients(): AggregatedItem[] {
  const map = new Map<string, AggregatedItem>();

  const allRecipeIds = DAYS.flatMap(({ key }) => {
    const day = weekMealPlan[key as DayKey];
    return [day.breakfastId, day.lunchId, day.dinnerId];
  });

  for (const id of allRecipeIds) {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const existing = map.get(ing.name);
      if (existing) {
        existing.quantities.push(ing.quantity);
        existing.totalCost += ing.estimatedCostSGD;
      } else {
        map.set(ing.name, {
          name: ing.name,
          category: ing.category,
          quantities: [ing.quantity],
          totalCost: ing.estimatedCostSGD,
        });
      }
    }
  }

  return Array.from(map.values());
}

const CATEGORY_ORDER = [
  'Proteins',
  'Vegetables',
  'Grains & Carbs',
  'Pantry & Sauces',
  'Dairy & Eggs',
  'Herbs & Spices',
];

interface ShoppingListProps {
  budget: number;
}

export function ShoppingList({ budget }: ShoppingListProps) {
  const items = aggregateIngredients();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const grouped = CATEGORY_ORDER.reduce<Record<string, AggregatedItem[]>>(
    (acc, cat) => {
      acc[cat] = items.filter((i) => i.category === cat);
      return acc;
    },
    {}
  );

  const total = items.reduce((s, i) => s + i.totalCost, 0);
  const checkedTotal = items
    .filter((i) => checked.has(i.name))
    .reduce((s, i) => s + i.totalCost, 0);

  return (
    <div className="space-y-6 pb-4">
      {CATEGORY_ORDER.map((cat) => {
        const catItems = grouped[cat];
        if (!catItems || catItems.length === 0) return null;
        return (
          <div key={cat}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
              {cat}
            </p>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
              {catItems.map((item, idx) => {
                const isChecked = checked.has(item.name);
                return (
                  <div key={item.name}>
                    {idx > 0 && <Separator />}
                    <motion.button
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      onClick={() => toggle(item.name)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          isChecked
                            ? 'border-[#22C55E] bg-[#22C55E]'
                            : 'border-[#E5E7EB]'
                        }`}
                      >
                        {isChecked && (
                          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium transition-colors ${
                            isChecked
                              ? 'text-[#6B7280] line-through'
                              : 'text-[#0A0A0A]'
                          }`}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {item.quantities.join(' + ')}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium transition-colors ${
                          isChecked ? 'text-[#6B7280]' : 'text-[#2563EB]'
                        }`}
                      >
                        {formatCost(item.totalCost)}
                      </span>
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Running total */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="flex justify-between text-sm text-[#6B7280]">
          <span>Items checked</span>
          <span>{formatCost(checkedTotal)}</span>
        </div>
        <div className="mt-2 flex justify-between font-bold text-[#0A0A0A]">
          <span>Total (all items)</span>
          <span className={total > budget ? 'text-red-500' : 'text-[#0A0A0A]'}>
            {formatCost(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
