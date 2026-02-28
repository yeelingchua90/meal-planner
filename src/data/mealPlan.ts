import { ComposedMeal, buildComposedMeal } from './recipes';
import {
  // Bases
  steamedWhiteRice, steamedBrownRice, plainBeehoon, plainNoodles,
  // Breakfasts
  breadAndEggs, kayaToastEggs,
  // Proteins
  steamedFish, sambalChicken, braisedPorkBelly, prawnOmelette,
  tofuMincedPork, sweetSourPork, chickenCurry, butterChicken,
  lemonHerbChicken, teriyakiChicken,
  // Vegetables
  kaiLanOyster, spinachGarlic, mixedVeg, bakChoy,
  cabbageStirFry, longBeans, cucumberTomato,
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
}

export const weekMealPlan: Record<DayKey, DayPlan> = {
  mon: {
    breakfast: buildComposedMeal('mon-breakfast', 'breakfast', { breakfast: breadAndEggs }),
    lunch:     buildComposedMeal('mon-lunch',     'lunch',     { base: steamedWhiteRice,  protein: steamedFish,       vegetable: kaiLanOyster   }),
    dinner:    buildComposedMeal('mon-dinner',    'dinner',    { base: steamedBrownRice,  protein: chickenCurry,      vegetable: mixedVeg       }),
  },
  tue: {
    breakfast: buildComposedMeal('tue-breakfast', 'breakfast', { breakfast: breadAndEggs }),
    lunch:     buildComposedMeal('tue-lunch',     'lunch',     { base: plainBeehoon,      protein: prawnOmelette,     vegetable: bakChoy        }),
    dinner:    buildComposedMeal('tue-dinner',    'dinner',    { base: steamedWhiteRice,  protein: braisedPorkBelly,  vegetable: spinachGarlic  }),
  },
  wed: {
    breakfast: buildComposedMeal('wed-breakfast', 'breakfast', { breakfast: breadAndEggs }),
    lunch:     buildComposedMeal('wed-lunch',     'lunch',     { base: steamedWhiteRice,  protein: tofuMincedPork,    vegetable: cabbageStirFry }),
    dinner:    buildComposedMeal('wed-dinner',    'dinner',    { base: steamedWhiteRice,  protein: lemonHerbChicken,  vegetable: mixedVeg       }),
  },
  thu: {
    breakfast: buildComposedMeal('thu-breakfast', 'breakfast', { breakfast: breadAndEggs }),
    lunch:     buildComposedMeal('thu-lunch',     'lunch',     { base: plainNoodles,      protein: teriyakiChicken,   vegetable: cucumberTomato }),
    dinner:    buildComposedMeal('thu-dinner',    'dinner',    { base: steamedWhiteRice,  protein: sweetSourPork,     vegetable: longBeans      }),
  },
  fri: {
    breakfast: buildComposedMeal('fri-breakfast', 'breakfast', { breakfast: breadAndEggs }),
    lunch:     buildComposedMeal('fri-lunch',     'lunch',     { base: steamedWhiteRice,  protein: butterChicken,     vegetable: bakChoy        }),
    dinner:    buildComposedMeal('fri-dinner',    'dinner',    { base: steamedWhiteRice,  protein: sambalChicken,     vegetable: kaiLanOyster   }),
  },
  sat: {
    breakfast: buildComposedMeal('sat-breakfast', 'breakfast', { breakfast: kayaToastEggs }),
    lunch:     buildComposedMeal('sat-lunch',     'lunch',     { base: steamedWhiteRice,  protein: steamedFish,       vegetable: spinachGarlic  }),
    dinner:    buildComposedMeal('sat-dinner',    'dinner',    { base: steamedBrownRice,  protein: tofuMincedPork,    vegetable: mixedVeg       }),
  },
};

export const allComposedMeals: ComposedMeal[] = DAYS.flatMap(({ key }) => {
  const day = weekMealPlan[key as DayKey];
  return [day.breakfast, day.lunch, day.dinner];
});
