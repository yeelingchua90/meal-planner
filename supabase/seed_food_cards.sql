-- Seed food_cards table with ~25 real dishes
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

INSERT INTO food_cards (name, emoji, description, points, rarity, is_challenge_card, cuisine) VALUES

-- ╔══════════════════════════════════════╗
-- ║  LEGENDARY (50 pts)                  ║
-- ╚══════════════════════════════════════╝
(
  'Roast Chicken',
  '🍗',
  'A whole chicken roasted to golden perfection with herbs, garlic, and butter. The kind of Sunday dinner that fills the whole house with warmth.',
  50, 'legendary', false, 'Western'
),
(
  'Salmon Teriyaki',
  '🍣',
  'Glossy, caramelised salmon glazed with homemade teriyaki sauce. Requires patience and a hot pan — worth every second.',
  50, 'legendary', true, 'Japanese'
),
(
  'Fish & Chips',
  '🐟',
  'Crispy beer-battered fish with thick-cut chips and mushy peas. A proper British classic that takes skill to nail at home.',
  50, 'legendary', false, 'Western'
),
(
  'Beef Rendang',
  '🥩',
  'Slow-cooked dry beef curry simmered for hours in coconut milk and spices until deeply rich and almost black. A Malay masterpiece.',
  50, 'legendary', true, 'Malay'
),

-- ╔══════════════════════════════════════╗
-- ║  EPIC (30 pts)                       ║
-- ╚══════════════════════════════════════╝
(
  'Chicken Rice',
  '🍚',
  'Silky poached chicken served over fragrant rice cooked in chicken stock, with chilli sauce and dark soy. Singapore''s national dish.',
  30, 'epic', false, 'Chinese'
),
(
  'Laksa',
  '🍜',
  'Spicy coconut curry noodle soup with prawns, tofu puffs, and a rich, aromatic broth. Takes time but hits like nothing else.',
  30, 'epic', true, 'Peranakan'
),
(
  'Char Kway Teow',
  '🥘',
  'Flat rice noodles wok-fried over high heat with egg, bean sprouts, lap cheong, and dark soy. Wok hei is everything here.',
  30, 'epic', false, 'Chinese'
),
(
  'Prawn Noodles',
  '🍤',
  'Hae mee — rich prawn and pork rib broth ladled over yellow noodles. The broth takes hours; the reward is worth it.',
  30, 'epic', false, 'Chinese'
),
(
  'Curry Chicken',
  '🍛',
  'Tender chicken pieces simmered in a fragrant coconut curry with potatoes. Best served with roti prata to soak it all up.',
  30, 'epic', false, 'Indian'
),

-- ╔══════════════════════════════════════╗
-- ║  RARE (15 pts)                       ║
-- ╚══════════════════════════════════════╝
(
  'Fried Rice',
  '🍳',
  'Day-old rice tossed in a screaming-hot wok with egg, vegetables, and soy. Simple but requires good technique.',
  15, 'rare', false, 'Chinese'
),
(
  'Chicken Curry',
  '🍲',
  'A lighter, comforting curry with tender chicken and potatoes in a spiced tomato and onion base. Great for weeknights.',
  15, 'rare', false, 'Indian'
),
(
  'Stir-Fry Vegetables',
  '🥦',
  'Seasonal greens flash-fried with garlic, oyster sauce, and a splash of water. Fast, healthy, and deeply satisfying.',
  15, 'rare', false, 'Chinese'
),
(
  'Steamed Fish',
  '🐠',
  'Whole fish steamed over boiling water, finished with hot oil, ginger, spring onion, and soy. Delicate and clean.',
  15, 'rare', false, 'Chinese'
),
(
  'Mapo Tofu',
  '🌶️',
  'Silken tofu in a spicy, numbing Sichuan sauce with minced pork and doubanjiang. Bold, warming, and deeply satisfying.',
  15, 'rare', false, 'Chinese'
),
(
  'Aglio e Olio',
  '🍝',
  'Spaghetti tossed in golden garlic-infused olive oil with chilli flakes and parsley. Deceptively simple, dangerously good.',
  15, 'rare', false, 'Western'
),

-- ╔══════════════════════════════════════╗
-- ║  COMMON (5 pts)                      ║
-- ╚══════════════════════════════════════╝
(
  'Porridge',
  '🥣',
  'Slow-simmered rice congee — plain or with ginger and century egg. Warm, gentle, and endlessly comforting.',
  5, 'common', false, 'Chinese'
),
(
  'Scrambled Eggs',
  '🍳',
  'Soft, buttery scrambled eggs cooked low and slow. The benchmark of any cook''s fundamentals.',
  5, 'common', false, 'Western'
),
(
  'Toast with Kaya',
  '🍞',
  'Thick-cut bread toasted golden, spread with kaya coconut jam and cold butter. A Singapore breakfast classic.',
  5, 'common', false, 'Singaporean'
),
(
  'Simple Noodles',
  '🍜',
  'Instant or fresh noodles in a light broth or tossed with sesame oil and soy. Quick, filling, no-fuss.',
  5, 'common', false, 'Chinese'
),
(
  'Rice with Soy Sauce',
  '🍚',
  'Steamed white rice drizzled with dark soy sauce and sesame oil. Humble, honest, and hits the spot.',
  5, 'common', false, 'Chinese'
),
(
  'Avocado Toast',
  '🥑',
  'Mashed avocado on toasted sourdough with lemon, chilli flakes, and flaky salt. A reliable weekday staple.',
  5, 'common', false, 'Western'
),
(
  'Miso Soup',
  '🍵',
  'Dashi broth dissolved with miso paste, tofu, and wakame. A five-minute side that elevates any Japanese meal.',
  5, 'common', false, 'Japanese'
),
(
  'Overnight Oats',
  '🫙',
  'Rolled oats soaked overnight in milk with fruit and honey. Zero morning effort, maximum breakfast satisfaction.',
  5, 'common', false, 'Western'
),
(
  'Egg Fried Rice',
  '🍚',
  'Steamed rice stir-fried with beaten egg, spring onion, and light soy. The gateway dish to wok cooking.',
  5, 'common', false, 'Chinese'
);

-- Verify the insert
SELECT rarity, COUNT(*) as count, SUM(points) as total_points
FROM food_cards
GROUP BY rarity
ORDER BY MAX(points) DESC;
