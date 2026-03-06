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

// Big pool of fun confetti for a 6-year-old
const CONFETTI_POOL = ['🎉', '⭐', '🌟', '✨', '🎊', '🏆', '💫', '🎈', '🦋', '🌈', '🍭', '🎀', '🎆', '🥳', '💥', '🌸'];

function FullscreenConfetti() {
  const pieces = Array.from({ length: 30 }).map((_, i) => ({
    emoji: CONFETTI_POOL[i % CONFETTI_POOL.length],
    startX: Math.random() * 100,
    delay: Math.random() * 1,
    duration: 1.5 + Math.random() * 1.5,
    size: Math.random() > 0.5 ? 'text-4xl' : 'text-2xl',
    rotate: Math.random() * 720 - 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: `${p.startX}vw`, y: '-10vh', rotate: 0, scale: 1 }}
          animate={{ opacity: 0, y: '110vh', rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className={`fixed top-0 left-0 ${p.size} pointer-events-none select-none`}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

function StickerBadge({ record, index }: { record: MealRecord & { food_card?: FoodCard }; index: number }) {
  const card = record.food_card;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -15 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 400, damping: 15 }}
      whileHover={{ scale: 1.15, rotate: 5 }}
      className="flex flex-col items-center gap-1 cursor-default"
    >
      <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl shadow-sm ${
        card ? `${TIER_META[card.tier].color} ${TIER_META[card.tier].border}` : 'bg-gray-100 border-gray-200'
      }`}>
        {card?.emoji ?? '🌟'}
      </div>
      <span className="text-[10px] text-[#6B7280] text-center max-w-[60px] leading-tight font-semibold">
        {card?.name ?? '?'}
      </span>
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
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [drafts, hist, pts] = await Promise.all([
        getWeeklyDraft(weekStart),
        getKidMealHistory('Axel', 30),
        getKidPoints('Axel'),
      ]);
      // Lunch slot = today (0-6)
      const todayEntry = drafts.find(d => d.day_of_week === today) ?? null;
      setTodayDraft(todayEntry);
      setTriedHistory(hist);
      setPoints(pts);
      if (todayEntry) {
        setAlreadyTried(hist.some(r => r.weekly_draft_id === todayEntry.id));
      }
    } catch {
      setError('Could not load. Please try again!');
    } finally {
      setLoading(false);
    }
  }, [weekStart, today]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleTriedIt() {
    if (!todayDraft || alreadyTried || saving) return;
    setSaving(true);
    try {
      const card = todayDraft.food_card;
      const pts = 10;
      const record = await recordMeal({
        weekly_draft_id: todayDraft.id,
        kid_name: 'Axel',
        status: 'tried',
        points_earned: pts,
      });
      await addPoints('Axel', pts, `Tried ${card?.name ?? 'a new food'}!`, record.id);
      setJustEarned(pts);
      setCelebrating(true);
      setAlreadyTried(true);
      setPoints(p => p + pts);
      // Add to history optimistically
      setTriedHistory(prev => [{ ...record, food_card: card }, ...prev]);
      setTimeout(() => setCelebrating(false), 3000);
    } catch {
      setError('Oops! Try again.');
    } finally {
      setSaving(false);
    }
  }

  const card = todayDraft?.food_card;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <KidNav />

      {/* Full screen confetti on celebration */}
      <AnimatePresence>
        {celebrating && <FullscreenConfetti />}
      </AnimatePresence>

      <div className="px-4 py-5 space-y-5 pb-24">
        {/* Header */}
        <div className="text-center">
          <motion.p
            animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="text-6xl mb-1"
          >
            🌟
          </motion.p>
          <h1 className="text-3xl font-black text-[#0A0A0A] tracking-tight">Axel&apos;s Adventure!</h1>
          <p className="text-sm text-[#6B7280] mt-1">Every bite is a new adventure!</p>
        </div>

        {/* Points display — big and bold for a 6-year-old */}
        <motion.div
          animate={celebrating ? { scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-5 text-center shadow-xl shadow-purple-200 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <p className="text-6xl font-black text-white relative z-10">{points}</p>
          <p className="text-lg font-black text-white/80 relative z-10">Adventure Points!</p>
          {celebrating && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-black text-[#F5B731] mt-1 relative z-10"
            >
              +{justEarned} pts! 🎉
            </motion.p>
          )}
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="h-56 bg-white/60 rounded-3xl border border-[#E5E7EB] animate-pulse" />
            <div className="h-32 bg-white/60 rounded-3xl border border-[#E5E7EB] animate-pulse" />
          </div>
        ) : (
          <>
            {/* Today's meal card — GIANT for a 6-year-old */}
            {card ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl border-4 ${TIER_META[card.tier].border} bg-white p-8 text-center shadow-lg`}
              >
                <motion.p
                  animate={celebrating ? { scale: [1, 1.3, 1], rotate: [0, -15, 15, 0] } : { y: [0, -4, 0] }}
                  transition={celebrating ? { duration: 0.6 } : { duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  className="text-8xl mb-4"
                >
                  {card.emoji}
                </motion.p>
                <h2 className="text-3xl font-black text-[#0A0A0A]">{card.name}</h2>
                {card.description && (
                  <p className="text-base text-[#6B7280] mt-2">{card.description}</p>
                )}
                <div className={`mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-black ${TIER_META[card.tier].color} ${TIER_META[card.tier].border} border-2`}>
                  {TIER_META[card.tier].emoji} {TIER_META[card.tier].label}
                </div>
              </motion.div>
            ) : (
              <div className="rounded-3xl border-4 border-dashed border-[#D1D5DB] bg-white/60 p-10 text-center">
                <p className="text-7xl mb-3">🍽️</p>
                <p className="text-xl font-black text-[#6B7280]">No meal planned yet!</p>
                <p className="text-sm text-[#9CA3AF] mt-1">Ask Sous Chef Alexis to plan today&apos;s meal</p>
              </div>
            )}

            {/* THE BIG BUTTON — maximum size for age 6 */}
            <div className="relative">
              {alreadyTried ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="w-full py-10 rounded-3xl bg-green-100 border-4 border-green-400 text-center shadow-lg"
                >
                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-7xl mb-3"
                  >
                    ✅
                  </motion.p>
                  <p className="text-2xl font-black text-green-800">I tried it!</p>
                  <p className="text-base font-bold text-green-700 mt-1">Amazing, Axel! +10 pts</p>
                </motion.div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={handleTriedIt}
                  disabled={!card || saving}
                  className={`w-full py-14 rounded-3xl font-black tracking-tight transition-all ${
                    card
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-300 active:shadow-md'
                      : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                  }`}
                  style={{ fontSize: '2rem', lineHeight: 1.2 }}
                >
                  {saving ? '⏳ Saving...' : (
                    <>
                      I TRIED IT!<br />
                      <span style={{ fontSize: '2.5rem' }}>🎉</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Photo placeholder */}
            <button className="w-full py-4 rounded-2xl border-2 border-dashed border-purple-300 text-purple-500 font-bold text-base hover:bg-purple-50 transition-colors">
              📷 Take a photo! (coming soon)
            </button>

            {/* Sticker collection — displayed as a trophy shelf */}
            {triedHistory.length > 0 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🏅</span>
                  <h3 className="font-black text-[#0A0A0A] text-lg">My Sticker Collection</h3>
                  <span className="ml-auto bg-purple-100 text-purple-700 font-black text-sm px-2.5 py-0.5 rounded-full">
                    {triedHistory.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {triedHistory.map((record, i) => (
                    <StickerBadge key={record.id} record={record} index={i} />
                  ))}
                </div>
                {triedHistory.length >= 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center py-2 bg-amber-50 rounded-2xl border border-amber-200"
                  >
                    <p className="text-sm font-black text-amber-700">🌟 Super Adventurer! {triedHistory.length} foods tried!</p>
                  </motion.div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
