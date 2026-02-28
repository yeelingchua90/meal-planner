'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHousehold, MemberWithNutrition } from '@/contexts/HouseholdContext';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

function getMemberEmoji(member: MemberWithNutrition) {
  if (member.gender === 'M') return member.age <= 12 ? '👦' : '👨';
  return '👩';
}

function formatCalories(n: number) {
  return n.toLocaleString();
}

function activityLabel(level: string) {
  const map: Record<string, string> = {
    sedentary: 'Sedentary',
    light: 'Light activity',
    'light-moderate': 'Light–moderate activity',
    moderate: 'Moderate activity',
    active: 'Active',
  };
  return map[level] ?? level;
}

function MacroRing({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
  const total = protein + carbs + fat;
  const pPct = Math.round((protein / total) * 100);
  const cPct = Math.round((carbs / total) * 100);
  const fPct = 100 - pPct - cPct;

  return (
    <div className="flex items-center gap-3 mt-3">
      {/* Simple stacked bar */}
      <div className="flex-1 h-2.5 rounded-full overflow-hidden flex">
        <div className="bg-blue-400" style={{ width: `${pPct}%` }} />
        <div className="bg-amber-400" style={{ width: `${cPct}%` }} />
        <div className="bg-rose-400" style={{ width: `${fPct}%` }} />
      </div>
      <div className="flex gap-2 text-xs text-[#6B7280]">
        <span className="flex items-center gap-0.5"><span className="inline-block w-2 h-2 rounded-full bg-blue-400" />{pPct}%P</span>
        <span className="flex items-center gap-0.5"><span className="inline-block w-2 h-2 rounded-full bg-amber-400" />{cPct}%C</span>
        <span className="flex items-center gap-0.5"><span className="inline-block w-2 h-2 rounded-full bg-rose-400" />{fPct}%F</span>
      </div>
    </div>
  );
}

const NUTRIENT_EXPLAINERS = [
  { name: 'Calories', desc: 'Energy for the day — fuels everything from breathing to running around.' },
  { name: 'Protein', desc: 'Builds and repairs muscle — especially important for growing kids and active adults.' },
  { name: 'Carbohydrates', desc: 'Main energy source. Choose complex carbs (rice, oats, wholegrain) for sustained energy.' },
  { name: 'Fat', desc: 'Brain health and fat-soluble vitamins (A, D, E, K). Don\'t skip it — choose healthy fats.' },
  { name: 'Fibre', desc: 'Gut health and satiety. Keeps everyone full and digestion regular.' },
  { name: 'Calcium', desc: 'Bone and teeth strength — critical for kids aged 6–12 during peak growth.' },
  { name: 'Iron', desc: 'Carries oxygen in the blood. Especially important for Yeeling and Zann (pre-menopausal).' },
  { name: 'Vitamin C', desc: 'Immune support and helps absorb iron from plant foods.' },
];

export default function HouseholdPage() {
  const { members } = useHousehold();
  const [nutritionKeyOpen, setNutritionKeyOpen] = useState(false);

  const primary = members.find((m) => m.is_primary);
  const others = members.filter((m) => !m.is_primary);

  const totalCalories = members.reduce((s, m) => s + m.nutrition.calories, 0);
  const totalProtein = members.reduce((s, m) => s + m.nutrition.protein, 0);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Our Household</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {members.length} members · Nutrition targets personalised
          </p>
        </div>
        <button className="text-sm font-medium text-[#2563EB] border border-[#2563EB] rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors">
          Edit
        </button>
      </div>

      {/* Primary member card */}
      {primary && (
        <div className="rounded-2xl border border-[#2563EB] bg-white shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{getMemberEmoji(primary)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0A0A0A] text-lg">{primary.name}</span>
                  <span className="text-xs bg-[#F3F4F6] text-[#374151] rounded-full px-2 py-0.5">
                    {primary.age}F
                  </span>
                  <span className="text-xs bg-[#2563EB] text-white rounded-full px-2 py-0.5 font-medium">
                    Primary
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">{activityLabel(primary.activity_level)}</p>
              </div>
            </div>
          </div>

          {/* Daily targets pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs bg-orange-50 text-orange-700 rounded-full px-2.5 py-1 font-semibold">
              {formatCalories(primary.nutrition.calories)} kcal
            </span>
            <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-1 font-semibold">
              {primary.nutrition.protein}g protein
            </span>
            <span className="text-xs bg-green-50 text-green-700 rounded-full px-2.5 py-1 font-semibold">
              {primary.nutrition.fibre}g fibre
            </span>
            <span className="text-xs bg-purple-50 text-purple-700 rounded-full px-2.5 py-1 font-semibold">
              {primary.nutrition.calcium}mg calcium
            </span>
            <span className="text-xs bg-red-50 text-red-700 rounded-full px-2.5 py-1 font-semibold">
              {primary.nutrition.iron}mg iron
            </span>
          </div>

          {/* Macro bar */}
          <MacroRing
            protein={primary.nutrition.protein}
            carbs={primary.nutrition.carbs}
            fat={primary.nutrition.fat}
          />
        </div>
      )}

      {/* Other members grid */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B7280] mb-3">Household Members</h2>
        <div className="grid grid-cols-2 gap-3">
          {others.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-3"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xl">{getMemberEmoji(member)}</span>
                <span className="font-semibold text-[#0A0A0A] text-sm truncate">{member.name}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs bg-[#F3F4F6] text-[#374151] rounded-full px-1.5 py-0.5">
                  {member.age}{member.gender}
                </span>
                <span className="text-xs text-[#6B7280] truncate">{activityLabel(member.activity_level)}</span>
              </div>
              <p className="text-2xl font-bold text-[#0A0A0A]">{formatCalories(member.nutrition.calories)}</p>
              <p className="text-xs text-[#6B7280]">kcal / day</p>
              <div className="mt-1.5 flex gap-2 text-xs text-[#6B7280]">
                <span className="text-blue-600 font-medium">{member.nutrition.protein}g P</span>
                <span className="text-green-600 font-medium">{member.nutrition.fibre}g F</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Household Daily Total */}
      <div className="rounded-2xl bg-[#F3F4F6] p-4 space-y-1.5">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-[#2563EB]" />
          <span className="text-sm font-semibold text-[#0A0A0A]">Household Daily Total</span>
        </div>
        <p className="text-xl font-bold text-[#0A0A0A]">
          {formatCalories(totalCalories)} kcal · {totalProtein}g protein
        </p>
        <p className="text-xs text-[#6B7280]">Based on WHO/HPB reference values for age and activity level</p>
        <p className="text-xs text-[#6B7280] italic">Adjust portions for individual needs</p>
      </div>

      {/* Nutrition Key */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#0A0A0A] hover:bg-[#F9FAFB] transition-colors"
          onClick={() => setNutritionKeyOpen((v) => !v)}
        >
          <span>What these numbers mean</span>
          {nutritionKeyOpen ? (
            <ChevronUp className="h-4 w-4 text-[#6B7280]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#6B7280]" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {nutritionKeyOpen && (
            <motion.div
              key="nutrition-key"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3 border-t border-[#E5E7EB]">
                {NUTRIENT_EXPLAINERS.map((n) => (
                  <div key={n.name} className="mt-3">
                    <p className="text-xs font-semibold text-[#0A0A0A]">{n.name}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
