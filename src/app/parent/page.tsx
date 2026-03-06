'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { KidNav } from '@/components/KidNav';
import {
  getWeeklyDraft,
  getKidPoints,
  getRecentMealActivity,
  FoodCard,
  WeeklyDraft,
  MealRecord,
  TIER_META,
} from '@/lib/supabase';
import { getWeekStart } from '@/lib/supabase';
import { DAY_SHORTS } from '@/lib/utils';

const KID_NAMES = ['Alexis', 'Aleric', 'Axel'] as const;
const KID_EMOJIS: Record<string, string> = {
  Alexis: '👨‍🍳',
  Aleric: '⭐',
  Axel: '🌟',
};

const STATUS_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  clean_plate: { label: 'Clean plate!', emoji: '🍽️', color: 'text-green-700' },
  half:        { label: 'Half eaten',   emoji: '🥄', color: 'text-amber-600' },
  tried:       { label: 'Tried it!',    emoji: '✅', color: 'text-blue-600'  },
  skipped:     { label: 'Skipped',      emoji: '❌', color: 'text-red-500'   },
};

function PointsBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  return (
    <div className="mt-1.5 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full rounded-full bg-gradient-to-r from-[#2D8B6E] to-[#F5B731]"
      />
    </div>
  );
}

export default function ParentPage() {
  const weekStart = getWeekStart();

  const [drafts, setDrafts] = useState<WeeklyDraft[]>([]);
  const [kidPoints, setKidPoints] = useState<Record<string, number>>({ Alexis: 0, Aleric: 0, Axel: 0 });
  const [activity, setActivity] = useState<(MealRecord & { food_card?: FoodCard })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [draftData, recentActivity, ...pts] = await Promise.all([
        getWeeklyDraft(weekStart),
        getRecentMealActivity(5),
        ...KID_NAMES.map(k => getKidPoints(k)),
      ]);
      setDrafts(draftData);
      setActivity(recentActivity);
      setKidPoints(Object.fromEntries(KID_NAMES.map((k, i) => [k, pts[i]])));
    } catch {
      setError('Could not load data. Make sure the Supabase schema is set up.');
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => { loadData(); }, [loadData]);

  const draftMap = new Map(drafts.map(d => [d.day_of_week, d]));
  const maxPoints = Math.max(...Object.values(kidPoints), 1);

  // Team bonus: if ≥2 kids ate something today — simple heuristic from activity
  const kidsActiveToday = new Set(
    activity
      .filter(r => new Date(r.recorded_at).toDateString() === new Date().toDateString())
      .map(r => r.kid_name)
  );
  const teamBonusUnlocked = kidsActiveToday.size >= 2;

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <KidNav />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight">🏠 This Week&apos;s Kitchen</h1>
          <p className="text-sm text-[#6B7280] mt-1">{weekStart} · Family overview</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Team bonus */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl px-4 py-3 border-2 flex items-center gap-3 ${
                teamBonusUnlocked
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-white border-[#E5E7EB]'
              }`}
            >
              <span className="text-2xl">{teamBonusUnlocked ? '🏆' : '⭐'}</span>
              <div>
                {teamBonusUnlocked ? (
                  <>
                    <p className="font-black text-amber-800 text-sm">Team bonus unlocked today!</p>
                    <p className="text-xs text-amber-600">
                      {kidsActiveToday.size}/3 kids ate today — great teamwork!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-[#374151] text-sm">Team bonus not yet unlocked</p>
                    <p className="text-xs text-[#6B7280]">
                      {kidsActiveToday.size}/3 kids recorded today — keep going!
                    </p>
                  </>
                )}
              </div>
            </motion.div>

            {/* Points scoreboard */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#6B7280] mb-4">Points Scoreboard</h2>
              <div className="space-y-4">
                {KID_NAMES.map((kid, i) => (
                  <motion.div
                    key={kid}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{KID_EMOJIS[kid]}</span>
                        <span className="font-bold text-[#1a1a1a]">{kid}</span>
                      </div>
                      <span className="text-lg font-black text-[#2D8B6E]">{kidPoints[kid]} pts</span>
                    </div>
                    <PointsBar current={kidPoints[kid]} max={maxPoints} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weekly menu grid */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#6B7280] mb-3">This Week&apos;s Menu</h2>
              {drafts.length === 0 ? (
                <p className="text-sm text-[#9CA3AF] text-center py-4">
                  Sous Chef Alexis hasn&apos;t submitted the menu yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {Array.from({ length: 7 }, (_, day) => {
                    const draft = draftMap.get(day);
                    const card = draft?.food_card;
                    return (
                      <div key={day} className="flex items-center gap-3 py-1.5">
                        <span className="text-xs font-bold text-[#9CA3AF] w-8 flex-shrink-0 uppercase">
                          {DAY_SHORTS[day]}
                        </span>
                        {card ? (
                          <>
                            <span className="text-lg">{card.emoji}</span>
                            <span className="flex-1 text-sm font-semibold text-[#1a1a1a] truncate">{card.name}</span>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${TIER_META[card.tier].color} border ${TIER_META[card.tier].border}`}>
                              {card.base_points}pt
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-[#D1D5DB] italic">Not picked</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent activity */}
            {activity.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#6B7280] mb-3">Recent Activity</h2>
                <div className="space-y-2">
                  {activity.map((record, i) => {
                    const s = STATUS_LABELS[record.status];
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 py-1"
                      >
                        <span className="text-sm">{s.emoji}</span>
                        <span className="text-lg">{record.food_card?.emoji ?? '🍽️'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                            {KID_EMOJIS[record.kid_name]} {record.kid_name} — {record.food_card?.name ?? 'Meal'}
                          </p>
                          <p className={`text-xs ${s.color}`}>{s.label}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-[#2D8B6E]">+{record.points_earned}pt</p>
                          {record.critic_rating && (
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, j) => (
                                <Star key={j} className={`w-3 h-3 ${j < record.critic_rating! ? 'fill-amber-400 text-amber-400' : 'text-[#E5E7EB]'}`} />
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
