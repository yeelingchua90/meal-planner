'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KidNav } from '@/components/KidNav';
import {
  getWeeklyDraft,
  getKidMealHistory,
  getKidPoints,
  recordMeal,
  addPoints,
  WeeklyDraft,
  MealRecord,
  FoodCard,
  TIER_META,
} from '@/lib/supabase';
import { getWeekStart } from '@/lib/supabase';
import { todayDayOfWeek } from '@/lib/utils';

const CONFETTI_EMOJIS = ['🎉', '⭐', '🌟', '✨', '🎊', '🏆', '💫', '🎈'];

function ConfettiPiece({ emoji, index }: { emoji: string; index: number }) {
  const angle = (index / 8) * 360;
  const distance = 120 + Math.random() * 80;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * distance;
  const y = Math.sin(rad) * distance;

  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, x, y, scale: 1.5 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.04 }}
      className="absolute text-3xl pointer-events-none select-none"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      {emoji}
    </motion.div>
  );
}

export default function AdventurerPage() {
  const today = todayDayOfWeek();
  const weekStart = getWeekStart();

  const [todayDraft, setTodayDraft] = useState<WeeklyDraft | null>(null);
  const [triedHistory, setTriedHistory] = useState<(MealRecord & { food_card?: FoodCard })[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [celebrating, setCelebrating] = useState(false);
  const [justEarned, setJustEarned] = useState(0);
  const [alreadyTried, setAlreadyTried] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [drafts, hist, pts] = await Promise.all([
        getWeeklyDraft(weekStart),
        getKidMealHistory('Axel', 20),
        getKidPoints('Axel'),
      ]);
      const todayEntry = drafts.find(d => d.day_of_week === today) ?? null;
      setTodayDraft(todayEntry);
      setTriedHistory(hist);
      setPoints(pts);

      // Check if Axel already tried today's meal
      if (todayEntry) {
        setAlreadyTried(hist.some(r => r.weekly_draft_id === todayEntry.id));
      }
    } catch {
      setError('Could not load data. Make sure the Supabase schema is set up.');
    } finally {
      setLoading(false);
    }
  }, [weekStart, today]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleTriedIt() {
    if (!todayDraft || alreadyTried) return;
    try {
      const card = todayDraft.food_card;
      const pts = 10; // flat "tried" points for Axel
      const record = await recordMeal({
        weekly_draft_id: todayDraft.id,
        kid_name: 'Axel',
        status: 'tried',
        points_earned: pts,
      });
      await addPoints('Axel', pts, `Tried ${card?.name ?? 'a new food'}!`, record.id);
      setJustEarned(pts);
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2000);
      setAlreadyTried(true);
      setPoints(p => p + pts);
    } catch {
      setError('Failed to record. Please try again.');
    }
  }

  const card = todayDraft?.food_card;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <KidNav />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-[#0A0A0A] tracking-tight">🌟 Axel&apos;s Adventure!</h1>
          <p className="text-sm text-[#6B7280] mt-1">Every bite is a new adventure!</p>
        </div>

        {/* Points display */}
        <motion.div
          animate={{ scale: celebrating ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.4 }}
          className="text-center bg-white rounded-3xl border border-[#E5E7EB] shadow-sm py-4"
        >
          <p className="text-4xl font-black text-purple-600">⭐ {points} pts</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Adventure points</p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="h-48 bg-white rounded-3xl border border-[#E5E7EB] animate-pulse" />
            <div className="h-24 bg-white rounded-3xl border border-[#E5E7EB] animate-pulse" />
          </div>
        ) : (
          <>
            {/* Today's meal */}
            {card ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl border-4 ${TIER_META[card.tier].border} ${TIER_META[card.tier].color} p-6 text-center shadow-md`}
              >
                <motion.p
                  animate={celebrating ? { rotate: [0, -15, 15, -15, 15, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-8xl mb-3"
                >
                  {card.emoji}
                </motion.p>
                <h2 className="text-2xl font-black text-[#0A0A0A]">{card.name}</h2>
                {card.description && (
                  <p className="text-sm text-[#6B7280] mt-1">{card.description}</p>
                )}
              </motion.div>
            ) : (
              <div className="rounded-3xl border-4 border-dashed border-[#D1D5DB] bg-white p-8 text-center">
                <p className="text-6xl mb-2">🍽️</p>
                <p className="text-sm text-[#6B7280]">No meal yet today!</p>
              </div>
            )}

            {/* Big action button */}
            <div className="relative">
              <AnimatePresence>
                {celebrating && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    {CONFETTI_EMOJIS.map((emoji, i) => (
                      <ConfettiPiece key={i} emoji={emoji} index={i} />
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {alreadyTried ? (
                <div className="w-full py-8 rounded-3xl bg-green-100 border-4 border-green-400 text-center">
                  <p className="text-5xl mb-2">✅</p>
                  <p className="text-xl font-black text-green-800">I tried it today!</p>
                  <p className="text-sm text-green-700 mt-1">Amazing work, Axel! +10 pts earned</p>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={handleTriedIt}
                  disabled={!card}
                  className={`w-full py-10 rounded-3xl text-3xl font-black tracking-tight transition-all shadow-lg ${
                    card
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-200 active:shadow-sm'
                      : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                  }`}
                >
                  I TRIED IT! 🎉
                </motion.button>
              )}

              {/* Points flash */}
              <AnimatePresence>
                {celebrating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                    animate={{ opacity: 1, y: -40, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none z-20"
                  >
                    <span className="text-2xl font-black text-amber-500">+{justEarned} pts!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Photo placeholder */}
            <button className="w-full py-3 rounded-2xl border-2 border-dashed border-[#D1D5DB] text-sm text-[#9CA3AF] font-medium hover:border-purple-300 transition-colors">
              📷 Take Photo (coming soon)
            </button>

            {/* Sticker collection */}
            {triedHistory.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-4">
                <h3 className="font-black text-[#0A0A0A] text-sm mb-3">
                  🏅 My Sticker Collection ({triedHistory.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {triedHistory.map((record, i) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                      title={record.food_card?.name ?? 'Meal'}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <span className="text-3xl">{record.food_card?.emoji ?? '🌟'}</span>
                      <span className="text-[10px] text-[#9CA3AF] text-center max-w-[48px] leading-tight truncate">
                        {record.food_card?.name ?? '?'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
