'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { KidNav } from '@/components/KidNav';
import {
  getFoodCards,
  getWeeklyDraft,
  saveDraftPick,
  FoodCard,
  WeeklyDraft,
  TIER_META,
  Tier,
} from '@/lib/supabase';
import { getWeekStart } from '@/lib/supabase';
import { DAY_NAMES, DAY_SHORTS } from '@/lib/utils';

const TIER_ORDER: Tier[] = ['legendary', 'epic', 'rare', 'common'];

function addWeeks(dateStr: string, n: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n * 7);
  return d.toISOString().split('T')[0];
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${d.toLocaleDateString('en-SG', opts)} – ${end.toLocaleDateString('en-SG', opts)}`;
}

function TierBadge({ tier }: { tier: Tier }) {
  const m = TIER_META[tier];
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${m.color} border ${m.border}`}>
      {m.emoji} {m.label}
    </span>
  );
}

function FoodCardPill({ card, onPick }: { card: FoodCard; onPick: () => void }) {
  const m = TIER_META[card.tier];
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onPick}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 ${m.color} ${m.border} text-left transition-shadow hover:shadow-md ${
        card.is_challenge_card ? 'ring-2 ring-amber-400 ring-offset-1 shadow-amber-100 shadow-lg' : ''
      }`}
    >
      <span className="text-3xl">{card.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[#0A0A0A]">{card.name}</span>
          {card.is_challenge_card && <span className="text-xs font-bold text-amber-600">✨ Challenge!</span>}
        </div>
        {card.description && (
          <p className="text-xs text-[#6B7280] mt-0.5 truncate">{card.description}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <TierBadge tier={card.tier} />
        <p className="text-xs font-bold text-[#6B7280] mt-1">{card.base_points} pts</p>
      </div>
    </motion.button>
  );
}

export default function ChefPage() {
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [drafts, setDrafts] = useState<WeeklyDraft[]>([]);
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cards, draftData] = await Promise.all([
        getFoodCards(),
        getWeeklyDraft(weekStart),
      ]);
      setFoodCards(cards);
      setDrafts(draftData);
      setSubmitted(draftData.length === 7);
    } catch {
      setError('Could not load data. Make sure the schema is set up in Supabase.');
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const draftMap = new Map(drafts.map(d => [d.day_of_week, d]));
  const allPicked = Array.from({ length: 7 }, (_, i) => draftMap.has(i)).every(Boolean);
  const weeklyPotential = drafts.reduce((sum, d) => sum + (d.food_card?.base_points ?? 0), 0);

  async function handlePick(card: FoodCard) {
    if (selectedDay === null) return;
    setSaving(true);
    try {
      await saveDraftPick(weekStart, selectedDay, card.id);
      await loadData();
    } catch {
      setError('Failed to save pick. Please try again.');
    } finally {
      setSaving(false);
      setPickerOpen(false);
      setSelectedDay(null);
    }
  }

  function handleSubmit() {
    if (!allPicked) return;
    setCelebrating(true);
    setTimeout(() => setSubmitted(true), 2500);
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

      <div className="px-4 py-6 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-[#0A0A0A] tracking-tight">
            👨‍🍳 Sous Chef Alexis&apos;s Kitchen
          </h1>
          <p className="text-sm font-medium text-[#6B7280]">
            Pick one dish per day — build this week&apos;s menu!
          </p>
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-[#E5E7EB] shadow-sm px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setWeekStart(w => addWeeks(w, -1))}
            className="p-1.5 rounded-xl hover:bg-[#F3F4F6] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#374151]" />
          </motion.button>
          <div className="text-center">
            <p className="font-bold text-[#0A0A0A] text-sm">{formatWeekLabel(weekStart)}</p>
            <p className="text-xs text-[#6B7280]">Week of</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setWeekStart(w => addWeeks(w, 1))}
            className="p-1.5 rounded-xl hover:bg-[#F3F4F6] transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#374151]" />
          </motion.button>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Day slots */}
            <div className="space-y-3">
              {Array.from({ length: 7 }, (_, day) => {
                const draft = draftMap.get(day);
                const card = draft?.food_card;
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: day * 0.05, duration: 0.25 }}
                  >
                    {card ? (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 bg-white shadow-sm ${TIER_META[card.tier].border} ${
                          card.is_challenge_card ? 'ring-2 ring-amber-400 ring-offset-1' : ''
                        }`}
                      >
                        {/* Day label */}
                        <div className="w-10 text-center flex-shrink-0">
                          <p className="text-xs font-bold text-[#6B7280] uppercase">{DAY_SHORTS[day]}</p>
                        </div>
                        <span className="text-2xl">{card.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0A0A0A] truncate">{card.name}</p>
                          <TierBadge tier={card.tier} />
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-[#2D8B6E]">{card.base_points} pts</p>
                          {!submitted && (
                            <button
                              onClick={() => { setSelectedDay(day); setPickerOpen(true); }}
                              className="text-xs text-[#6B7280] underline mt-0.5"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setSelectedDay(day); setPickerOpen(true); }}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-white hover:border-[#F5B731] hover:bg-amber-50 transition-colors group"
                      >
                        <div className="w-10 text-center flex-shrink-0">
                          <p className="text-xs font-bold text-[#6B7280] uppercase">{DAY_SHORTS[day]}</p>
                          <p className="text-[10px] text-[#9CA3AF]">{DAY_NAMES[day]}</p>
                        </div>
                        <span className="text-2xl opacity-30 group-hover:opacity-60">🍽️</span>
                        <p className="text-sm font-semibold text-[#9CA3AF] group-hover:text-[#2D8B6E] transition-colors">
                          Pick a dish →
                        </p>
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Weekly summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#374151]">Weekly points potential</p>
                <p className="text-xs text-[#9CA3AF]">{drafts.length}/7 days picked</p>
              </div>
              <p className="text-2xl font-black text-[#2D8B6E]">{weeklyPotential} pts</p>
            </div>

            {/* Submit button */}
            {!submitted ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!allPicked || saving}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                  allPicked
                    ? 'bg-[#F5B731] text-[#1a1a1a] shadow-lg shadow-amber-200 hover:bg-[#e0a82e]'
                    : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                }`}
              >
                {allPicked ? 'Submit Menu ✓' : `Pick ${7 - drafts.length} more day${7 - drafts.length !== 1 ? 's' : ''}`}
              </motion.button>
            ) : (
              <div className="bg-green-50 border-2 border-green-400 rounded-2xl px-4 py-5 text-center">
                <p className="text-2xl mb-1">🎉</p>
                <p className="font-black text-green-800 text-lg">Menu submitted!</p>
                <p className="text-sm text-green-700">The kitchen has your orders, Chef.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Card Picker Sheet */}
      <AnimatePresence>
        {pickerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setPickerOpen(false); setSelectedDay(null); }}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto bg-white rounded-t-3xl shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-4 py-4 flex items-center justify-between rounded-t-3xl">
                <div>
                  <p className="font-black text-[#0A0A0A] text-lg">
                    Pick for {selectedDay !== null ? DAY_NAMES[selectedDay] : ''}
                  </p>
                  <p className="text-xs text-[#6B7280]">Higher tier = more points!</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { setPickerOpen(false); setSelectedDay(null); }}
                  className="p-2 rounded-xl hover:bg-[#F3F4F6]"
                >
                  <X className="w-5 h-5 text-[#374151]" />
                </motion.button>
              </div>

              <div className="px-4 pb-8 space-y-5 pt-3">
                {TIER_ORDER.map(tier => {
                  const cards = groupedCards[tier];
                  if (!cards.length) return null;
                  const m = TIER_META[tier];
                  return (
                    <div key={tier}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{m.emoji}</span>
                        <h3 className="font-black text-[#0A0A0A] uppercase tracking-wide text-sm">
                          {m.label}
                        </h3>
                        <span className="text-xs text-[#6B7280]">· {m.points} pts each</span>
                      </div>
                      <div className="space-y-2">
                        {cards.map(card => (
                          <FoodCardPill key={card.id} card={card} onPick={() => handlePick(card)} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setCelebrating(false)}
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
              <h2 className="text-3xl font-black text-white mb-3">Menu submitted!</h2>
              <p className="text-lg text-blue-100">The kitchen has your orders, Chef.</p>
              <p className="text-4xl font-black text-amber-300 mt-4">{weeklyPotential} pts possible</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
