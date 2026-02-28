'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarDays, ShoppingCart, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Plan', Icon: CalendarDays },
  { href: '/shopping', label: 'Shopping', Icon: ShoppingCart },
  { href: '/recipes', label: 'Recipes', Icon: BookOpen },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white pb-safe">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5">
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="flex flex-col items-center gap-0.5"
              >
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'
                  }`}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
