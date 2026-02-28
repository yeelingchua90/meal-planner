export interface NutritionTargets {
  calories: number;
  protein: number;   // grams
  carbs: number;     // grams
  fat: number;       // grams
  fibre: number;     // grams
  calcium: number;   // mg
  iron: number;      // mg
  vitaminC: number;  // mg
}

export function getNutritionTargets(
  age: number,
  gender: 'M' | 'F',
  activityLevel: string
): NutritionTargets {
  // Children
  if (age <= 6) {
    return { calories: 1500, protein: 20, carbs: 200, fat: 50, fibre: 18, calcium: 600, iron: 6, vitaminC: 30 };
  }
  if (age <= 9) {
    return { calories: 1700, protein: 25, carbs: 225, fat: 57, fibre: 20, calcium: 700, iron: 8, vitaminC: 35 };
  }
  if (age <= 12) {
    if (gender === 'M') {
      return { calories: 2000, protein: 35, carbs: 260, fat: 67, fibre: 23, calcium: 1000, iron: 8, vitaminC: 40 };
    }
    return { calories: 1900, protein: 34, carbs: 245, fat: 63, fibre: 23, calcium: 1000, iron: 8, vitaminC: 40 };
  }

  // Adults — resolve calorie target by activity level
  let calories: number;
  if (gender === 'F') {
    const map: Record<string, number> = {
      sedentary: 1600,
      light: 1800,
      'light-moderate': 1900,
      moderate: 2000,
      active: 2200,
    };
    calories = map[activityLevel] ?? 1800;
  } else {
    const map: Record<string, number> = {
      sedentary: 2000,
      light: 2200,
      'light-moderate': 2300,
      moderate: 2400,
      active: 2600,
    };
    calories = map[activityLevel] ?? 2200;
  }

  const protein = gender === 'F' ? 55 : 65;
  const carbs = Math.round((calories * 0.5) / 4);   // 50% of calories / 4 kcal per gram
  const fat = Math.round((calories * 0.3) / 9);     // 30% of calories / 9 kcal per gram
  const fibre = gender === 'F' ? 25 : 26;
  const calcium = 800;
  const iron = gender === 'F' ? 18 : 11;
  const vitaminC = 45;

  return { calories, protein, carbs, fat, fibre, calcium, iron, vitaminC };
}
