'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const PROFILES = [
  {
    href: '/chef',
    emoji: '👨‍🍳',
    name: 'Sous Chef Alexis',
    subtitle: "Plan today's meals",
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    accent: 'text-amber-700',
  },
  {
    href: '/critic',
    emoji: '⭐',
    name: 'Critic Aleric',
    subtitle: "Rate tonight's dish",
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    accent: 'text-yellow-700',
  },
  {
    href: '/adventurer',
    emoji: '🌟',
    name: 'Adventurer Axel',
    subtitle: 'Try something new today',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    accent: 'text-purple-700',
  },
  {
    href: '/parent',
    emoji: '🏠',
    name: 'Parent',
    subtitle: 'See the family overview',
    bg: 'bg-teal-50',
    border: 'border-teal-300',
    accent: 'text-teal-700',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] px-5 pt-12 pb-28">
      <div className="mb-10 text-center">
        <p className="text-5xl mb-3">🍳</p>
        <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight">Oikos Kitchen</h1>
        <p className="text-sm text-[#6B7280] mt-1">Who are you today?</p>
      </div>

      <div className="space-y-3">
        {PROFILES.map(({ href, emoji, name, subtitle, bg, border, accent }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <Link href={href}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${bg} ${border} shadow-sm cursor-pointer`}
              >
                <span className="text-4xl">{emoji}</span>
                <div className="flex-1">
                  <p className="font-black text-[#1a1a1a] text-lg leading-tight">{name}</p>
                  <p className={`text-sm font-medium mt-0.5 ${accent}`}>{subtitle}</p>
                </div>
                <span className="text-[#9CA3AF] text-xl font-bold">›</span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
