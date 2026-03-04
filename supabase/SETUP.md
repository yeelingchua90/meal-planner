# Chef Alexis Gamification — Setup Guide

## Step 1: Run the SQL schema

1. Go to the Supabase dashboard for project `wxihikphybmpocqbiqtb`
2. Open the **SQL Editor**
3. Copy and paste the contents of `supabase/chef_alexis_schema.sql`
4. Click **Run**

This creates the following tables (with seed data):
- `food_cards` — the pool of dishes Alexis picks from (11 pre-loaded)
- `weekly_drafts` — Alexis's weekly menu picks (one per day slot)
- `meal_records` — eating records for all three kids post-dinner
- `point_ledger` — all point transactions
- `badges` + `kid_badges` — badge catalogue and earned badges

---

## Step 2: Pages overview

| Route | Who uses it | What it does |
|-------|-------------|--------------|
| `/chef` | Alexis (8) | Sunday draft — pick one food card per day of the week |
| `/critic` | Aleric (11) | Post-dinner star rating + next-week suggestion |
| `/adventurer` | Axel (6) | "I Tried It!" big button + sticker collection |
| `/parent` | Marcus / Zann | Week overview, points scoreboard, manage food cards |

---

## End-to-end flow

1. **Sunday** — Alexis opens `/chef`, picks a food card for each day Mon–Sun. Each pick is saved immediately via upsert. When all 7 are picked, he hits "Submit Menu ✓" and sees a celebration screen.

2. **Weekdays (dinner time)** — Parents open the relevant kid page:
   - **Aleric** rates the meal 1–5 stars on `/critic`. His rating is saved to `meal_records`.
   - **Axel** taps "I TRIED IT! 🎉" on `/adventurer`. Confetti flies, sticker added, points awarded.
   - Alexis's eating record (clean plate / half / skipped) is recorded through `/parent`.

3. **Points** — Every eating action writes to `point_ledger`. Points are computed by `computePoints(status, tier, isChallenge)`:
   - Skipped: 0 pts
   - Tried: 10 pts flat
   - Half: base_points ÷ 2
   - Clean plate: base_points (+ 20 bonus if challenge card)

4. **Parent dashboard** (`/parent`) — shows the week's menu grid, live point totals for all three kids, recent activity feed, and a form to add new food cards or mark a card as the challenge card.

---

## Photo upload note

The "Take Photo" button in meal records is a placeholder. Actual photo upload to Supabase Storage is not yet implemented — the `proof_photo_url` column is ready when you're ready to wire it up.
