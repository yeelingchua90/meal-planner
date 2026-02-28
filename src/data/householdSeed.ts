import { Member } from '@/lib/supabase';

export const householdSeed: Omit<Member, 'id' | 'created_at'>[] = [
  { name: 'Yeeling', age: 35, gender: 'F', activity_level: 'light', is_primary: true,  sort_order: 0 },
  { name: 'Sister',  age: 40, gender: 'F', activity_level: 'light', is_primary: false, sort_order: 1 },
  { name: 'Helper',  age: 35, gender: 'F', activity_level: 'light', is_primary: false, sort_order: 2 },
  { name: 'Boy 1',   age: 11, gender: 'M', activity_level: 'moderate', is_primary: false, sort_order: 3 },
  { name: 'Boy 2',   age: 8,  gender: 'M', activity_level: 'moderate', is_primary: false, sort_order: 4 },
  { name: 'Boy 3',   age: 6,  gender: 'M', activity_level: 'moderate', is_primary: false, sort_order: 5 },
];
