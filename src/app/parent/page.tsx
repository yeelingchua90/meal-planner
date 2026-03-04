'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { KidNav } from '@/components/KidNav';
import {
  getFoodCards,
  getWeeklyDraft,
  getKidPoints,
  getRecentMealActivity,
  addFoodCard,
  setChallengeCard,
  FoodCard,
  WeeklyDraft,
  MealRecord,
  TIER_META,
  Tier,
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

const TIER_ORDER: Tier[] = ['legendary', 'epic', 'rare', 'common'];
const EMOJI_OPTIONS = ['🍳','🥚','🍗','🍜','🐟','🥘','🍖','🥦','🥄','🐠','🍛','🍱','🍣','🫕','🥗','🍝','🍲','🧆','🫔','🌮'];

function PointsBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  return (
    <div className="mt-1.5 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-500"
      />
    </div>
  );
}

export default function ParentPage() {
  const weekStart = getWeekStart();

  const [drafts, setDrafts] = useState<WeeklyDraft[]>([]);
  const [foodCards, setFoodCards] = useState<FoodCard[]>([]);
  const [kidPoints, setKidPoints] = useState<Record<string, number>>({ Alexis: 0, Aleric: 0, Axel: 0 });
  const [activity, setActivity] = useState<(MealRecord & { food_card?: FoodCard })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add card form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🍽️');
  const [newTier, setNewTier] = useState<Tier>('common');
  const [newDesc, setNewDesc] = useState('');
  const [isChallenge, setIsChallenge] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [draftData, cards, recentActivity, ...pts] = await Promise.all([
        getWeeklyDraft(weekStart),
        getFoodCards(),
        getRecentMealActivity(5),
        ...KID_NAMES.map(k => getKidPoints(k)),
      ]);
      setDrafts(draftData);
      setFoodCards(cards);
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

  async function handleAddCard() {
    if (!newName.trim()) return;
    setAddSaving(true);
    try {
      const card = await addFoodCard({
        name: newName.trim(),
        description: newDesc.trim() || undefined,
        emoji: newEmoji,
        tier: newTier,
        base_points: TIER_META[newTier].points,
        is_challenge_card: isChallenge,
      });
      if (isChallenge) await setChallengeCard(card.id);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
      setNewName(''); setNewDesc(''); setNewEmoji('🍽️'); setNewTier('common'); setIsChallenge(false);
      setShowAddForm(false);
      await loadData();
    } catch {
      setError('Failed to add card. Please try again.');
    } finally {
      setAddSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <KidNav />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#0A0A0A] tracking-tight">🏠 This Week&apos;s Kitchen</h1>
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
                        <span className="font-bold text-[#0A0A0A]">{kid}</span>
                      </div>
                      <span className="text-lg font-black text-[#2563EB]">{kidPoints[kid]} pts</span>
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
                  Alexis hasn&apos;t submitted the menu yet.
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
                            <span className="flex-1 text-sm font-semibold text-[#0A0A0A] truncate">{card.name}</span>
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
                          <p className="text-sm font-semibold text-[#0A0A0A] truncate">
                            {KID_EMOJIS[record.kid_name]} {record.kid_name} — {record.food_card?.name ?? 'Meal'}
                          </p>
                          <p className={`text-xs ${s.color}`}>{s.label}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-[#2563EB]">+{record.points_earned}pt</p>
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

            {/* Manage Cards */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <button
                onClick={() => setShowAddForm(v => !v)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#F9FAFB] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#2563EB]" />
                  <span className="font-black text-[#0A0A0A]">Manage Food Cards</span>
                  <span className="text-xs text-[#6B7280]">({foodCards.length} active)</span>
                </div>
                {showAddForm ? (
                  <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {showAddForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-[#E5E7EB]"
                  >
                    <div className="px-4 py-4 space-y-4">
                      {/* Existing cards quick list */}
                      <div>
                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Current cards</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {TIER_ORDER.flatMap(tier =>
                            foodCards
                              .filter(c => c.tier === tier)
                              .map(c => (
                                <div key={c.id} className="flex items-center gap-2 text-sm py-0.5">
                                  <span>{c.emoji}</span>
                                  <span className="flex-1 text-[#374151] truncate">{c.name}</span>
                                  <span className={`text-xs font-bold px-1.5 rounded-full ${TIER_META[c.tier].color}`}>
                                    {TIER_META[c.tier].label}
                                  </span>
                                  {c.is_challenge_card && <span className="text-xs text-amber-600 font-bold">✨</span>}
                                </div>
                              ))
                          )}
                        </div>
                      </div>

                      {/* Add new card form */}
                      <div className="border-t border-[#F3F4F6] pt-3 space-y-3">
                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Add new card</p>

                        <div>
                          <label className="text-xs text-[#6B7280] mb-1 block">Dish name *</label>
                          <input
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="e.g. Mee Goreng"
                            className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm bg-[#FAFAFA] focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-[#6B7280] mb-1 block">Description (optional)</label>
                          <input
                            value={newDesc}
                            onChange={e => setNewDesc(e.target.value)}
                            placeholder="e.g. Spicy fried noodles"
                            className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm bg-[#FAFAFA] focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-[#6B7280] mb-1 block">Emoji</label>
                            <select
                              value={newEmoji}
                              onChange={e => setNewEmoji(e.target.value)}
                              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm bg-[#FAFAFA] focus:outline-none focus:border-[#2563EB]"
                            >
                              {EMOJI_OPTIONS.map(e => (
                                <option key={e} value={e}>{e}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-[#6B7280] mb-1 block">Tier</label>
                            <select
                              value={newTier}
                              onChange={e => setNewTier(e.target.value as Tier)}
                              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm bg-[#FAFAFA] focus:outline-none focus:border-[#2563EB]"
                            >
                              {TIER_ORDER.map(t => (
                                <option key={t} value={t}>{TIER_META[t].emoji} {TIER_META[t].label} ({TIER_META[t].points}pts)</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChallenge}
                            onChange={e => setIsChallenge(e.target.checked)}
                            className="w-4 h-4 rounded accent-amber-400"
                          />
                          <span className="text-sm font-semibold text-amber-700">✨ This week&apos;s Challenge Card (+20 bonus pts)</span>
                        </label>

                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={handleAddCard}
                          disabled={!newName.trim() || addSaving}
                          className={`w-full py-3 rounded-2xl font-black text-sm transition-all ${
                            newName.trim()
                              ? 'bg-[#2563EB] text-white hover:bg-blue-700'
                              : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                          }`}
                        >
                          {addSaving ? 'Saving...' : addSuccess ? '✓ Card Added!' : '+ Add Food Card'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
