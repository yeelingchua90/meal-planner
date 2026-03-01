# Agent Task — MealPlanner Iteration 2

## Repo
`/Users/lifeos/Projects/meal-planner`

## Context
Family meal planning app for Singapore household:
- 5 household members: Sister (adult F), Helper (adult F), Aleric (11M), Alexis (8M), Axel (6M)
- + Yeeling (adult F, temporary ~6 months — eats breakfast + dinner with household, has SEPARATE lunch at 12pm)
- Budget: $150/week household, $200 total including Yeeling
- Helper cooks all meals. Kids avoid vegetables. Helper tends to ask kids what they want daily → no plan → daily top-up trips → overspending.
- Goal: give helper a clear week plan with exact portions → one batch shop per week

## What to build — 3 focused changes

---

### 1. Default the Plan tab to TODAY

In `src/app/page.tsx`:

Currently `activeDay` defaults to `'mon'`. Change it to default to the current day of the week. The DAYS array covers Mon–Sat. Sunday defaults to 'sat'.

```typescript
function getTodayKey(): DayKey {
  const day = new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const map: Record<number, DayKey> = { 0:'sat', 1:'mon', 2:'tue', 3:'wed', 4:'thu', 5:'fri', 6:'sat' };
  return map[day];
}
// then: const [activeDay, setActiveDay] = useState<DayKey>(getTodayKey);
```

---

### 2. Add a "Portions for 5" strip to each meal card

In `src/components/MealSection.tsx`, below the existing summary row (kcal / cost), add a subtle collapsible "Portions for 5" strip showing the key ingredients scaled to household size.

The existing `meal.allIngredients` has ingredient quantities per recipe. Most recipes are written as full-dish quantities (for ~4–5 people). Display them as a compact horizontal scroll of chips:

```
🧺 For 5: Jasmine rice 400g · Chicken thighs 600g · Kai lan 1 bunch
```

Only show the first 4 ingredients. Make it a muted gray strip, not a dominant element.

Add a small tap-to-expand toggle: collapsed by default, tap "portions" to show.

Implementation: add a `showPortions` boolean state inside MealSection, toggle on tap, render the strip.

---

### 3. Revamp the meal plan data to reflect reality

**This is the biggest change.** Update `src/data/recipes.ts` and `src/data/mealPlan.ts` to reflect:

**Household meal principles:**
- Kids eat simple, familiar, kid-friendly food — no fancy proteins
- Proteins in priority order: chicken thighs > eggs > tofu > minced pork > occasional fish (1x/week max)
- NO pork belly, NO pan-fry beef, NO mutton (too expensive)
- Breakfast: simple — bread + eggs, or kaya toast, or simple congee. Bakery items (waffles/buns) are handled separately.
- Lunch (kids only, Mon–Fri): simple reheatable food — fried rice, noodles, or leftovers
- Dinner: 1 protein + 1 veg + rice. Keep it simple.
- Fruits: served after dinner. Not tracked in meals.

**Yeeling's track (separate lunch only):**
- High protein, low carb, vegetables
- Helper preps at 12pm while kids are at school
- Examples: Grilled chicken + stir-fried kai lan, Scrambled eggs + tofu + veg, Salmon fillet + cucumber salad

**Add these new recipe components to recipes.ts:**
```
// Proteins (cheap, kid-friendly)
- Stir-fry Chicken Thigh (chicken thighs, oyster sauce, garlic — very common)
- Egg Stir-fry / Scrambled Eggs (eggs only)
- Tofu with Minced Pork (silken tofu, minced pork, soy sauce)
- Steamed Egg Custard (eggs, chicken stock — kids love this)
- Simple Steamed Fish (once a week option, tilapia/threadfin)
- Sweet & Sour Chicken (chicken, bell pepper, pineapple — kids favourite)

// Veggies (hidden or mild, kids more likely to accept)
- Stir-fry Kai Lan (garlic, oyster sauce)
- Simple Corn + Carrot Soup (as side / hidden veg in soup)
- Steamed/boiled sweet corn (easy side)
- Cucumber slices (raw side, zero effort)

// Yeeling's lunches
- Grilled Chicken + Kai Lan (chicken breast, kai lan, garlic, minimal oil)
- Scrambled Eggs + Tofu (3 eggs, silken tofu, soy, sesame)
- Salmon Fillet + Cucumber (salmon, cucumber, lemon — protein-forward)
```

**Update weekMealPlan in mealPlan.ts:**
```
Mon: breakfast=breadAndEggs, lunch=friedRiceLeftovers(or simple noodles), dinner=stirFryChicken+kaiLan
Tue: breakfast=kayaToast, lunch=simpleNoodles, dinner=tofuMincedPork+sweetcorn
Wed: breakfast=breadAndEggs, lunch=friedRiceLeftovers, dinner=steamedEggCustard+cabbageStirFry
Thu: breakfast=breadAndEggs, lunch=simpleNoodles, dinner=sweetSourChicken+cucumberSlices
Fri: breakfast=kayaToast, lunch=friedRiceLeftovers, dinner=steamedFish+kaiLan (1x/week)
Sat: breakfast=kayaToastEggs (weekend treat), lunch=chickenRiceSimple, dinner=chickenCurry+roti(or rice)
```

For `Yeeling's lunches`, add them as a parallel track. Add a `yeelingsLunch` key to DayPlan:
```typescript
export interface DayPlan {
  breakfast: ComposedMeal;
  lunch: ComposedMeal;
  dinner: ComposedMeal;
  yeelingsLunch?: ComposedMeal; // Yeeling's separate 12pm meal
}
```

**In page.tsx**, add a "Yeeling's Lunch 🌿" section between Breakfast and Lunch when yeelingsLunch exists for the day. Style it distinctly — maybe a soft green/teal accent vs the standard blue — to visually separate it from the household meals. Label it: `🌿 Yeeling's Lunch (12pm)`.

---

## Implementation notes

- Keep all existing components working. Don't break anything.
- TypeScript must compile cleanly (`npx tsc --noEmit`)
- Don't use `console.log` in production components
- Recipe cost estimates should be realistic for NTUC Singapore 2026 prices
- Keep ingredient quantities realistic for 5 people

## When done

1. Run `npx tsc --noEmit` to check types
2. Run `npm run build` to verify build passes
3. Commit: `git add -A && git commit -m "feat: today-first plan, portions strip, realistic meal data + Yeeling lunch track"`
4. Push: `git push origin main`
5. Deploy: `npx vercel --prod --yes`

## Done signal
Post a summary of what was changed and the new production URL.
