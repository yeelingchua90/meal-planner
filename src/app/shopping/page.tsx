'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { BudgetBar } from '@/components/BudgetBar';
import { ShoppingList } from '@/components/ShoppingList';
import { AddReceiptDrawer } from '@/components/AddReceiptDrawer';
import { ReceiptLog } from '@/components/ReceiptLog';
import {
  Receipt, StoreType, STORE_META,
  getReceipts, getWeekStart,
} from '@/lib/supabase';

const WEEKLY_BUDGET = 200;

function getWeekDateRange(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(now);
  mon.setDate(now.getDate() + diff);
  const sat = new Date(mon);
  sat.setDate(mon.getDate() + 5);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
  return `${fmt(mon)} – ${fmt(sat)}`;
}

const STORE_ORDER: StoreType[] = ['ntuc', 'bakery', 'market', 'other'];

export default function BudgetPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);
  const [dbError, setDbError] = useState(false);

  const weekStart = getWeekStart();
  const spent = receipts.reduce((s, r) => s + r.amount, 0);

  const byStore = STORE_ORDER.reduce<Record<StoreType, number>>((acc, s) => {
    acc[s] = receipts.filter((r) => r.store_type === s).reduce((t, r) => t + r.amount, 0);
    return acc;
  }, { ntuc: 0, bakery: 0, market: 0, other: 0 });

  useEffect(() => {
    getReceipts(weekStart)
      .then(setReceipts)
      .catch(() => setDbError(true))
      .finally(() => setLoading(false));
  }, [weekStart]);

  return (
    <div className="px-4 pt-6 pb-28">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-[#2563EB]" />
          <h1 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">Budget</h1>
        </div>
        <p className="mt-0.5 text-sm text-[#6B7280]">{getWeekDateRange()}</p>
      </div>

      {/* Budget card */}
      <div className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#0A0A0A]">Weekly Budget</span>
          <span className="text-sm font-bold text-[#0A0A0A]">SGD {WEEKLY_BUDGET}</span>
        </div>
        <BudgetBar spent={spent} budget={WEEKLY_BUDGET} />

        {/* Store breakdown */}
        <div className="mt-4 flex flex-wrap gap-2">
          {STORE_ORDER.map((s) => {
            const meta = STORE_META[s];
            const amt = byStore[s];
            return (
              <span
                key={s}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${meta.bg} ${meta.text} ${
                  amt === 0 ? 'opacity-40' : ''
                }`}
              >
                {meta.label} ${amt.toFixed(2)}
              </span>
            );
          })}
        </div>
      </div>

      {/* DB setup warning */}
      {dbError && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">Database table not set up yet</p>
          <p className="mt-0.5 text-xs text-amber-700">
            Run <code className="font-mono">supabase/migrations/002_receipts.sql</code> in the Supabase SQL editor to enable receipt tracking.
          </p>
        </div>
      )}

      {/* Receipts section */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
          Receipts this week
        </p>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-[#F3F4F6]" />
            ))}
          </div>
        ) : (
          <ReceiptLog
            receipts={receipts}
            onDeleted={(id) => setReceipts((prev) => prev.filter((r) => r.id !== id))}
          />
        )}
      </div>

      {/* Collapsible planned shopping list */}
      <div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setListExpanded((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3"
        >
          <span className="text-sm font-semibold text-[#0A0A0A]">Planned shopping list</span>
          {listExpanded
            ? <ChevronUp className="h-4 w-4 text-[#6B7280]" />
            : <ChevronDown className="h-4 w-4 text-[#6B7280]" />}
        </motion.button>
        {listExpanded && (
          <div className="mt-3">
            <ShoppingList budget={WEEKLY_BUDGET} />
          </div>
        )}
      </div>

      {/* FAB — Add Receipt */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB] shadow-lg shadow-blue-200"
      >
        <Plus className="h-6 w-6 text-white" />
      </motion.button>

      <AddReceiptDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdded={(r) => setReceipts((prev) => [r, ...prev])}
      />
    </div>
  );
}
