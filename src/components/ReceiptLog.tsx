'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Receipt, STORE_META, deleteReceipt } from '@/lib/supabase';

interface Props {
  receipts: Receipt[];
  onDeleted: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const yestStr  = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (dateStr === todayStr)  return 'Today';
  if (dateStr === yestStr)   return 'Yesterday';

  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function ReceiptLog({ receipts, onDeleted }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteReceipt(id);
      onDeleted(id);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  if (receipts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white py-8 text-center">
        <p className="text-sm text-[#6B7280]">No receipts yet this week.</p>
        <p className="mt-0.5 text-xs text-[#9CA3AF]">Tap + to add the first one.</p>
      </div>
    );
  }

  // Group by date
  const groups = receipts.reduce<Record<string, Receipt[]>>((acc, r) => {
    const key = r.purchased_at;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => (
        <div key={date}>
          <p className="mb-1.5 text-xs font-semibold text-[#6B7280]">{formatDate(date)}</p>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
            <AnimatePresence>
              {groups[date].map((r, idx) => {
                const meta = STORE_META[r.store_type];
                const isDeleting = deleting === r.id;
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {idx > 0 && <div className="mx-4 h-px bg-[#F3F4F6]" />}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${meta.bg} ${meta.text}`}
                      >
                        {meta.label}
                      </span>
                      <p className="flex-1 text-sm font-medium text-[#0A0A0A]">
                        {r.store_name || meta.label}
                      </p>
                      <span className="text-sm font-bold text-[#0A0A0A]">
                        ${r.amount.toFixed(2)}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => r.id && handleDelete(r.id)}
                        disabled={isDeleting}
                        className="ml-1 shrink-0 rounded-lg p-1.5 text-[#D1D5DB] hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
