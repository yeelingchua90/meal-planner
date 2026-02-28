'use client';

interface MacroBarProps {
  protein: number;
  carbs: number;
  fat: number;
  className?: string;
}

export function MacroBar({ protein, carbs, fat, className = '' }: MacroBarProps) {
  const total = protein + carbs + fat;
  if (total === 0) return null;

  const pPct = (protein / total) * 100;
  const cPct = (carbs / total) * 100;
  const fPct = (fat / total) * 100;

  return (
    <div className={`flex h-1.5 w-full overflow-hidden rounded-full ${className}`}>
      <div
        style={{ width: `${pPct}%` }}
        className="bg-blue-500"
        title={`Protein ${protein}g`}
      />
      <div
        style={{ width: `${cPct}%` }}
        className="bg-amber-400"
        title={`Carbs ${carbs}g`}
      />
      <div
        style={{ width: `${fPct}%` }}
        className="bg-rose-400"
        title={`Fat ${fat}g`}
      />
    </div>
  );
}
