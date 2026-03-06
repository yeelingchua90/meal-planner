'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { KidNav } from '@/components/KidNav';
import {
  getWeeklyDraft,
  getKidPoints,
  getRecentMealActivity,
  getAllFoodCards,
  toggleFoodCardActive,
  createFoodCard,
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

const TIER_OPTIONS: Tier[] = ['common', 'rare', 'epic', 'legendary'];

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

type Tab = 'overview' | 'cards';

export default function ParentPage() {
  const weekStart = getWeekStart();

  const [tab, setTab] = useState<Tab>('overview');

  // Overview state
  const [drafts, setDrafts] = useState<WeeklyDraft[]>([]);
  const [kidPoints, setKidPoints] = useState<Record<string, number>>({ Alexis: 0, Aleric: 0, Axel: 0 });
  const [activity, setActivity] = useState<(MealRecord & { food_card?: FoodCard })[]>([]);

  // Cards state
  const [allCards, setAllCards] = useState<FoodCard[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🍽️');
  const [newTier, setNewTier] = useState<Tier>('common');
  const [newDesc, setNewDesc] = useState('');
  const [addingSaving, setAddingSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
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

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cards = await getAllFoodCards();
      setAllCards(cards);
    } catch {
      setError('Could not load cards.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'overview') loadOverview();
    else loadCards();
  }, [tab, loadOverview, loadCards]);

  async function handleToggleActive(card: FoodCard) {
    try {
      await toggleFoodCardActive(card.id, !card.is_active);
      setAllCards(prev => prev.map(c => c.id === card.id ? { ...c, is_active: !c.is_active } : c));
    } catch {
      setError('Failed to update card.');
    }
  }

  async function handleAddCard() {
    if (!newName.trim()) return;
    setAddingSaving(true);
    try {
      const card = await createFoodCard({ name: newName.trim(), emoji: newEmoji, tier: newTier, description: newDesc.trim() || undefined });
      setAllCards(prev => [...prev, card]);
      setNewName('');
      setNewEmoji('🍽️');
      setNewTier('common');
      setNewDesc('');
      setShowAddForm(false);
    } catch {
      setError('Failed to add card.');
    } finally {
      setAddingSaving(false);
    }
  }

  const draftMap = new Map(drafts.map(d => [d.day_of_week, d]));
  const maxPoints = Math.max(...Object.values(kidPoints), 1);

  const kidsActiveToday = new Set(
    activity
      .filter(r => new Date(r.recorded_at).toDateString() === new Date().toDateString())
      .map(r => r.kid_name)
  );
  const teamBonusUnlocked = kidsActiveToday.size >= 2;

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <KidNav />

      <div className="px-4 py-5 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">🏠 Oikos Kitchen</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Parent dashboard</p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-white border border-[#E5E7EB] p-1 gap-1">
          {(['overview', 'cards'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'text-[#6B7280] hover:text-[#1a1a1a]'
              }`}
            >
              {t === 'overview' ? '📊 Overview' : '🃏 Food Cards'}
            </button>
          ))}
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
          <AnimatePresence mode="wait">
            {tab === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="space-y-4"
              >
                {/* Team bonus */}
                <div className={`rounded-2xl px-4 py-3 border-2 flex items-center gap-3 ${
                  teamBonusUnlocked ? 'bg-amber-50 border-amber-400' : 'bg-white border-[#E5E7EB]'
                }`}>
                  <span className="text-2xl">{teamBonusUnlocked ? '🏆' : '⭐'}</span>
                  <div>
                    {teamBonusUnlocked ? (
                      <>
                        <p className="font-black text-amber-800 text-sm">Team bonus unlocked today!</p>
                        <p className="text-xs text-amber-600">{kidsActiveToday.size}/3 kids ate today</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-[#374151] text-sm">Team bonus not yet unlocked</p>
                        <p className="text-xs text-[#6B7280]">{kidsActiveToday.size}/3 kids recorded today</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Points scoreboard */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-4">
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-4">Points Scoreboard</h2>
                  <div className="space-y-4">
                    {KID_NAMES.map((kid, i) => (
                      <motion.div key={kid} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
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
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3">This Week&apos;s Menu</h2>
                  {drafts.length === 0 ? (
                    <p className="text-sm text-[#9CA3AF] text-center py-4">Sous Chef Alexis hasn&apos;t submitted the menu yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {Array.from({ length: 7 }, (_, day) => {
                        const lunch = draftMap.get(day);
                        const dinner = draftMap.get(day + 7);
                        return (
                          <div key={day} className="py-1.5 border-b border-[#F3F4F6] last:border-0">
                            <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">{DAY_SHORTS[day]}</p>
                            <div className="flex gap-2">
                              {[{ slot: lunch, label: '☀️' }, { slot: dinner, label: '🌙' }].map(({ slot, label }, si) => (
                                <div key={si} className="flex-1 flex items-center gap-1.5 min-w-0">
                                  <span className="text-xs">{label}</span>
                                  {slot?.food_card ? (
                                    <>
                                      <span className="text-sm">{slot.food_card.emoji}</span>
                                      <span className="text-xs font-semibold text-[#1a1a1a] truncate">{slot.food_card.name}</span>
                                    </>
                                  ) : (
                                    <span className="text-xs text-[#D1D5DB] italic">—</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent activity */}
                {activity.length > 0 && (
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-3">Recent Activity</h2>
                    <div className="space-y-2">
                      {activity.map((record, i) => {
                        const s = STATUS_LABELS[record.status];
                        return (
                          <motion.div key={record.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 py-1">
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
              </motion.div>
            ) : (
              <motion.div
                key="cards"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4 pb-8"
              >
                {/* Add card button */}
                <button
                  onClick={() => setShowAddForm(v => !v)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#2D8B6E] text-[#2D8B6E] font-bold text-sm hover:bg-green-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {showAddForm ? 'Cancel' : 'Add new food card'}
                </button>

                {/* Add form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white rounded-2xl border border-[#E5E7EB] p-4 space-y-3 overflow-hidden"
                    >
                      <h3 className="font-black text-[#1a1a1a] text-sm">New Food Card</h3>
                      <div className="flex gap-2">
                        <input
                          value={newEmoji}
                          onChange={e => setNewEmoji(e.target.value)}
                          className="w-14 text-center text-2xl border border-[#E5E7EB] rounded-xl py-2"
                          maxLength={4}
                        />
                        <input
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          placeholder="Dish name"
                          className="flex-1 border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2D8B6E]"
                        />
                      </div>
                      <input
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                        placeholder="Short description (optional)"
                        className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8B6E]"
                      />
                      <div className="flex gap-2">
                        {TIER_OPTIONS.map(t => {
                          const m = TIER_META[t];
                          return (
                            <button
                              key={t}
                              onClick={() => setNewTier(t)}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                newTier === t ? `${m.color} ${m.border}` : 'bg-white border-[#E5E7EB] text-[#6B7280]'
                              }`}
                            >
                              {m.emoji}<br />{m.label}<br />{m.points}pt
                            </button>
                          );
                        })}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAddCard}
                        disabled={!newName.trim() || addingSaving}
                        className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
                          newName.trim() ? 'bg-[#2D8B6E] text-white' : 'bg-[#F3F4F6] text-[#9CA3AF]'
                        }`}
                      >
                        {addingSaving ? 'Adding…' : 'Add Card'}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Cards list */}
                <div className="space-y-2">
                  {(['legendary', 'epic', 'rare', 'common'] as Tier[]).map(tier => {
                    const cards = allCards.filter(c => c.tier === tier);
                    if (!cards.length) return null;
                    const m = TIER_META[tier];
                    return (
                      <div key={tier}>
                        <p className="text-xs font-black uppercase tracking-widest text-[#6B7280] mb-2 px-1">
                          {m.emoji} {m.label} · {m.points}pts
                        </p>
                        <div className="space-y-2">
                          {cards.map(card => (
                            <motion.div
                              key={card.id}
                              layout
                              className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${m.color} ${m.border} ${!card.is_active ? 'opacity-40' : ''}`}
                            >
                              <span className="text-2xl">{card.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-[#1a1a1a] text-sm">{card.name}</p>
                                {card.description && (
                                  <p className="text-xs text-[#6B7280] truncate">{card.description}</p>
                                )}
                              </div>
                              <button
                                onClick={() => handleToggleActive(card)}
                                className="flex-shrink-0"
                                title={card.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {card.is_active
                                  ? <ToggleRight className="w-7 h-7 text-[#2D8B6E]" />
                                  : <ToggleLeft className="w-7 h-7 text-[#9CA3AF]" />
                                }
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
