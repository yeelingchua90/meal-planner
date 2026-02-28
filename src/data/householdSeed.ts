import { Member } from '@/lib/supabase';

export const householdSeed: Omit<Member, 'id' | 'created_at'>[] = [
  { name: 'Yeeling', age: 35, gender: 'F', activity_level: 'light',    is_primary: true,  sort_order: 0 },
  { name: 'Zann',    age: 40, gender: 'F', activity_level: 'light',    is_primary: false, sort_order: 1 },
  { name: 'Maria',   age: 41, gender: 'F', activity_level: 'light',    is_primary: false, sort_order: 2 },
  { name: 'Aleric',  age: 11, gender: 'M', activity_level: 'moderate', is_primary: false, sort_order: 3 },
  { name: 'Alexis',  age: 7,  gender: 'M', activity_level: 'moderate', is_primary: false, sort_order: 4 },
  { name: 'Axel',    age: 6,  gender: 'M', activity_level: 'moderate', is_primary: false, sort_order: 5 },
  { name: 'Marcus',  age: 43, gender: 'M', activity_level: 'light',    is_primary: false, sort_order: 6 },
];
