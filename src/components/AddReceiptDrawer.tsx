'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import {
  Receipt, StoreType, STORE_META,
  addReceipt, getWeekStart, todayLocal,
} from '@/lib/supabase';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: (receipt: Receipt) => void;
}

const STORE_TYPES: StoreType[] = ['ntuc', 'bakery', 'market', 'other'];

type DateOption = 'today' | 'yesterday' | 'custom';

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AddReceiptDrawer({ open, onClose, onAdded }: Props) {
  const [store, setStore] = useState<StoreType>('ntuc');
  const [dateOpt, setDateOpt] = useState<DateOption>('today');
  const [customDate, setCustomDate] = useState(todayLocal());
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const resolvedDate =
    dateOpt === 'today'     ? todayLocal()   :
    dateOpt === 'yesterday' ? getYesterday() :
    customDate;

  const handleAdd = async () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const r = await addReceipt({
        week_start: getWeekStart(new Date(resolvedDate + 'T00:00:00')),
        store_type: store,
        amount: num,
        purchased_at: resolvedDate,
      });
      onAdded(r);
      // reset
      setAmount('');
      setDateOpt('today');
      setStore('ntuc');
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold text-[#0A0A0A]">Add Receipt</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-8 space-y-5">

          {/* Store type */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
              Store
            </p>
            <div className="grid grid-cols-4 gap-2">
              {STORE_TYPES.map((s) => {
                const meta = STORE_META[s];
                const active = store === s;
                return (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setStore(s)}
                    className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? `${meta.bg} ${meta.text} ring-2 ring-offset-1 ring-current`
                        : 'bg-[#F3F4F6] text-[#6B7280]'
                    }`}
                  >
                    {meta.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
              Date
            </p>
            <div className="flex gap-2">
              {(['today', 'yesterday', 'custom'] as DateOption[]).map((opt) => (
                <motion.button
                  key={opt}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setDateOpt(opt)}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold capitalize transition-colors ${
                    dateOpt === opt
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#F3F4F6] text-[#6B7280]'
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
            {dateOpt === 'custom' && (
              <input
                type="date"
                value={customDate}
                max={todayLocal()}
                onChange={(e) => setCustomDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            )}
          </div>

          {/* Amount */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
              Amount (SGD)
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#2563EB]">
              <span className="text-lg font-semibold text-[#6B7280]">$</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                min={0}
                step={0.01}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-2xl font-bold text-[#0A0A0A] focus:outline-none bg-transparent"
                autoFocus
              />
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
          </div>

          {/* Add button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            disabled={saving || !amount}
            className="w-full rounded-2xl bg-[#2563EB] py-4 text-base font-bold text-white disabled:opacity-50 transition-opacity"
          >
            {saving ? 'Saving…' : 'Add Receipt'}
          </motion.button>

        </div>
      </DrawerContent>
    </Drawer>
  );
}
