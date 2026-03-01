-- Run this in the Supabase SQL editor once:
-- https://supabase.com/dashboard/project/wxihikphybmpocqbiqtb/sql/new

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  store_type text not null check (store_type in ('ntuc', 'bakery', 'market', 'other')),
  store_name text,
  amount numeric(10,2) not null,
  purchased_at date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

alter table public.receipts enable row level security;

create policy "Allow all on receipts"
  on public.receipts for all
  using (true)
  with check (true);
