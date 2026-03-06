# MealPlanner — HANDOFF.md
*Last updated: 2026-03-05 by Freya*

## What this app is
Family meal planning app for Yeeling's sister's household in Singapore.
5 household members: Sister (adult F), Helper (adult F), Aleric (11M), Alexis (8M, wait — see kids section below), Axel (6M)
+ Yeeling (adult F, temporary ~6 months — separate lunch track)

Budget: $150/week household, $200 total including Yeeling.
Helper cooks everything. Goal: stop daily "what do you want?" → one plan → one batch shop.

## Repo
`~/Projects/meal-planner`
Vercel project: `meal-planner` (freya-lifeos org, projectId `prj_r7u9Zum0b0dNhIzvIu09xLgMIlxH`)
Tech: Next.js (App Router), TypeScript, Tailwind v4, Framer Motion, Supabase, shadcn/ui

## Git history (oldest → newest)
1. `94cca35` — initial scaffold
2. `de0f181` — household members + WHO nutrition targets + portioning
3. `0984ffb` — compositional meals (base + protein + veg)
4. `1e5ec34` — dual-layout meal view (compact/expanded), component detail drawer
5. `4ff957f` — Budget tab: receipt logging, store breakdown, planned shopping list
6. `89b99f4` — today-first plan, portions strip, realistic meal data, Yeeling lunch track
7. `a347b73` — Chef Alexis gamification: /chef, /critic, /adventurer, /parent + Supabase schema ← CURRENT

## App structure (routes)
- `/` — Weekly planner (main adult view)
- `/household` — Household members + nutrition targets
- `/shopping` — Budget tracker (receipt logging, spend vs $200/week)
- `/recipes` — EMPTY (route exists only)
- `/chef` — Chef Alexis: picks food cards for each day of week, submits weekly menu
- `/critic` — Critic Aleric: rates tonight's meal 1–5 stars after eating
- `/adventurer` — Adventurer Axel: hits "I TRIED IT!" to earn 10pts + sticker collection
- `/parent` — Parent overview: scoreboard, weekly menu, recent activity, manage food cards

## Layer 1: The Planner (`/`)
- 6-day plan Mon–Sat, defaults to today's day tab
- 4 meal tracks per day:
  - 🌅 Breakfast (household)
  - 🌿 Yeeling's Lunch (12pm) — high-protein, low-carb, helper preps separately
  - ☀️ Lunch (household kids, reheatable)
  - 🌙 Dinner (household — 1 protein + 1 veg + rice)
- Meal data in: `src/data/recipes.ts` (all MealComponent definitions) and `src/data/mealPlan.ts` (week assembly)
- Compact/expanded layout toggle
- Tap any card → ComponentDetailDrawer (ingredients, macros, instructions)
- Portions strip (collapsible, top 4 ingredients for 5 pax)
- Budget badge top-right (total week cost)

## Layer 2: Kid Gamification (`/chef`, etc.)
### The flow
1. **Alexis (Chef)** opens /chef → picks one food card per day (Mon–Sun, 7 days) from the food card library → submits
2. **Aleric (Critic)** opens /critic → rates tonight's meal 1–5 ⭐ → earns tier base points + challenge bonus
3. **Axel (Adventurer)** opens /adventurer → sees today's card → taps "I TRIED IT!" → confetti → earns 10pts flat
4. **Parent** opens /parent → sees points scoreboard, weekly menu, activity feed, can manage food cards

### Tier system
| Tier | Points | Color |
|------|--------|-------|
| Common | 5pt | Green |
| Rare | 15pt | Blue |
| Epic | 30pt | Purple |
| Legendary | 50pt | Amber/Gold |
| Challenge Card | +20 bonus | Ring highlight |

### Points logic (from `computePoints` in supabase.ts)
- clean_plate: base + challenge bonus
- half: base / 2
- tried: 10 (flat, regardless of tier) — Axel uses this
- skipped: 0

## Supabase tables
### Gamification
- `food_cards` — dish library (tier, emoji, base_points, is_challenge_card, is_active)
- `weekly_drafts` — Alexis's picks (week_start YYYY-MM-DD + day_of_week 0–6 → food_card_id). Unique on (week_start, day_of_week).
- `meal_records` — kid eating records (weekly_draft_id, kid_name, status, critic_rating, points_earned)
- `point_ledger` — running points (kid_name, amount, reason, meal_record_id)
### Household ops
- `members` — household members + nutrition targets
- `receipts` — grocery receipts (week_start, store_type, amount, purchased_at)

## Key files
- `src/data/recipes.ts` — all MealComponent definitions (ingredients, macros, cost, instructions)
- `src/data/mealPlan.ts` — weekMealPlan (6-day plan assembled from recipe components)
- `src/lib/supabase.ts` — all Supabase CRUD + TIER_META + computePoints
- `src/lib/utils.ts` — formatCost, DAY_NAMES, DAY_SHORTS, todayDayOfWeek
- `src/contexts/HouseholdContext.tsx` — household members context (Supabase-backed)
- `src/components/KidNav.tsx` — shared nav for /chef, /critic, /adventurer, /parent
- `src/components/BottomNav.tsx` — nav for main planner views

## What's NOT built yet
- Photo proof upload in Adventurer view (button placeholder exists)
- WhatsApp push to helper with weekly meal plan (Iteration 4)
- Recipes browser (/recipes — empty)
- Household member editing (Edit button exists but not wired)
- "Build a plate" UI — Yeeling wants to try this (discussed Mar 5 2026, not yet defined/built)

## Kids (IMPORTANT — names vs roles)
- **Alexis** = eldest (age unconfirmed but biggest, ~13 assumed) = Chef role
- **Aleric** = middle = Critic role  
- **Axel** = youngest (6) = Adventurer role
- NOTE: AGENT_TASK.md says Aleric=11, Alexis=8, Axel=6 — but Chef Alexis page treats Alexis as eldest chef. Treat HANDOFF as correct for app intent.

## Current state (Mar 5 2026)
- Iteration 3 shipped and committed (a347b73)
- Discussing "build a plate" feature — context unclear, not yet started
- Session was discussing what to replace with the plate UI — no decision made yet

## Next session: read this first, then check what Yeeling wants to build
