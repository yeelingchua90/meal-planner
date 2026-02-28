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
