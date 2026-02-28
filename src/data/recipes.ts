export interface Ingredient {
  name: string;
  quantity: string;
  category: string;
  estimatedCostSGD: number;
}

export interface MealComponent {
  id: string;
  name: string;
  emoji: string;
  category: 'base' | 'protein' | 'vegetable' | 'breakfast';
  cuisine: 'Chinese' | 'Malay' | 'Indian' | 'Western' | 'Japanese' | 'Thai' | 'Universal';
  ingredients: Ingredient[];
  totalCostSGD: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  prepMins: number;
  cookMins: number;
  difficulty: 'Easy' | 'Medium';
  kidFriendly: boolean;
  instructions: string[];
}

export interface ComposedMeal {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  breakfastComponent?: MealComponent;
  base?: MealComponent;
  protein?: MealComponent;
  vegetable?: MealComponent;
  name: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFibre: number;
  totalCost: number;
  cuisine: string;
  allIngredients: Ingredient[];
}

// ── BASES ────────────────────────────────────────────────────────────────────

export const steamedWhiteRice: MealComponent = {
  id: 'steamed-white-rice',
  name: 'Steamed White Rice',
  emoji: '🍚',
  category: 'base',
  cuisine: 'Universal',
  ingredients: [
    { name: 'Jasmine rice', quantity: '80g dry', category: 'Grains & Carbs', estimatedCostSGD: 0.20 },
    { name: 'Water', quantity: '150ml', category: 'Pantry & Sauces', estimatedCostSGD: 0.00 },
    { name: 'Salt', quantity: 'pinch', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Pandan leaf', quantity: '1 leaf', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 0.30,
  calories: 260,
  protein: 5,
  carbs: 57,
  fat: 1,
  fibre: 1,
  prepMins: 5,
  cookMins: 20,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Rinse rice until water runs clear.',
    'Add rice and water to pot in 1:1.5 ratio.',
    'Bring to boil, then reduce heat and simmer covered 15 min.',
    'Rest 5 min off heat before fluffing.',
  ],
};

export const steamedBrownRice: MealComponent = {
  id: 'steamed-brown-rice',
  name: 'Steamed Brown Rice',
  emoji: '🍚',
  category: 'base',
  cuisine: 'Universal',
  ingredients: [
    { name: 'Brown rice', quantity: '75g dry', category: 'Grains & Carbs', estimatedCostSGD: 0.30 },
    { name: 'Water', quantity: '160ml', category: 'Pantry & Sauces', estimatedCostSGD: 0.00 },
    { name: 'Salt', quantity: 'pinch', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Sesame oil', quantity: '¼ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 0.40,
  calories: 220,
  protein: 5,
  carbs: 46,
  fat: 2,
  fibre: 3,
  prepMins: 5,
  cookMins: 35,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Soak brown rice 30 min to reduce cooking time.',
    'Drain and add 1:2 water ratio.',
    'Bring to boil, reduce heat, simmer covered 30 min.',
    'Rest 10 min before serving.',
  ],
};

export const plainBeehoon: MealComponent = {
  id: 'plain-beehoon',
  name: 'Plain Bee Hoon',
  emoji: '🍜',
  category: 'base',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Dried bee hoon (rice vermicelli)', quantity: '80g', category: 'Grains & Carbs', estimatedCostSGD: 0.35 },
    { name: 'Sesame oil', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Salt', quantity: 'pinch', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Spring onion', quantity: '1 stalk', category: 'Vegetables', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 0.50,
  calories: 200,
  protein: 4,
  carbs: 42,
  fat: 1,
  fibre: 1,
  prepMins: 5,
  cookMins: 10,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Soak bee hoon in warm water 10 min until softened.',
    'Boil pot of water, blanch bee hoon 1 min.',
    'Drain and toss with sesame oil and salt.',
    'Garnish with sliced spring onion.',
  ],
};

export const plainNoodles: MealComponent = {
  id: 'plain-noodles',
  name: 'Plain Noodles',
  emoji: '🍝',
  category: 'base',
  cuisine: 'Universal',
  ingredients: [
    { name: 'Fresh yellow noodles or pasta', quantity: '120g', category: 'Grains & Carbs', estimatedCostSGD: 0.35 },
    { name: 'Sesame oil', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Soy sauce', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Spring onion', quantity: '1 stalk', category: 'Vegetables', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 0.50,
  calories: 220,
  protein: 7,
  carbs: 43,
  fat: 2,
  fibre: 2,
  prepMins: 5,
  cookMins: 10,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Boil salted water, add noodles and cook 3–5 min until al dente.',
    'Drain and rinse with cold water to stop cooking.',
    'Toss with sesame oil and a dash of soy sauce.',
  ],
};

export const wholemealBread: MealComponent = {
  id: 'wholemeal-bread',
  name: 'Wholemeal Bread (2 slices)',
  emoji: '🍞',
  category: 'base',
  cuisine: 'Western',
  ingredients: [
    { name: 'Wholemeal bread', quantity: '2 slices', category: 'Grains & Carbs', estimatedCostSGD: 0.35 },
    { name: 'Butter', quantity: '1 tsp', category: 'Dairy & Eggs', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 0.40,
  calories: 160,
  protein: 6,
  carbs: 30,
  fat: 2,
  fibre: 4,
  prepMins: 2,
  cookMins: 3,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Toast bread until golden.',
    'Spread with a thin layer of butter if desired.',
  ],
};

// ── BREAKFAST COMPONENTS ─────────────────────────────────────────────────────

export const kayaToastEggs: MealComponent = {
  id: 'kaya-toast-eggs',
  name: 'Kaya Toast & Soft Boiled Eggs',
  emoji: '🍳',
  category: 'breakfast',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'White bread', quantity: '2 slices', category: 'Grains & Carbs', estimatedCostSGD: 0.30 },
    { name: 'Kaya spread', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.50 },
    { name: 'Butter', quantity: '1 tsp', category: 'Dairy & Eggs', estimatedCostSGD: 0.10 },
    { name: 'Eggs', quantity: '2', category: 'Dairy & Eggs', estimatedCostSGD: 0.60 },
  ],
  totalCostSGD: 1.50,
  calories: 380,
  protein: 14,
  carbs: 42,
  fat: 16,
  fibre: 2,
  prepMins: 5,
  cookMins: 10,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Toast bread until golden brown.',
    'Spread kaya generously, top with butter.',
    'Boil eggs in simmering water 6 min for soft yolk.',
    'Crack eggs into a bowl, season with soy sauce and white pepper.',
  ],
};

export const breadAndEggs: MealComponent = {
  id: 'bread-and-eggs',
  name: 'Bread with Eggs',
  emoji: '🍳',
  category: 'breakfast',
  cuisine: 'Universal',
  ingredients: [
    { name: 'Wholemeal bread', quantity: '2 slices', category: 'Grains & Carbs', estimatedCostSGD: 0.35 },
    { name: 'Eggs', quantity: '2', category: 'Dairy & Eggs', estimatedCostSGD: 0.60 },
    { name: 'Butter', quantity: '½ tsp', category: 'Dairy & Eggs', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 2.00,
  calories: 320,
  protein: 16,
  carbs: 28,
  fat: 14,
  fibre: 3,
  prepMins: 5,
  cookMins: 8,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Toast bread until golden.',
    'Heat pan with a little butter over medium heat.',
    'Scramble or fry eggs to preference.',
    'Serve eggs on toast.',
  ],
};

export const nasiLemakSimple: MealComponent = {
  id: 'nasi-lemak-simple',
  name: 'Nasi Lemak',
  emoji: '🍛',
  category: 'breakfast',
  cuisine: 'Malay',
  ingredients: [
    { name: 'Coconut rice', quantity: '1 cup cooked', category: 'Grains & Carbs', estimatedCostSGD: 0.60 },
    { name: 'Sambal', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.50 },
    { name: 'Ikan bilis (dried anchovies)', quantity: '30g', category: 'Proteins', estimatedCostSGD: 0.80 },
    { name: 'Peanuts', quantity: '20g', category: 'Pantry & Sauces', estimatedCostSGD: 0.30 },
    { name: 'Egg', quantity: '1', category: 'Dairy & Eggs', estimatedCostSGD: 0.30 },
    { name: 'Cucumber', quantity: '3 slices', category: 'Vegetables', estimatedCostSGD: 0.20 },
    { name: 'Pandan leaf', quantity: '1 leaf', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Coconut milk', quantity: '50ml', category: 'Dairy & Eggs', estimatedCostSGD: 0.20 },
  ],
  totalCostSGD: 3.00,
  calories: 450,
  protein: 12,
  carbs: 58,
  fat: 18,
  fibre: 3,
  prepMins: 15,
  cookMins: 25,
  difficulty: 'Medium',
  kidFriendly: false,
  instructions: [
    'Cook rice with coconut milk, pandan leaf and salt.',
    'Fry ikan bilis and peanuts until crispy.',
    'Fry egg sunny side up.',
    'Assemble rice with sambal, ikan bilis, peanuts, egg and cucumber.',
  ],
};

export const rotiPrataDhal: MealComponent = {
  id: 'roti-prata-dhal',
  name: 'Roti Prata with Dhal',
  emoji: '🫓',
  category: 'breakfast',
  cuisine: 'Indian',
  ingredients: [
    { name: 'Frozen roti prata', quantity: '2 pieces', category: 'Grains & Carbs', estimatedCostSGD: 1.00 },
    { name: 'Dhal (lentil curry)', quantity: '150ml', category: 'Proteins', estimatedCostSGD: 0.80 },
    { name: 'Onion', quantity: '¼ onion', category: 'Vegetables', estimatedCostSGD: 0.20 },
    { name: 'Ghee', quantity: '1 tsp', category: 'Dairy & Eggs', estimatedCostSGD: 0.30 },
    { name: 'Curry leaves', quantity: 'a few', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Mustard seeds', quantity: '¼ tsp', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Turmeric powder', quantity: 'pinch', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Chilli', quantity: '1 small (optional)', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 2.80,
  calories: 420,
  protein: 12,
  carbs: 52,
  fat: 16,
  fibre: 5,
  prepMins: 5,
  cookMins: 15,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Cook frozen prata on a hot pan until golden and crispy on both sides.',
    'Simmer dhal with onion, turmeric, curry leaves and mustard seeds.',
    'Finish dhal with a drizzle of ghee.',
    'Serve prata with dhal on the side.',
  ],
};

export const overnightOats: MealComponent = {
  id: 'overnight-oats',
  name: 'Overnight Oats with Fruit',
  emoji: '🥣',
  category: 'breakfast',
  cuisine: 'Western',
  ingredients: [
    { name: 'Rolled oats', quantity: '60g', category: 'Grains & Carbs', estimatedCostSGD: 0.25 },
    { name: 'Milk or oat milk', quantity: '150ml', category: 'Dairy & Eggs', estimatedCostSGD: 0.35 },
    { name: 'Banana', quantity: '½', category: 'Vegetables', estimatedCostSGD: 0.25 },
    { name: 'Mixed berries', quantity: '30g', category: 'Vegetables', estimatedCostSGD: 0.20 },
    { name: 'Honey', quantity: '1 tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Chia seeds', quantity: '1 tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 1.20,
  calories: 310,
  protein: 10,
  carbs: 52,
  fat: 6,
  fibre: 6,
  prepMins: 5,
  cookMins: 0,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Mix oats, milk and chia seeds in a jar.',
    'Stir in honey.',
    'Refrigerate overnight (at least 6 hours).',
    'Top with fresh banana and berries before serving.',
  ],
};

export const congee: MealComponent = {
  id: 'congee',
  name: 'Congee with Century Egg',
  emoji: '🥣',
  category: 'breakfast',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Jasmine rice', quantity: '50g dry', category: 'Grains & Carbs', estimatedCostSGD: 0.15 },
    { name: 'Century egg', quantity: '1', category: 'Dairy & Eggs', estimatedCostSGD: 0.60 },
    { name: 'Salted egg yolk', quantity: '1', category: 'Dairy & Eggs', estimatedCostSGD: 0.40 },
    { name: 'Ginger', quantity: '3 slices', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Spring onion', quantity: '1 stalk', category: 'Vegetables', estimatedCostSGD: 0.05 },
    { name: 'Sesame oil', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'White pepper', quantity: 'pinch', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Chicken stock', quantity: '500ml', category: 'Pantry & Sauces', estimatedCostSGD: 0.60 },
  ],
  totalCostSGD: 2.50,
  calories: 280,
  protein: 11,
  carbs: 48,
  fat: 5,
  fibre: 2,
  prepMins: 5,
  cookMins: 35,
  difficulty: 'Easy',
  kidFriendly: false,
  instructions: [
    'Simmer rice in chicken stock 30 min, stirring occasionally, until thick and creamy.',
    'Quarter century egg and crumble salted egg yolk.',
    'Add ginger slices while cooking.',
    'Top with century egg, salted yolk, spring onion, sesame oil and white pepper.',
  ],
};

export const friedBeehoonBreakfast: MealComponent = {
  id: 'fried-beehoon-breakfast',
  name: 'Fried Bee Hoon',
  emoji: '🍜',
  category: 'breakfast',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Dried bee hoon', quantity: '80g', category: 'Grains & Carbs', estimatedCostSGD: 0.35 },
    { name: 'Egg', quantity: '1', category: 'Dairy & Eggs', estimatedCostSGD: 0.30 },
    { name: 'Cabbage', quantity: '60g shredded', category: 'Vegetables', estimatedCostSGD: 0.20 },
    { name: 'Carrot', quantity: '30g julienned', category: 'Vegetables', estimatedCostSGD: 0.10 },
    { name: 'Soy sauce', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Sesame oil', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Oil', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Garlic', quantity: '2 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 2.50,
  calories: 350,
  protein: 10,
  carbs: 55,
  fat: 10,
  fibre: 2,
  prepMins: 10,
  cookMins: 15,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Soak bee hoon in warm water 10 min, drain.',
    'Stir-fry garlic in oil, add egg and scramble.',
    'Add cabbage and carrot, fry 2 min.',
    'Add bee hoon, soy sauce and sesame oil. Toss 3 min on high heat.',
  ],
};

// ── PROTEINS ─────────────────────────────────────────────────────────────────

export const steamedFish: MealComponent = {
  id: 'steamed-fish',
  name: 'Steamed Fish with Ginger & Soy',
  emoji: '🐟',
  category: 'protein',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Fish fillet (snapper or tilapia)', quantity: '400g', category: 'Proteins', estimatedCostSGD: 2.50 },
    { name: 'Ginger', quantity: '3 slices', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Soy sauce', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Sesame oil', quantity: '1 tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Spring onion', quantity: '2 stalks', category: 'Vegetables', estimatedCostSGD: 0.10 },
    { name: 'Cooking oil', quantity: '1 tbsp (for pouring)', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
  ],
  totalCostSGD: 4.00,
  calories: 180,
  protein: 28,
  carbs: 3,
  fat: 6,
  fibre: 0,
  prepMins: 10,
  cookMins: 12,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Score fish with shallow cuts, rub with a pinch of salt.',
    'Place ginger slices on fish and steam over boiling water 10–12 min.',
    'Drain excess liquid, pour soy sauce and sesame oil over fish.',
    'Heat oil until smoking, pour over fish and spring onion to sizzle.',
  ],
};

export const sambalChicken: MealComponent = {
  id: 'sambal-chicken',
  name: 'Sambal Chicken',
  emoji: '🍗',
  category: 'protein',
  cuisine: 'Malay',
  ingredients: [
    { name: 'Chicken thigh', quantity: '350g', category: 'Proteins', estimatedCostSGD: 2.00 },
    { name: 'Sambal paste', quantity: '3 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.50 },
    { name: 'Onion', quantity: '1 medium', category: 'Vegetables', estimatedCostSGD: 0.30 },
    { name: 'Tomato', quantity: '1', category: 'Vegetables', estimatedCostSGD: 0.30 },
    { name: 'Oil', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.20 },
    { name: 'Sugar', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Salt', quantity: 'to taste', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Lime', quantity: '½', category: 'Vegetables', estimatedCostSGD: 0.10 },
  ],
  totalCostSGD: 3.50,
  calories: 280,
  protein: 32,
  carbs: 8,
  fat: 13,
  fibre: 2,
  prepMins: 10,
  cookMins: 20,
  difficulty: 'Medium',
  kidFriendly: false,
  instructions: [
    'Marinate chicken in ½ the sambal paste 15 min.',
    'Fry onion in oil until soft, add remaining sambal and fry 3 min.',
    'Add chicken and cook 15 min until cooked through.',
    'Add tomato, season with sugar and salt. Squeeze lime before serving.',
  ],
};

export const braisedPorkBelly: MealComponent = {
  id: 'braised-pork-belly',
  name: 'Braised Pork Belly',
  emoji: '🥩',
  category: 'protein',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Pork belly', quantity: '350g', category: 'Proteins', estimatedCostSGD: 2.80 },
    { name: 'Soy sauce', quantity: '3 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.20 },
    { name: 'Dark soy sauce', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Oyster sauce', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Sugar', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Garlic', quantity: '4 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Star anise', quantity: '2', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Cinnamon stick', quantity: '1 small', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
  ],
  totalCostSGD: 4.50,
  calories: 380,
  protein: 22,
  carbs: 10,
  fat: 28,
  fibre: 0,
  prepMins: 10,
  cookMins: 60,
  difficulty: 'Medium',
  kidFriendly: true,
  instructions: [
    'Blanch pork belly in boiling water 5 min, drain and cut into chunks.',
    'Fry garlic until fragrant, add pork and brown all sides.',
    'Add soy sauces, oyster sauce, sugar, star anise and cinnamon.',
    'Add water to cover, simmer 45–60 min until tender and sauce thickens.',
  ],
};

export const prawnOmelette: MealComponent = {
  id: 'prawn-omelette',
  name: 'Prawn Omelette',
  emoji: '🥚',
  category: 'protein',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Prawns', quantity: '150g peeled', category: 'Proteins', estimatedCostSGD: 2.50 },
    { name: 'Eggs', quantity: '3', category: 'Dairy & Eggs', estimatedCostSGD: 0.90 },
    { name: 'Spring onion', quantity: '2 stalks', category: 'Vegetables', estimatedCostSGD: 0.10 },
    { name: 'Soy sauce', quantity: '1 tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Sesame oil', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Oil', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.20 },
    { name: 'White pepper', quantity: 'pinch', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Salt', quantity: 'to taste', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 4.00,
  calories: 220,
  protein: 20,
  carbs: 4,
  fat: 14,
  fibre: 0,
  prepMins: 10,
  cookMins: 10,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Beat eggs with soy sauce, sesame oil and white pepper.',
    'Stir-fry prawns until pink, about 2 min. Remove.',
    'Pour egg mixture into hot oiled pan.',
    'Add prawns and spring onion, fold omelette when edges set.',
  ],
};

export const tofuMincedPork: MealComponent = {
  id: 'tofu-minced-pork',
  name: 'Tofu & Minced Pork',
  emoji: '🫘',
  category: 'protein',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Firm tofu', quantity: '300g', category: 'Proteins', estimatedCostSGD: 0.80 },
    { name: 'Minced pork', quantity: '150g', category: 'Proteins', estimatedCostSGD: 1.50 },
    { name: 'Soy sauce', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Oyster sauce', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Garlic', quantity: '3 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Ginger', quantity: '1 tsp minced', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Spring onion', quantity: '2 stalks', category: 'Vegetables', estimatedCostSGD: 0.10 },
    { name: 'Cornstarch', quantity: '1 tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 3.50,
  calories: 240,
  protein: 18,
  carbs: 6,
  fat: 14,
  fibre: 1,
  prepMins: 10,
  cookMins: 15,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Cut tofu into cubes, gently pan-fry until golden on edges.',
    'Fry garlic and ginger, add minced pork and cook until browned.',
    'Add tofu, soy sauce and oyster sauce. Toss gently.',
    'Thicken with cornstarch slurry. Top with spring onion.',
  ],
};

export const sweetSourPork: MealComponent = {
  id: 'sweet-sour-pork',
  name: 'Sweet & Sour Pork',
  emoji: '🍖',
  category: 'protein',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Pork shoulder', quantity: '300g', category: 'Proteins', estimatedCostSGD: 2.00 },
    { name: 'Pineapple chunks', quantity: '80g', category: 'Vegetables', estimatedCostSGD: 0.50 },
    { name: 'Bell pepper', quantity: '½', category: 'Vegetables', estimatedCostSGD: 0.40 },
    { name: 'Tomato ketchup', quantity: '3 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.20 },
    { name: 'Vinegar', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Sugar', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Cornstarch', quantity: '2 tbsp (for batter)', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Egg', quantity: '1', category: 'Dairy & Eggs', estimatedCostSGD: 0.30 },
    { name: 'Oil', quantity: 'for frying', category: 'Pantry & Sauces', estimatedCostSGD: 0.30 },
  ],
  totalCostSGD: 5.00,
  calories: 320,
  protein: 24,
  carbs: 22,
  fat: 14,
  fibre: 1,
  prepMins: 15,
  cookMins: 20,
  difficulty: 'Medium',
  kidFriendly: true,
  instructions: [
    'Cut pork into cubes, coat in egg and cornstarch batter.',
    'Deep-fry pork until golden. Drain on paper.',
    'Mix ketchup, vinegar and sugar for sauce. Simmer 2 min.',
    'Toss pork, pineapple and pepper in sauce. Serve immediately.',
  ],
};

export const chickenCurry: MealComponent = {
  id: 'chicken-curry',
  name: 'Chicken & Potato Curry',
  emoji: '🍛',
  category: 'protein',
  cuisine: 'Indian',
  ingredients: [
    { name: 'Chicken drumsticks', quantity: '4 pieces (~350g)', category: 'Proteins', estimatedCostSGD: 1.80 },
    { name: 'Potato', quantity: '2 medium', category: 'Vegetables', estimatedCostSGD: 0.40 },
    { name: 'Curry powder', quantity: '2 tbsp', category: 'Herbs & Spices', estimatedCostSGD: 0.20 },
    { name: 'Coconut milk', quantity: '200ml', category: 'Dairy & Eggs', estimatedCostSGD: 0.60 },
    { name: 'Onion', quantity: '1 large', category: 'Vegetables', estimatedCostSGD: 0.30 },
    { name: 'Garlic', quantity: '4 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Ginger', quantity: '1 inch piece', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Oil', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.20 },
    { name: 'Salt', quantity: 'to taste', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Curry leaves', quantity: 'a few', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 4.00,
  calories: 340,
  protein: 28,
  carbs: 20,
  fat: 16,
  fibre: 3,
  prepMins: 15,
  cookMins: 35,
  difficulty: 'Medium',
  kidFriendly: true,
  instructions: [
    'Blend onion, garlic and ginger into a paste.',
    'Fry paste with curry leaves in oil until fragrant, add curry powder.',
    'Add chicken, coat in spices and cook 5 min.',
    'Add potatoes, coconut milk and water. Simmer 30 min until tender.',
  ],
};

export const butterChicken: MealComponent = {
  id: 'butter-chicken',
  name: 'Butter Chicken',
  emoji: '🍛',
  category: 'protein',
  cuisine: 'Indian',
  ingredients: [
    { name: 'Chicken breast', quantity: '350g', category: 'Proteins', estimatedCostSGD: 1.80 },
    { name: 'Canned tomatoes', quantity: '200g', category: 'Vegetables', estimatedCostSGD: 0.60 },
    { name: 'Butter', quantity: '2 tbsp', category: 'Dairy & Eggs', estimatedCostSGD: 0.30 },
    { name: 'Cream', quantity: '50ml', category: 'Dairy & Eggs', estimatedCostSGD: 0.40 },
    { name: 'Garam masala', quantity: '1½ tsp', category: 'Herbs & Spices', estimatedCostSGD: 0.15 },
    { name: 'Ginger-garlic paste', quantity: '1 tbsp', category: 'Herbs & Spices', estimatedCostSGD: 0.15 },
    { name: 'Onion', quantity: '1 medium', category: 'Vegetables', estimatedCostSGD: 0.30 },
    { name: 'Yoghurt', quantity: '3 tbsp (marinade)', category: 'Dairy & Eggs', estimatedCostSGD: 0.20 },
    { name: 'Turmeric', quantity: '½ tsp', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 4.00,
  calories: 320,
  protein: 26,
  carbs: 12,
  fat: 18,
  fibre: 1,
  prepMins: 20,
  cookMins: 25,
  difficulty: 'Medium',
  kidFriendly: true,
  instructions: [
    'Marinate chicken in yoghurt, ginger-garlic, turmeric 30 min.',
    'Cook chicken in butter until slightly charred. Remove.',
    'Fry onion until golden, add tomatoes and garam masala. Simmer 10 min.',
    'Blend sauce smooth, add chicken back, stir in cream. Simmer 5 min.',
  ],
};

export const lemonHerbChicken: MealComponent = {
  id: 'lemon-herb-chicken',
  name: 'Lemon Herb Baked Chicken',
  emoji: '🍋',
  category: 'protein',
  cuisine: 'Western',
  ingredients: [
    { name: 'Chicken thigh (bone-in)', quantity: '400g (2 pieces)', category: 'Proteins', estimatedCostSGD: 2.00 },
    { name: 'Lemon', quantity: '1', category: 'Vegetables', estimatedCostSGD: 0.40 },
    { name: 'Garlic', quantity: '4 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Olive oil', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.30 },
    { name: 'Mixed herbs (rosemary, thyme)', quantity: '1 tsp each', category: 'Herbs & Spices', estimatedCostSGD: 0.20 },
    { name: 'Salt and black pepper', quantity: 'to taste', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Paprika', quantity: '½ tsp', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 3.50,
  calories: 260,
  protein: 34,
  carbs: 2,
  fat: 12,
  fibre: 0,
  prepMins: 10,
  cookMins: 35,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Mix olive oil, lemon juice, garlic, herbs and paprika.',
    'Coat chicken thoroughly, marinate 30 min if time allows.',
    'Bake at 200°C for 30–35 min until golden and juices run clear.',
    'Rest 5 min before serving with lemon wedges.',
  ],
};

export const teriyakiChicken: MealComponent = {
  id: 'teriyaki-chicken',
  name: 'Teriyaki Chicken',
  emoji: '🍱',
  category: 'protein',
  cuisine: 'Japanese',
  ingredients: [
    { name: 'Chicken thigh (boneless)', quantity: '350g', category: 'Proteins', estimatedCostSGD: 1.80 },
    { name: 'Soy sauce', quantity: '3 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.15 },
    { name: 'Mirin', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.30 },
    { name: 'Sake or rice wine', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.20 },
    { name: 'Sugar', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Oil', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Sesame seeds', quantity: '1 tsp', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Spring onion', quantity: '1 stalk', category: 'Vegetables', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 3.50,
  calories: 290,
  protein: 30,
  carbs: 14,
  fat: 12,
  fibre: 0,
  prepMins: 10,
  cookMins: 15,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Mix soy sauce, mirin, sake and sugar for teriyaki sauce.',
    'Pan-fry chicken skin-down in oil 5 min until golden.',
    'Flip, pour sauce over and cook 8–10 min, basting frequently.',
    'Slice and garnish with sesame seeds and spring onion.',
  ],
};

export const friedEgg: MealComponent = {
  id: 'fried-egg',
  name: 'Fried Egg (2)',
  emoji: '🍳',
  category: 'protein',
  cuisine: 'Universal',
  ingredients: [
    { name: 'Eggs', quantity: '2', category: 'Dairy & Eggs', estimatedCostSGD: 0.60 },
    { name: 'Oil', quantity: '1 tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Salt and pepper', quantity: 'to taste', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 0.60,
  calories: 140,
  protein: 12,
  carbs: 1,
  fat: 10,
  fibre: 0,
  prepMins: 2,
  cookMins: 5,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Heat oil in pan over medium heat.',
    'Crack eggs in, fry sunny side up or flip for over easy.',
    'Season with salt and pepper.',
  ],
};

// ── VEGETABLES ───────────────────────────────────────────────────────────────

export const kaiLanOyster: MealComponent = {
  id: 'kai-lan-oyster',
  name: 'Stir-Fry Kai Lan with Oyster Sauce',
  emoji: '🥬',
  category: 'vegetable',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Kai lan (Chinese broccoli)', quantity: '200g', category: 'Vegetables', estimatedCostSGD: 0.80 },
    { name: 'Oyster sauce', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.20 },
    { name: 'Garlic', quantity: '3 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Oil', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Sesame oil', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Water', quantity: '2 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.00 },
  ],
  totalCostSGD: 1.50,
  calories: 80,
  protein: 3,
  carbs: 8,
  fat: 4,
  fibre: 3,
  prepMins: 5,
  cookMins: 8,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Wash and trim kai lan, blanch in boiling water 2 min. Drain.',
    'Stir-fry garlic in oil until fragrant.',
    'Add kai lan, oyster sauce and water. Toss 2 min on high heat.',
    'Finish with sesame oil.',
  ],
};

export const spinachGarlic: MealComponent = {
  id: 'spinach-garlic',
  name: 'Spinach with Garlic',
  emoji: '🥬',
  category: 'vegetable',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Baby spinach', quantity: '200g', category: 'Vegetables', estimatedCostSGD: 0.80 },
    { name: 'Garlic', quantity: '4 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Oil', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Salt', quantity: 'to taste', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Oyster sauce', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
  ],
  totalCostSGD: 1.20,
  calories: 60,
  protein: 3,
  carbs: 6,
  fat: 3,
  fibre: 3,
  prepMins: 3,
  cookMins: 5,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Slice garlic thinly.',
    'Heat oil in wok until smoking, fry garlic until golden.',
    'Add spinach, toss quickly on high heat 1–2 min until wilted.',
    'Season with salt and a drizzle of oyster sauce.',
  ],
};

export const mixedVeg: MealComponent = {
  id: 'mixed-veg',
  name: 'Stir-Fry Mixed Vegetables',
  emoji: '🥦',
  category: 'vegetable',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Broccoli', quantity: '100g florets', category: 'Vegetables', estimatedCostSGD: 0.50 },
    { name: 'Carrot', quantity: '1 medium sliced', category: 'Vegetables', estimatedCostSGD: 0.20 },
    { name: 'Snow peas', quantity: '80g', category: 'Vegetables', estimatedCostSGD: 0.40 },
    { name: 'Garlic', quantity: '2 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Oyster sauce', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Oil', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Salt', quantity: 'to taste', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 1.50,
  calories: 90,
  protein: 3,
  carbs: 12,
  fat: 3,
  fibre: 4,
  prepMins: 8,
  cookMins: 8,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Blanch broccoli and carrot in salted boiling water 2 min. Drain.',
    'Stir-fry garlic in hot oil until fragrant.',
    'Add all vegetables and stir-fry 3 min on high heat.',
    'Season with oyster sauce and salt.',
  ],
};

export const tofuVeg: MealComponent = {
  id: 'tofu-veg',
  name: 'Silken Tofu with Veg',
  emoji: '🫘',
  category: 'vegetable',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Silken tofu', quantity: '250g', category: 'Proteins', estimatedCostSGD: 0.80 },
    { name: 'Mushrooms', quantity: '80g sliced', category: 'Vegetables', estimatedCostSGD: 0.40 },
    { name: 'Bok choy', quantity: '100g', category: 'Vegetables', estimatedCostSGD: 0.30 },
    { name: 'Soy sauce', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Sesame oil', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Ginger', quantity: '2 slices', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Oil', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
  ],
  totalCostSGD: 1.50,
  calories: 100,
  protein: 6,
  carbs: 8,
  fat: 5,
  fibre: 2,
  prepMins: 5,
  cookMins: 10,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Steam silken tofu gently 5 min.',
    'Stir-fry ginger and mushrooms in oil until soft.',
    'Add bok choy and toss 2 min.',
    'Pour vegetables over tofu, drizzle with soy sauce and sesame oil.',
  ],
};

export const cucumberTomato: MealComponent = {
  id: 'cucumber-tomato',
  name: 'Cucumber & Tomato Salad',
  emoji: '🥒',
  category: 'vegetable',
  cuisine: 'Universal',
  ingredients: [
    { name: 'Cucumber', quantity: '1 medium', category: 'Vegetables', estimatedCostSGD: 0.40 },
    { name: 'Cherry tomatoes', quantity: '10 pieces', category: 'Vegetables', estimatedCostSGD: 0.50 },
    { name: 'Rice vinegar', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Sesame oil', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Salt', quantity: 'pinch', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
    { name: 'Sugar', quantity: 'pinch', category: 'Pantry & Sauces', estimatedCostSGD: 0.02 },
  ],
  totalCostSGD: 0.80,
  calories: 40,
  protein: 1,
  carbs: 8,
  fat: 0,
  fibre: 2,
  prepMins: 5,
  cookMins: 0,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Slice cucumber and halve tomatoes.',
    'Toss with rice vinegar, sesame oil, salt and a pinch of sugar.',
    'Let sit 5 min before serving so flavours meld.',
  ],
};

export const cabbageStirFry: MealComponent = {
  id: 'cabbage-stir-fry',
  name: 'Stir-Fry Cabbage',
  emoji: '🥬',
  category: 'vegetable',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Cabbage', quantity: '250g shredded', category: 'Vegetables', estimatedCostSGD: 0.50 },
    { name: 'Garlic', quantity: '3 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Dried shrimp', quantity: '1 tbsp (optional)', category: 'Proteins', estimatedCostSGD: 0.20 },
    { name: 'Soy sauce', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Oil', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Salt', quantity: 'to taste', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 1.00,
  calories: 70,
  protein: 2,
  carbs: 9,
  fat: 3,
  fibre: 3,
  prepMins: 5,
  cookMins: 8,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Shred cabbage finely.',
    'Fry garlic and dried shrimp in hot oil until fragrant.',
    'Add cabbage and toss on high heat 3–4 min.',
    'Season with soy sauce and salt.',
  ],
};

export const longBeans: MealComponent = {
  id: 'long-beans',
  name: 'Stir-Fry Long Beans',
  emoji: '🫘',
  category: 'vegetable',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Long beans', quantity: '200g cut into 5cm pieces', category: 'Vegetables', estimatedCostSGD: 0.60 },
    { name: 'Garlic', quantity: '3 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Dried shrimp paste (belacan)', quantity: '½ tsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Oil', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Soy sauce', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.05 },
    { name: 'Chilli', quantity: '1 small (optional)', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 1.20,
  calories: 75,
  protein: 3,
  carbs: 10,
  fat: 3,
  fibre: 4,
  prepMins: 5,
  cookMins: 10,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Trim and cut long beans into 5cm pieces.',
    'Stir-fry garlic and belacan in oil until fragrant.',
    'Add long beans, fry on high heat 5–6 min until tender-crisp.',
    'Season with soy sauce. Add chilli for adults.',
  ],
};

export const bakChoy: MealComponent = {
  id: 'bak-choy',
  name: 'Stir-Fry Bak Choy',
  emoji: '🥬',
  category: 'vegetable',
  cuisine: 'Chinese',
  ingredients: [
    { name: 'Baby bak choy', quantity: '300g halved', category: 'Vegetables', estimatedCostSGD: 0.70 },
    { name: 'Garlic', quantity: '3 cloves', category: 'Herbs & Spices', estimatedCostSGD: 0.10 },
    { name: 'Oyster sauce', quantity: '1.5 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.15 },
    { name: 'Oil', quantity: '1 tbsp', category: 'Pantry & Sauces', estimatedCostSGD: 0.10 },
    { name: 'Salt', quantity: 'to taste', category: 'Herbs & Spices', estimatedCostSGD: 0.05 },
  ],
  totalCostSGD: 1.20,
  calories: 55,
  protein: 3,
  carbs: 7,
  fat: 2,
  fibre: 3,
  prepMins: 3,
  cookMins: 6,
  difficulty: 'Easy',
  kidFriendly: true,
  instructions: [
    'Halve bak choy lengthwise, rinse well.',
    'Blanch in salted boiling water 1 min. Drain.',
    'Stir-fry garlic in oil until golden.',
    'Add bak choy and oyster sauce. Toss 2 min. Serve immediately.',
  ],
};

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildComposedMeal(
  id: string,
  mealType: 'breakfast' | 'lunch' | 'dinner',
  components: {
    breakfast?: MealComponent;
    base?: MealComponent;
    protein?: MealComponent;
    vegetable?: MealComponent;
  }
): ComposedMeal {
  const parts = [
    components.breakfast,
    components.base,
    components.protein,
    components.vegetable,
  ].filter(Boolean) as MealComponent[];

  const name =
    mealType === 'breakfast'
      ? (components.breakfast?.name ?? '')
      : [components.base?.name, components.protein?.name, components.vegetable?.name]
          .filter(Boolean)
          .join(' · ');

  return {
    id,
    mealType,
    breakfastComponent: components.breakfast,
    base: components.base,
    protein: components.protein,
    vegetable: components.vegetable,
    name,
    totalCalories: parts.reduce((sum, p) => sum + p.calories, 0),
    totalProtein: parts.reduce((sum, p) => sum + p.protein, 0),
    totalCarbs: parts.reduce((sum, p) => sum + p.carbs, 0),
    totalFat: parts.reduce((sum, p) => sum + p.fat, 0),
    totalFibre: parts.reduce((sum, p) => sum + p.fibre, 0),
    totalCost: parts.reduce((sum, p) => sum + p.totalCostSGD, 0),
    cuisine: components.protein?.cuisine ?? components.breakfast?.cuisine ?? components.base?.cuisine ?? 'Universal',
    allIngredients: parts.flatMap((p) => p.ingredients),
  };
}
