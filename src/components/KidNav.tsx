'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const KID_TABS = [
  { href: '/chef',       label: 'Chef',       emoji: '👨‍🍳' },
  { href: '/critic',     label: 'Critic',     emoji: '⭐' },
  { href: '/adventurer', label: 'Adventurer', emoji: '🌟' },
  { href: '/parent',     label: 'Parent',     emoji: '🏠' },
];

export function KidNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 px-4 py-2 bg-white border-b border-[#E5E7EB] overflow-x-auto">
      {KID_TABS.map(({ href, label, emoji }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href} className="flex-shrink-0">
            <motion.div
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[#F5B731] text-[#1a1a1a]'
                  : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
