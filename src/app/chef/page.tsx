'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KidNav } from '@/components/KidNav';
import {
  getFoodCards,
  getWeeklyDraft,
  saveDraftPick,
  addPoints,
  FoodCard,
  TIER_META,
  Tier,
} from '@/lib/supabase';
import { getWeekStart } from '@/lib/supabase';
import { todayDayOfWeek, DAY_NAMES } from '@/lib/utils';

// Lunch stored as day_of_week (0–6), Dinner as day_of_week + 7 (7–13)

const TIER_ORDER: Tier[] = ['legendary', 'epic', 'rare', 'common'];

// Tier visuals tuned for a 13-year-old — bold, distinct
const TIER_BG: Record<Tier, string> = {
  common:    'bg-gray-100 border-gray-300',
  rare:      'bg-blue-50 border-blue-400',
  epic:      'bg-purple-50 border-purple-500',
  legendary: 'bg-amber-50 border-amber-500',
};
const TIER_GLOW: Record<Tier, string> = {
  common:    '',
  rare:      'shadow-blue-200',
  epic:      'shadow-purple-200',
  legendary: 'shadow-amber-200',
};
const TIER_HEADER_COLOR: Record<Tier, string> = {
  common:    'text-gray-500',
  rare:      'text-blue-600',
  epic:      'text-purple-600',
  legendary: 'text-amber-600',
};

const CONFETTI_EMOJIS = ['🎉', '⭐', '🌟', '✨', '🎊', '🔥', '💫', '🎈'];

function SlotConfetti({ count }: { count: number }) {
  return (
    <>
      {CONFETTI_EMOJIS.slice(0, count).map((emoji, i) => {
        const angle = (i / count) * 360;
        const dist = 60 + Math.random() * 40;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={`${i}-${emoji}`}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, scale: 1.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.03 }}
            className="absolute text-xl pointer-events-none select-none z-20"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {emoji}
          </motion.div>
        );
      })}
    </>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const m = TIER_META[tier];
  const textColor = TIER_HEADER_COLOR[tier];
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-black px-2 py-0.5 rounded-full ${TIER_BG[tier]} border ${textColor}`}>
      {m.emoji} {m.label}
    </span>
  );
}

function SlotCard({
  label,
  emoji,
  card,
  isActive,
  submitted,
  justFilled,
  onClick,
}: {
  label: string;
  emoji: string;
  card: FoodCard | null;
  isActive: boolean;
  submitted: boolean;
  justFilled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={submitted}
      className={`relative flex-1 rounded-2xl border-2 p-4 text-left transition-all ${
        isActive
          ? 'border-[#F5B731] bg-amber-50 shadow-lg shadow-amber-100'
          : card
          ? `${TIER_BG[card.tier]} shadow-md ${TIER_GLOW[card.tier]}`
          : 'border-dashed border-[#D1D5DB] bg-white'
      }`}
    >
      <AnimatePresence>{justFilled && <SlotConfetti count={8} />}</AnimatePresence>
      <p className="text-xs font-black text-[#6B7280] uppercase tracking-widest mb-2">
        {emoji} {label}
      </p>
      {card ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <p className="text-4xl mb-1">{card.emoji}</p>
          <p className="font-black text-[#1a1a1a] text-sm leading-tight">{card.name}</p>
          <div className="mt-2 flex items-center gap-2">
            <TierBadge tier={card.tier} />
            <span className="text-xs font-black text-[#2D8B6E]">{card.base_points} pts</span>
          </div>
        </motion.div>
      ) : (
        <div className="pt-1">
          <p className="text-3xl mb-1">🍽️</p>
          <p className="text-sm text-[#9CA3AF] font-semibold">
            {isActive ? 'Pick below ↓' : 'Tap to pick'}
          </p>
        </div>
      )}
    </motion.button>
  );
}

export default function ChefPage() {
  const today = todayDayOfWeek();
  const weekStart = getWeekStart();

  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [activeSlot, setActiveSlot] = useState<'lunch' | 'dinner' | null>(null);
  const [lunchCard, setLunchCard] = useState<FoodCard | null>(null);
  const [dinnerCard, setDinnerCard] = useState<FoodCard | null>(null);
  const [justFilledSlot, setJustFilledSlot] = useState<'lunch' | 'dinner' | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPoints = (lunchCard?.base_points ?? 0) + (dinnerCard?.base_points ?? 0);
  const bothPicked = lunchCard !== null && dinnerCard !== null;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cards, drafts] = await Promise.all([
        getFoodCards(),
        getWeeklyDraft(weekStart),
      ]);
      setFoodCards(cards);
      const lunchDraft = drafts.find(d => d.day_of_week === today);
      const dinnerDraft = drafts.find(d => d.day_of_week === today + 7);
      if (lunchDraft?.food_card) setLunchCard(lunchDraft.food_card);
      if (dinnerDraft?.food_card) setDinnerCard(dinnerDraft.food_card);
      if (lunchDraft && dinnerDraft) setSubmitted(true);
    } catch {
      setError('Could not load data. Make sure the Supabase schema is set up.');
    } finally {
      setLoading(false);
    }
  }, [weekStart, today]);

  useEffect(() => { loadData(); }, [loadData]);

  function handleSlotTap(slot: 'lunch' | 'dinner') {
    if (submitted) return;
    setActiveSlot(prev => prev === slot ? null : slot);
  }

  function handleCardPick(card: FoodCard) {
    if (!activeSlot || submitted) return;
    if (activeSlot === 'lunch') setLunchCard(card);
    else setDinnerCard(card);
    setJustFilledSlot(activeSlot);
    setTimeout(() => setJustFilledSlot(null), 800);
    setActiveSlot(null);
  }

  async function handleSubmit() {
    if (!bothPicked || saving || submitted) return;
    setSaving(true);
    try {
      await Promise.all([
        saveDraftPick(weekStart, today, lunchCard!.id),
        saveDraftPick(weekStart, today + 7, dinnerCard!.id),
      ]);
      await addPoints(
        'Alexis',
        totalPoints,
        `Planned ${DAY_NAMES[today]}: ${lunchCard!.name} + ${dinnerCard!.name}`
      );
      setCelebrating(true);
      setTimeout(() => {
        setCelebrating(false);
        setSubmitted(true);
      }, 2500);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const groupedCards = TIER_ORDER.reduce<Record<Tier, FoodCard[]>>(
    (acc, tier) => {
      acc[tier] = foodCards.filter(c => c.tier === tier);
      return acc;
    },
    { legendary: [], epic: [], rare: [], common: [] }
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <KidNav />

      <div className="px-4 py-5 space-y-4">
        {/* Header */}
        <div className="text-center">
          <motion.p
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            className="text-5xl mb-1"
          >
            👨‍🍳
          </motion.p>
          <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Sous Chef Alexis</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">{DAY_NAMES[today]} — build your menu!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Two meal slots */}
        <div className="flex gap-3">
          <SlotCard
            label="Lunch"
            emoji="☀️"
            card={lunchCard}
            isActive={activeSlot === 'lunch'}
            submitted={submitted}
            justFilled={justFilledSlot === 'lunch'}
            onClick={() => handleSlotTap('lunch')}
          />
          <SlotCard
            label="Dinner"
            emoji="🌙"
            card={dinnerCard}
            isActive={activeSlot === 'dinner'}
            submitted={submitted}
            justFilled={justFilledSlot === 'dinner'}
            onClick={() => handleSlotTap('dinner')}
          />
        </div>

        {/* Points preview + submit */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-[#6B7280] font-semibold uppercase tracking-wide">Points you&apos;ll earn</p>
              <motion.p
                key={totalPoints}
                initial={{ scale: 1.3, color: '#2D8B6E' }}
                animate={{ scale: 1, color: '#2D8B6E' }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-black text-[#2D8B6E]"
              >
                {totalPoints > 0 ? `+${totalPoints}` : '—'} pts
              </motion.p>
            </div>
            <div className="text-right text-xs text-[#9CA3AF] space-y-0.5">
              {lunchCard && <p>☀️ {lunchCard.base_points}pt · {lunchCard.name}</p>}
              {dinnerCard && <p>🌙 {dinnerCard.base_points}pt · {dinnerCard.name}</p>}
            </div>
          </div>
          {!submitted ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleSubmit}
              disabled={!bothPicked || saving}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                bothPicked
                  ? 'bg-[#F5B731] text-[#1a1a1a] shadow-lg shadow-amber-200 hover:bg-[#e0a82e]'
                  : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
              }`}
            >
              {saving ? 'Saving…' : bothPicked ? '✓ Lock in my menu!' : 'Pick both meals first'}
            </motion.button>
          ) : (
            <div className="bg-green-50 border-2 border-green-400 rounded-2xl py-3 text-center">
              <p className="font-black text-green-800">Menu locked in! 🎉</p>
              <p className="text-sm text-green-600">+{totalPoints} pts earned today</p>
            </div>
          )}
        </div>

        {/* Active slot hint */}
        <AnimatePresence>
          {activeSlot && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center py-2 bg-amber-50 border border-amber-200 rounded-2xl"
            >
              <p className="text-sm font-black text-amber-700">
                {activeSlot === 'lunch' ? '☀️' : '🌙'} Picking {activeSlot} — tap a card below
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Food card grid */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-5 pb-8">
            {TIER_ORDER.map(tier => {
              const cards = groupedCards[tier];
              if (!cards.length) return null;
              const m = TIER_META[tier];
              return (
                <div key={tier}>
                  <div className={`flex items-center gap-2 mb-3 ${TIER_HEADER_COLOR[tier]}`}>
                    <span className="text-lg">{m.emoji}</span>
                    <h3 className="font-black uppercase tracking-widest text-sm">{m.label}</h3>
                    <span className="text-xs opacity-70">· {m.points} pts each</span>
                    {tier === 'legendary' && (
                      <span className="ml-auto text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">RARE FIND</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {cards.map(card => {
                      const isSelected = lunchCard?.id === card.id || dinnerCard?.id === card.id;
                      return (
                        <motion.button
                          key={card.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleCardPick(card)}
                          disabled={!activeSlot || submitted}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${TIER_BG[tier]} ${
                            isSelected ? 'ring-2 ring-[#2D8B6E] ring-offset-2' : ''
                          } ${card.is_challenge_card ? 'ring-2 ring-[#F5B731] ring-offset-1' : ''} ${
                            activeSlot && !submitted ? 'cursor-pointer hover:shadow-lg hover:scale-[1.01]' : 'opacity-80 cursor-default'
                          }`}
                        >
                          <span className="text-4xl flex-shrink-0">{card.emoji}</span>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-[#1a1a1a]">{card.name}</span>
                              {card.is_challenge_card && (
                                <span className="text-xs font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">✨ Challenge</span>
                              )}
                              {isSelected && (
                                <span className="text-xs font-black text-[#2D8B6E] bg-green-50 px-1.5 py-0.5 rounded-full">✓ Picked</span>
                              )}
                            </div>
                            {card.description && (
                              <p className="text-xs text-[#6B7280] mt-0.5">{card.description}</p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <TierBadge tier={card.tier} />
                            <p className="text-sm font-black text-[#2D8B6E] mt-1">{card.base_points} pts</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
          >
            {/* Full-screen confetti */}
            {Array.from({ length: 24 }).map((_, i) => {
              const emoji = CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length];
              const startX = Math.random() * 100;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, x: `${startX}vw`, y: '-10vh', rotate: 0, scale: Math.random() * 0.8 + 0.6 }}
                  animate={{ opacity: 0, y: '110vh', rotate: Math.random() * 720 - 360 }}
                  transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.8, ease: 'easeIn' }}
                  className="fixed text-2xl pointer-events-none"
                  style={{ left: 0, top: 0 }}
                >
                  {emoji}
                </motion.div>
              );
            })}

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="text-center px-8 relative z-10"
            >
              <motion.p
                animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-7xl mb-4"
              >
                🏆
              </motion.p>
              <h2 className="text-4xl font-black text-white mb-2">Menu locked in!</h2>
              <p className="text-lg text-blue-200">Great call, Sous Chef Alexis!</p>
              <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: [0.5, 1.3, 1] }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-5xl font-black text-[#F5B731] mt-6"
              >
                +{totalPoints} pts
              </motion.p>
              <div className="flex justify-center gap-3 mt-4">
                {lunchCard && (
                  <div className="bg-white/10 rounded-2xl px-4 py-2 text-center">
                    <p className="text-2xl">{lunchCard.emoji}</p>
                    <p className="text-xs text-white/70 mt-1">{lunchCard.name}</p>
                  </div>
                )}
                {dinnerCard && (
                  <div className="bg-white/10 rounded-2xl px-4 py-2 text-center">
                    <p className="text-2xl">{dinnerCard.emoji}</p>
                    <p className="text-xs text-white/70 mt-1">{dinnerCard.name}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
