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

function TierBadge({ tier }: { tier: Tier }) {
  const m = TIER_META[tier];
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${m.color} border ${m.border}`}>
      {m.emoji} {m.label}
    </span>
  );
}

function SlotButton({
  label,
  emoji,
  card,
  isActive,
  submitted,
  onClick,
}: {
  label: string;
  emoji: string;
  card: FoodCard | null;
  isActive: boolean;
  submitted: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={submitted}
      className={`flex-1 rounded-2xl border-2 p-3 text-left transition-all ${
        isActive
          ? 'border-[#F5B731] bg-amber-50 shadow-md'
          : card
          ? `bg-white ${TIER_META[card.tier].border}`
          : 'border-dashed border-[#D1D5DB] bg-white'
      }`}
    >
      <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">
        {emoji} {label}
      </p>
      {card ? (
        <>
          <p className="text-2xl mb-1">{card.emoji}</p>
          <p className="font-bold text-[#1a1a1a] text-sm leading-tight truncate">{card.name}</p>
          <div className="mt-1.5">
            <TierBadge tier={card.tier} />
          </div>
          <p className="text-xs font-black text-[#2D8B6E] mt-1">{card.base_points} pts</p>
        </>
      ) : (
        <p className="text-sm text-[#9CA3AF] font-medium mt-2">
          {isActive ? 'Tap a card below ↓' : 'Tap to pick'}
        </p>
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
      }, 2000);
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
          <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">
            👨‍🍳 Sous Chef Alexis
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {DAY_NAMES[today]} — pick lunch & dinner
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Two meal slots */}
        <div className="flex gap-3">
          <SlotButton
            label="Lunch"
            emoji="☀️"
            card={lunchCard}
            isActive={activeSlot === 'lunch'}
            submitted={submitted}
            onClick={() => handleSlotTap('lunch')}
          />
          <SlotButton
            label="Dinner"
            emoji="🌙"
            card={dinnerCard}
            isActive={activeSlot === 'dinner'}
            submitted={submitted}
            onClick={() => handleSlotTap('dinner')}
          />
        </div>

        {/* Points + Submit row */}
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] px-4 py-2.5 min-w-[100px]">
            <p className="text-xs text-[#6B7280]">Points potential</p>
            <p className="text-xl font-black text-[#2D8B6E]">{totalPoints} pts</p>
          </div>
          {!submitted ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleSubmit}
              disabled={!bothPicked || saving}
              className={`flex-1 py-3.5 rounded-2xl font-black text-base transition-all ${
                bothPicked
                  ? 'bg-[#F5B731] text-[#1a1a1a] shadow-md shadow-amber-200 hover:bg-[#e0a82e]'
                  : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
              }`}
            >
              {saving ? 'Saving…' : bothPicked ? 'Submit! ✓' : 'Pick both meals'}
            </motion.button>
          ) : (
            <div className="flex-1 bg-green-50 border-2 border-green-400 rounded-2xl py-3 text-center">
              <p className="font-black text-green-800 text-sm">Menu saved! 🎉</p>
              <p className="text-xs text-green-600">+{totalPoints} pts earned</p>
            </div>
          )}
        </div>

        {/* Active slot hint */}
        <AnimatePresence>
          {activeSlot && !submitted && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center text-sm font-semibold text-[#F5B731]"
            >
              Picking for {activeSlot} — tap a card below
            </motion.p>
          )}
        </AnimatePresence>

        {/* Food card grid */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {TIER_ORDER.map(tier => {
              const cards = groupedCards[tier];
              if (!cards.length) return null;
              const m = TIER_META[tier];
              return (
                <div key={tier}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>{m.emoji}</span>
                    <h3 className="font-black text-[#1a1a1a] uppercase tracking-wide text-xs">
                      {m.label}
                    </h3>
                    <span className="text-xs text-[#9CA3AF]">· {m.points} pts</span>
                  </div>
                  <div className="space-y-2">
                    {cards.map(card => (
                      <motion.button
                        key={card.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleCardPick(card)}
                        disabled={!activeSlot || submitted}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 ${m.color} ${m.border} text-left transition-all ${
                          activeSlot && !submitted
                            ? 'cursor-pointer hover:shadow-md'
                            : 'opacity-75 cursor-default'
                        } ${card.is_challenge_card ? 'ring-2 ring-[#F5B731] ring-offset-1' : ''}`}
                      >
                        <span className="text-3xl">{card.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-[#1a1a1a] text-sm">{card.name}</span>
                            {card.is_challenge_card && (
                              <span className="text-xs font-bold text-amber-600">✨ Challenge</span>
                            )}
                          </div>
                          {card.description && (
                            <p className="text-xs text-[#6B7280] mt-0.5 truncate">{card.description}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <TierBadge tier={card.tier} />
                          <p className="text-xs font-black text-[#2D8B6E] mt-1">{card.base_points} pts</p>
                        </div>
                      </motion.button>
                    ))}
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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#2D8B6E] to-[#1a5c49]"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-center px-8"
            >
              <motion.p
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-8xl mb-6"
              >
                🎉
              </motion.p>
              <h2 className="text-3xl font-black text-white mb-2">Menu submitted!</h2>
              <p className="text-lg text-green-100">Great planning, Sous Chef!</p>
              <p className="text-4xl font-black text-[#F5B731] mt-4">+{totalPoints} pts</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
