import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
-- Members table SQL (run in Supabase SQL editor)
create table members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer not null,
  gender text not null check (gender in ('M','F')),
  activity_level text not null check (activity_level in ('sedentary','light','moderate','active')),
  is_primary boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);
*/

export interface Member {
  id?: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active';
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
}

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('is_primary', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertMember(member: Member): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .upsert(member)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMember(id: string): Promise<void> {
  const { error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
}

// ─── Receipts ────────────────────────────────────────────────────────────────

/*
-- Run this SQL once in Supabase SQL editor to create the receipts table.
-- See supabase/migrations/002_receipts.sql
*/

export type StoreType = 'ntuc' | 'bakery' | 'market' | 'other';

export const STORE_META: Record<StoreType, { label: string; bg: string; text: string }> = {
  ntuc:    { label: 'NTUC',    bg: 'bg-blue-100',   text: 'text-blue-700'   },
  bakery:  { label: 'Bakery',  bg: 'bg-amber-100',  text: 'text-amber-700'  },
  market:  { label: 'Market',  bg: 'bg-green-100',  text: 'text-green-700'  },
  other:   { label: 'Other',   bg: 'bg-gray-100',   text: 'text-gray-600'   },
};

export interface Receipt {
  id?: string;
  week_start: string;      // YYYY-MM-DD (Monday of that week)
  store_type: StoreType;
  store_name?: string;
  amount: number;
  purchased_at: string;    // YYYY-MM-DD
  notes?: string;
  created_at?: string;
}

/** Returns the Monday of the week containing `date` as YYYY-MM-DD */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

/** Returns YYYY-MM-DD for today in local time */
export function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function getReceipts(weekStart: string): Promise<Receipt[]> {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('week_start', weekStart)
    .order('purchased_at', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addReceipt(receipt: Omit<Receipt, 'id' | 'created_at'>): Promise<Receipt> {
  const { data, error } = await supabase
    .from('receipts')
    .insert(receipt)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteReceipt(id: string): Promise<void> {
  const { error } = await supabase.from('receipts').delete().eq('id', id);
  if (error) throw error;
}

// ─── Chef Alexis Gamification ────────────────────────────────────────────────

export type Tier = 'common' | 'rare' | 'epic' | 'legendary';

export const TIER_META: Record<Tier, { label: string; points: number; color: string; border: string; emoji: string }> = {
  common:    { label: 'Common',    points: 5,  color: 'bg-gray-100',   border: 'border-gray-400',   emoji: '⚪' },
  rare:      { label: 'Rare',      points: 15, color: 'bg-blue-100',   border: 'border-blue-500',   emoji: '🔵' },
  epic:      { label: 'Epic',      points: 30, color: 'bg-purple-100', border: 'border-purple-600', emoji: '🟣' },
  legendary: { label: 'Legendary', points: 50, color: 'bg-amber-100',  border: 'border-amber-500',  emoji: '⭐' },
};

export interface FoodCard {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  tier: Tier;
  base_points: number;
  is_challenge_card: boolean;
  is_active: boolean;
}

export interface WeeklyDraft {
  id: string;
  week_start: string;
  day_of_week: number;
  food_card_id: string;
  food_card?: FoodCard;
}

export type MealStatus = 'clean_plate' | 'half' | 'tried' | 'skipped';

export interface MealRecord {
  id: string;
  weekly_draft_id: string;
  kid_name: string;
  status: MealStatus;
  proof_photo_url?: string;
  critic_rating?: number;
  points_earned: number;
  recorded_at: string;
}

export interface PointLedger {
  id: string;
  kid_name: string;
  amount: number;
  reason: string;
  created_at: string;
}

export async function getFoodCards(): Promise<FoodCard[]> {
  const { data, error } = await supabase
    .from('food_cards')
    .select('*')
    .eq('is_active', true)
    .order('tier', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAllFoodCards(): Promise<FoodCard[]> {
  const { data, error } = await supabase
    .from('food_cards')
    .select('*')
    .order('tier', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function toggleFoodCardActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('food_cards')
    .update({ is_active: isActive })
    .eq('id', id);
  if (error) throw error;
}

export async function createFoodCard(card: { name: string; emoji: string; tier: Tier; description?: string }): Promise<FoodCard> {
  const base_points = { common: 5, rare: 15, epic: 30, legendary: 50 }[card.tier];
  const { data, error } = await supabase
    .from('food_cards')
    .insert({ ...card, base_points, is_active: true, is_challenge_card: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addFoodCard(card: Omit<FoodCard, 'id' | 'is_active'>): Promise<FoodCard> {
  const { data, error } = await supabase
    .from('food_cards')
    .insert({ ...card, is_active: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setChallengeCard(cardId: string): Promise<void> {
  // Clear existing challenge flag, then set the new one
  await supabase.from('food_cards').update({ is_challenge_card: false }).eq('is_challenge_card', true);
  const { error } = await supabase.from('food_cards').update({ is_challenge_card: true }).eq('id', cardId);
  if (error) throw error;
}

export async function getWeeklyDraft(weekStart: string): Promise<WeeklyDraft[]> {
  const { data, error } = await supabase
    .from('weekly_drafts')
    .select('*, food_card:food_cards(*)')
    .eq('week_start', weekStart)
    .order('day_of_week', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function saveDraftPick(weekStart: string, dayOfWeek: number, foodCardId: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_drafts')
    .upsert({ week_start: weekStart, day_of_week: dayOfWeek, food_card_id: foodCardId }, { onConflict: 'week_start,day_of_week' });
  if (error) throw error;
}

export async function getMealRecords(weeklyDraftId: string): Promise<MealRecord[]> {
  const { data, error } = await supabase
    .from('meal_records')
    .select('*')
    .eq('weekly_draft_id', weeklyDraftId);
  if (error) throw error;
  return data ?? [];
}

type RawMealRecord = MealRecord & {
  weekly_draft?: { food_card?: FoodCard } | null;
};

function flattenMealRecord(r: RawMealRecord): MealRecord & { food_card?: FoodCard } {
  const { weekly_draft, ...rest } = r;
  return { ...rest, food_card: weekly_draft?.food_card };
}

export async function getKidMealHistory(kidName: string, limit = 5): Promise<(MealRecord & { food_card?: FoodCard })[]> {
  const { data, error } = await supabase
    .from('meal_records')
    .select('*, weekly_draft:weekly_drafts(*, food_card:food_cards(*))')
    .eq('kid_name', kidName)
    .order('recorded_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? [] as RawMealRecord[]).map(flattenMealRecord);
}

export async function getRecentMealActivity(limit = 10): Promise<(MealRecord & { food_card?: FoodCard })[]> {
  const { data, error } = await supabase
    .from('meal_records')
    .select('*, weekly_draft:weekly_drafts(*, food_card:food_cards(*))')
    .order('recorded_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? [] as RawMealRecord[]).map(flattenMealRecord);
}

export async function recordMeal(record: Omit<MealRecord, 'id' | 'recorded_at'>): Promise<MealRecord> {
  const { data, error } = await supabase
    .from('meal_records')
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getKidPoints(kidName: string): Promise<number> {
  const { data, error } = await supabase
    .from('point_ledger')
    .select('amount')
    .eq('kid_name', kidName);
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => sum + row.amount, 0);
}

export async function addPoints(kidName: string, amount: number, reason: string, mealRecordId?: string): Promise<void> {
  const { error } = await supabase
    .from('point_ledger')
    .insert({ kid_name: kidName, amount, reason, meal_record_id: mealRecordId ?? null });
  if (error) throw error;
}

export function computePoints(status: MealStatus, tier: Tier, isChallenge: boolean): number {
  const base = TIER_META[tier].points;
  if (status === 'skipped') return 0;
  if (status === 'tried') return 10;
  if (status === 'half') return Math.floor(base / 2);
  // clean_plate
  const challenge = isChallenge ? 20 : 0;
  return base + challenge;
}
