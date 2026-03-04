'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { KidNav } from '@/components/KidNav';
import {
  getWeeklyDraft,
  getKidMealHistory,
  recordMeal,
  addPoints,
  computePoints,
  WeeklyDraft,
  MealRecord,
  FoodCard,
  TIER_META,
} from '@/lib/supabase';
import { getWeekStart } from '@/lib/supabase';
import { todayDayOfWeek, DAY_NAMES } from '@/lib/utils';

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2 justify-center py-2">
      {[1, 2, 3, 4, 5].map(star => (
        <motion.button
          key={star}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.15 }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="p-1"
        >
          <Star
            className={`w-10 h-10 transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-[#D1D5DB]'
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
}

const VERDICT_LABELS: Record<number, string> = {
  1: 'Not great 😬',
  2: 'Could be better 🤔',
  3: 'Pretty good! 😊',
  4: 'Really good! 😄',
  5: 'Amazing! 🤩',
};

export default function CriticPage() {
  const today = todayDayOfWeek();
  const weekStart = getWeekStart();

  const [todayDraft, setTodayDraft] = useState<WeeklyDraft | null>(null);
  const [history, setHistory] = useState<(MealRecord & { food_card?: FoodCard })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [verdict, setVerdict] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [drafts, hist] = await Promise.all([
        getWeeklyDraft(weekStart),
        getKidMealHistory('Aleric', 5),
      ]);
      const todayEntry = drafts.find(d => d.day_of_week === today) ?? null;
      setTodayDraft(todayEntry);
      setHistory(hist);
    } catch {
      setError('Could not load data. Make sure the Supabase schema is set up.');
    } finally {
      setLoading(false);
    }
  }, [weekStart, today]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSubmit() {
    if (!rating || !todayDraft) return;
    setSubmitting(true);
    try {
      const card = todayDraft.food_card;
      const pts = card ? computePoints('clean_plate', card.tier, card.is_challenge_card) : 0;
      const record = await recordMeal({
        weekly_draft_id: todayDraft.id,
        kid_name: 'Aleric',
        status: 'clean_plate',
        critic_rating: rating,
        points_earned: pts,
      });
      await addPoints('Aleric', pts, `Rated ${card?.name ?? 'meal'} ${rating}⭐`, record.id);
      setSaved(true);
      await loadData();
    } catch {
      setError('Failed to save rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const card = todayDraft?.food_card;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-50">
      <KidNav />

      <div className="px-4 py-6 space-y-5">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#0A0A0A] tracking-tight">⭐ Critic Aleric&apos;s Table</h1>
          <p className="text-sm text-[#6B7280] mt-1">{DAY_NAMES[today]} — rate tonight&apos;s meal</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="space-y-3">
            <div className="h-36 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            <div className="h-24 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
          </div>
        ) : (
          <>
            {/* Today's meal card */}
            {card ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl border-2 ${TIER_META[card.tier].border} ${TIER_META[card.tier].color} p-5 text-center shadow-sm`}
              >
                <p className="text-6xl mb-3">{card.emoji}</p>
                <h2 className="text-2xl font-black text-[#0A0A0A]">{card.name}</h2>
                {card.description && (
                  <p className="text-sm text-[#6B7280] mt-1">{card.description}</p>
                )}
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-white">
                  <span className="text-sm">{TIER_META[card.tier].emoji}</span>
                  <span className="text-xs font-bold text-[#374151]">{TIER_META[card.tier].label}</span>
                  <span className="text-xs text-[#6B7280]">· {card.base_points} pts</span>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-[#D1D5DB] bg-white p-8 text-center">
                <p className="text-4xl mb-2">🍽️</p>
                <p className="text-sm text-[#6B7280]">No meal planned for today yet.</p>
                <p className="text-xs text-[#9CA3AF] mt-1">Alexis needs to submit the weekly menu first.</p>
              </div>
            )}

            {/* Rating section */}
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-50 border-2 border-amber-400 rounded-3xl px-4 py-6 text-center"
                >
                  <p className="text-4xl mb-2">⭐</p>
                  <p className="text-xl font-black text-amber-800">Rating saved!</p>
                  <p className="text-sm text-amber-700 mt-1">
                    {rating} star{rating !== 1 ? 's' : ''} — {VERDICT_LABELS[rating]}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-5 space-y-4"
                >
                  <div>
                    <p className="text-sm font-bold text-[#374151] text-center mb-1">How was it?</p>
                    <StarRating value={rating} onChange={setRating} />
                    {rating > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm font-semibold text-amber-600"
                      >
                        {VERDICT_LABELS[rating]}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      My verdict (optional)
                    </label>
                    <input
                      value={verdict}
                      onChange={e => setVerdict(e.target.value)}
                      placeholder="e.g. The sauce was really good!"
                      className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm bg-[#FAFAFA] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={!rating || !card || submitting}
                    className={`w-full py-3.5 rounded-2xl font-black text-base transition-all ${
                      rating && card
                        ? 'bg-amber-400 text-amber-900 shadow-md hover:bg-amber-500'
                        : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                    }`}
                  >
                    {submitting ? 'Saving...' : 'Submit Rating ⭐'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Guest suggestion */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-5">
              <p className="text-sm font-bold text-[#0A0A0A] mb-1">💡 Suggest a meal for next week</p>
              <p className="text-xs text-[#9CA3AF] mb-3">What would you like Alexis to cook?</p>
              <div className="flex gap-2">
                <input
                  value={suggestion}
                  onChange={e => setSuggestion(e.target.value)}
                  placeholder="e.g. Laksa, Beef noodles..."
                  className="flex-1 rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm bg-[#FAFAFA] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSuggestion('')}
                  disabled={!suggestion}
                  className="px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-bold disabled:opacity-40"
                >
                  Send
                </motion.button>
              </div>
            </div>

            {/* Rating history */}
            {history.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#6B7280]">Recent Ratings</h3>
                {history.map((record, i) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 bg-white rounded-2xl border border-[#E5E7EB] px-3 py-3"
                  >
                    <span className="text-2xl">{record.food_card?.emoji ?? '🍽️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#0A0A0A] truncate">
                        {record.food_card?.name ?? 'Meal'}
                      </p>
                      <p className="text-xs text-[#9CA3AF]">
                        {new Date(record.recorded_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 ${j < (record.critic_rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-[#E5E7EB]'}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
