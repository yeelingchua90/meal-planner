'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getKidPoints } from '@/lib/supabase';

interface Profile {
  href: string;
  emoji: string;
  name: string;
  subtitle: string;
  bg: string;
  border: string;
  accent: string;
  pointsKey?: 'Alexis' | 'Aleric' | 'Axel';
  pattern?: string;
}

const PROFILES: Profile[] = [
  {
    href: '/chef',
    emoji: '👨‍🍳',
    name: 'Sous Chef Alexis',
    subtitle: "Plan today's meals",
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    accent: 'text-amber-700',
    pointsKey: 'Alexis',
    pattern: 'chef',
  },
  {
    href: '/critic',
    emoji: '⭐',
    name: 'Critic Aleric',
    subtitle: "Rate tonight's dish",
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    accent: 'text-yellow-700',
    pointsKey: 'Aleric',
    pattern: 'critic',
  },
  {
    href: '/adventurer',
    emoji: '🌟',
    name: 'Adventurer Axel',
    subtitle: 'Try something new today',
    bg: 'bg-purple-50',
    border: 'border-purple-400',
    accent: 'text-purple-700',
    pointsKey: 'Axel',
    pattern: 'adventurer',
  },
  {
    href: '/parent',
    emoji: '🏠',
    name: 'Parent View',
    subtitle: 'Overview & manage cards',
    bg: 'bg-teal-50',
    border: 'border-teal-400',
    accent: 'text-teal-700',
  },
];

const GRADIENT_BG: Record<string, string> = {
  chef:       'from-amber-400/20 to-orange-300/10',
  critic:     'from-yellow-400/20 to-amber-300/10',
  adventurer: 'from-purple-400/20 to-pink-300/10',
};

export default function HomePage() {
  const [points, setPoints] = useState<Record<string, number>>({ Alexis: 0, Aleric: 0, Axel: 0 });
  const [loadedPts, setLoadedPts] = useState(false);

  useEffect(() => {
    Promise.all([
      getKidPoints('Alexis'),
      getKidPoints('Aleric'),
      getKidPoints('Axel'),
    ]).then(([a, b, c]) => {
      setPoints({ Alexis: a, Aleric: b, Axel: c });
      setLoadedPts(true);
    }).catch(() => {
      // Fail silently — points just show 0
      setLoadedPts(true);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-5 pt-12 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <motion.p
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="text-6xl mb-3"
        >
          🍳
        </motion.p>
        <div className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full px-3 py-1 mb-2 shadow-sm">
          <span className="text-xs font-black tracking-widest text-[#2D8B6E] uppercase">Oikos Kitchen</span>
        </div>
        <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight">Who are you today?</h1>
        <p className="text-sm text-[#6B7280] mt-1">{new Date().toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </motion.div>

      <div className="space-y-3">
        {PROFILES.map(({ href, emoji, name, subtitle, bg, border, accent, pointsKey, pattern }, i) => {
          const kidPoints = pointsKey ? points[pointsKey] : null;
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <Link href={href}>
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.01 }}
                  className={`relative flex items-center gap-4 p-5 rounded-3xl border-2 ${bg} ${border} shadow-sm cursor-pointer overflow-hidden`}
                >
                  {/* Gradient overlay for kid profiles */}
                  {pattern && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENT_BG[pattern]} pointer-events-none`} />
                  )}

                  {/* Big emoji */}
                  <motion.span
                    whileHover={{ scale: 1.1, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="text-5xl relative z-10 flex-shrink-0"
                  >
                    {emoji}
                  </motion.span>

                  <div className="flex-1 relative z-10 min-w-0">
                    <p className="font-black text-[#1a1a1a] text-xl leading-tight">{name}</p>
                    <p className={`text-sm font-semibold mt-0.5 ${accent}`}>{subtitle}</p>
                  </div>

                  {/* Points badge for kids */}
                  {pointsKey && loadedPts && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.08 + 0.3, type: 'spring', stiffness: 400 }}
                      className="flex-shrink-0 relative z-10 text-right"
                    >
                      <div className={`bg-white/80 border ${border} rounded-2xl px-3 py-1.5 text-center min-w-[56px]`}>
                        <p className="text-lg font-black text-[#1a1a1a] leading-none">{kidPoints}</p>
                        <p className={`text-[10px] font-bold ${accent} leading-none mt-0.5`}>pts</p>
                      </div>
                    </motion.div>
                  )}

                  {!pointsKey && (
                    <span className="text-[#9CA3AF] text-2xl font-bold relative z-10">›</span>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Total points footer */}
      {loadedPts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center"
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] mb-1">Team Points</p>
          <p className="text-2xl font-black text-[#2D8B6E]">
            {points.Alexis + points.Aleric + points.Axel} pts total
          </p>
        </motion.div>
      )}
    </div>
  );
}
