-- ============================================================
-- Chef Alexis Gamification Schema
-- Run this in the Supabase SQL editor (wxihikphybmpocqbiqtb)
-- ============================================================

-- Food cards: the pool of available dishes
create table food_cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  emoji text default '🍽️',
  tier text not null check (tier in ('common', 'rare', 'epic', 'legendary')),
  base_points integer not null,  -- common=5, rare=15, epic=30, legendary=50
  is_challenge_card boolean default false,  -- the secret "gold" card parent sets
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Weekly draft: Alexis picks 14 slots per week (lunch + dinner for each day)
-- day_of_week: 0-6 = Mon-Sun lunch, 7-13 = Mon-Sun dinner
create table weekly_drafts (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,  -- Monday of that week
  day_of_week integer not null check (day_of_week between 0 and 13),  -- 0-6=lunch Mon-Sun, 7-13=dinner Mon-Sun
  food_card_id uuid references food_cards(id),
  draft_order integer,  -- the order Alexis picked
  created_at timestamptz default now(),
  unique(week_start, day_of_week)
);

-- Meal records: proof of eating after each dinner
create table meal_records (
  id uuid primary key default gen_random_uuid(),
  weekly_draft_id uuid references weekly_drafts(id),
  kid_name text not null,  -- 'Alexis', 'Aleric', 'Axel'
  status text not null check (status in ('clean_plate', 'half', 'tried', 'skipped')),
  proof_photo_url text,
  critic_rating integer check (critic_rating between 1 and 5),  -- only for Aleric
  points_earned integer default 0,
  recorded_at timestamptz default now()
);

-- Point ledger: all point transactions
create table point_ledger (
  id uuid primary key default gen_random_uuid(),
  kid_name text not null,
  amount integer not null,
  reason text not null,
  meal_record_id uuid references meal_records(id),
  created_at timestamptz default now()
);

-- Badges
create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  emoji text not null,
  kid_role text check (kid_role in ('chef', 'critic', 'adventurer', 'all'))
);

create table kid_badges (
  id uuid primary key default gen_random_uuid(),
  kid_name text not null,
  badge_id uuid references badges(id),
  earned_at timestamptz default now()
);

-- ─── Seed Data ────────────────────────────────────────────────────────────────

-- Insert default food cards (Singapore family meals, kid-friendly)
insert into food_cards (name, description, emoji, tier, base_points) values
  ('Fried Rice', 'Classic egg fried rice', '🍳', 'common', 5),
  ('Scrambled Eggs', 'Soft scrambled eggs on toast', '🥚', 'common', 5),
  ('Chicken Rice', 'Steamed chicken with fragrant rice', '🍗', 'common', 5),
  ('Noodle Soup', 'Warm noodles in clear broth', '🍜', 'common', 5),
  ('Fish with Rice', 'Steamed fish over white rice', '🐟', 'rare', 15),
  ('Stir-fry Chicken', 'Chicken with veggies and sauce', '🥘', 'rare', 15),
  ('Sweet & Sour Pork', 'Classic sweet sour pork', '🍖', 'rare', 15),
  ('Broccoli Stir-fry', 'Garlic broccoli — crunchy!', '🥦', 'epic', 30),
  ('Tofu with Minced Pork', 'Soft tofu in savoury pork sauce', '🥄', 'epic', 30),
  ('Salmon Fillet', 'Pan-seared salmon with rice', '🐠', 'epic', 30),
  ('Curry Chicken', 'Rich coconut curry — adventurous!', '🍛', 'legendary', 50);

-- Insert default badges
insert into badges (name, description, emoji, kid_role) values
  ('Sous Chef', 'First draft completed!', '👨‍🍳', 'chef'),
  ('Head Chef', 'Earned 200+ points', '⭐', 'chef'),
  ('Legendary Chef', 'Ate a Legendary card', '🌟', 'chef'),
  ('Brave Pick', 'Chose an Epic or Legendary card', '💜', 'chef'),
  ('3-Week Streak', 'Picked Rare+ for 3 weeks in a row', '🔥', 'chef'),
  ('Top Critic', 'Rated 10 meals', '⭐', 'critic'),
  ('First Try', 'First I Tried It! sticker', '🎉', 'adventurer'),
  ('Adventurer', '5 new foods tried', '🌟', 'adventurer'),
  ('Team Player', 'Team bonus unlocked', '🏆', 'all');
