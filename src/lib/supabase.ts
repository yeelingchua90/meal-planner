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
