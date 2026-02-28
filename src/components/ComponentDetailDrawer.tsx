'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MealComponent } from '@/data/recipes';
import { formatTime } from '@/lib/utils';

interface ComponentDetailDrawerProps {
  component: MealComponent | null;
  isOpen: boolean;
  onClose: () => void;
}

const NUTRITION_CELLS = (c: MealComponent) => [
  { label: 'Calories', value: String(c.calories), unit: ' kcal' },
  { label: 'Protein',  value: String(c.protein),  unit: 'g' },
  { label: 'Carbs',    value: String(c.carbs),     unit: 'g' },
  { label: 'Fat',      value: String(c.fat),       unit: 'g' },
  { label: 'Fibre',    value: String(c.fibre),     unit: 'g' },
  { label: 'Cost',     value: `$${c.totalCostSGD.toFixed(2)}`, unit: '' },
  { label: 'Prep',     value: formatTime(c.prepMins), unit: '' },
  { label: 'Cook',     value: formatTime(c.cookMins), unit: '' },
];

export function ComponentDetailDrawer({ component, isOpen, onClose }: ComponentDetailDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && component && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[75vh] overflow-y-auto"
          >
            {/* Handle bar */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Content */}
            <div className="px-5 pb-10">
              {/* Hero */}
              <div className="text-center mb-5">
                <span className="text-5xl">{component.emoji}</span>
                <h2 className="text-xl font-bold mt-2 text-[#0A0A0A]">{component.name}</h2>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full capitalize">
                    {component.category}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                    {component.cuisine}
                  </span>
                  {component.kidFriendly && (
                    <span className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-full">
                      Kid-friendly
                    </span>
                  )}
                </div>
              </div>

              {/* Nutrition grid */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {NUTRITION_CELLS(component).map(({ label, value, unit }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-[#0A0A0A]">
                      {value}
                      <span className="text-xs font-normal text-gray-400">{unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              <h3 className="font-semibold text-sm mb-2 text-[#0A0A0A]">Ingredients</h3>
              <ul className="space-y-1.5 mb-5">
                {component.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between text-xs">
                    <span className="text-gray-700">{ing.name}</span>
                    <span className="text-gray-400 ml-2">{ing.quantity}</span>
                  </li>
                ))}
              </ul>

              {/* Instructions */}
              <h3 className="font-semibold text-sm mb-2 text-[#0A0A0A]">Instructions</h3>
              <ol className="space-y-2">
                {component.instructions.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-600">
                    <span className="text-[#2563EB] font-bold shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
