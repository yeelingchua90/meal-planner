import { ComposedMeal, buildComposedMeal } from './recipes';
import {
  // Bases
  steamedWhiteRice, plainNoodles,
  friedRiceKids,
  // Breakfasts
  breadAndEggs, kayaToastEggs,
  // Proteins — household
  steamedFish, tofuMincedPork, chickenCurry,
  stirFryChickenThigh, steamedEggCustard, sweetSourChicken,
  // Proteins — Yeeling
  grilledChickenBreast, salmonFillet, scrambledEggsTofu,
  // Vegetables
  kaiLanOyster, spinachGarlic, mixedVeg, bakChoy,
  cabbageStirFry, cucumberSlices, steamedCorn,
} from './recipes';

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: 'mon', label: 'Monday',    short: 'Mon' },
  { key: 'tue', label: 'Tuesday',   short: 'Tue' },
  { key: 'wed', label: 'Wednesday', short: 'Wed' },
  { key: 'thu', label: 'Thursday',  short: 'Thu' },
  { key: 'fri', label: 'Friday',    short: 'Fri' },
  { key: 'sat', label: 'Saturday',  short: 'Sat' },
];

export interface DayPlan {
  breakfast: ComposedMeal;
  lunch: ComposedMeal;
  dinner: ComposedMeal;
  yeelingsLunch?: ComposedMeal; // Yeeling's separate 12pm meal
}

export const weekMealPlan: Record<DayKey, DayPlan> = {
  mon: {
    breakfast:    buildComposedMeal('mon-breakfast',      'breakfast', { breakfast: breadAndEggs }),
    lunch:        buildComposedMeal('mon-lunch',          'lunch',     { base: friedRiceKids }),
    dinner:       buildComposedMeal('mon-dinner',         'dinner',    { base: steamedWhiteRice, protein: stirFryChickenThigh, vegetable: kaiLanOyster }),
    yeelingsLunch: buildComposedMeal('mon-yeeling-lunch', 'lunch',     { protein: grilledChickenBreast, vegetable: kaiLanOyster }),
  },
  tue: {
    breakfast:    buildComposedMeal('tue-breakfast',      'breakfast', { breakfast: kayaToastEggs }),
    lunch:        buildComposedMeal('tue-lunch',          'lunch',     { base: plainNoodles }),
    dinner:       buildComposedMeal('tue-dinner',         'dinner',    { base: steamedWhiteRice, protein: tofuMincedPork, vegetable: steamedCorn }),
    yeelingsLunch: buildComposedMeal('tue-yeeling-lunch', 'lunch',     { protein: scrambledEggsTofu, vegetable: bakChoy }),
  },
  wed: {
    breakfast:    buildComposedMeal('wed-breakfast',      'breakfast', { breakfast: breadAndEggs }),
    lunch:        buildComposedMeal('wed-lunch',          'lunch',     { base: friedRiceKids }),
    dinner:       buildComposedMeal('wed-dinner',         'dinner',    { base: steamedWhiteRice, protein: steamedEggCustard, vegetable: cabbageStirFry }),
    yeelingsLunch: buildComposedMeal('wed-yeeling-lunch', 'lunch',     { protein: salmonFillet, vegetable: cucumberSlices }),
  },
  thu: {
    breakfast:    buildComposedMeal('thu-breakfast',      'breakfast', { breakfast: breadAndEggs }),
    lunch:        buildComposedMeal('thu-lunch',          'lunch',     { base: plainNoodles }),
    dinner:       buildComposedMeal('thu-dinner',         'dinner',    { base: steamedWhiteRice, protein: sweetSourChicken, vegetable: cucumberSlices }),
    yeelingsLunch: buildComposedMeal('thu-yeeling-lunch', 'lunch',     { protein: grilledChickenBreast, vegetable: spinachGarlic }),
  },
  fri: {
    breakfast:    buildComposedMeal('fri-breakfast',      'breakfast', { breakfast: kayaToastEggs }),
    lunch:        buildComposedMeal('fri-lunch',          'lunch',     { base: friedRiceKids }),
    dinner:       buildComposedMeal('fri-dinner',         'dinner',    { base: steamedWhiteRice, protein: steamedFish, vegetable: kaiLanOyster }),
    yeelingsLunch: buildComposedMeal('fri-yeeling-lunch', 'lunch',     { protein: scrambledEggsTofu, vegetable: spinachGarlic }),
  },
  sat: {
    breakfast:    buildComposedMeal('sat-breakfast',      'breakfast', { breakfast: kayaToastEggs }),
    lunch:        buildComposedMeal('sat-lunch',          'lunch',     { base: steamedWhiteRice, protein: stirFryChickenThigh, vegetable: cucumberSlices }),
    dinner:       buildComposedMeal('sat-dinner',         'dinner',    { base: steamedWhiteRice, protein: chickenCurry, vegetable: mixedVeg }),
    yeelingsLunch: buildComposedMeal('sat-yeeling-lunch', 'lunch',     { protein: salmonFillet, vegetable: bakChoy }),
  },
};

export const allComposedMeals: ComposedMeal[] = DAYS.flatMap(({ key }) => {
  const day = weekMealPlan[key as DayKey];
  const meals = [day.breakfast, day.lunch, day.dinner];
  if (day.yeelingsLunch) meals.push(day.yeelingsLunch);
  return meals;
});
