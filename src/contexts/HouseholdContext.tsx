'use client';

import { createContext, useContext, useMemo } from 'react';
import { Member } from '@/lib/supabase';
import { NutritionTargets, getNutritionTargets } from '@/data/nutritionReference';
import { householdSeed } from '@/data/householdSeed';

export interface MemberWithNutrition extends Omit<Member, 'id' | 'created_at'> {
  id: string;
  nutrition: NutritionTargets;
}

interface HouseholdContextValue {
  members: MemberWithNutrition[];
  loading: boolean;
}

const HouseholdContext = createContext<HouseholdContextValue>({
  members: [],
  loading: false,
});

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const members = useMemo<MemberWithNutrition[]>(() =>
    householdSeed.map((m, i) => ({
      ...m,
      id: String(i),
      nutrition: getNutritionTargets(m.age, m.gender, m.activity_level),
    })),
  []);

  return (
    <HouseholdContext.Provider value={{ members, loading: false }}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  return useContext(HouseholdContext);
}
