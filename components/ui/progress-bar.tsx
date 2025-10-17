"use client";

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
}

export function ProgressBar({ current, max, label }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full">
      {label && (
        <div className="text-xs text-mutedText mb-2 font-medium">
          {label}
        </div>
      )}
      <div className="h-2 bg-line rounded-full overflow-hidden">
        <div
          className="h-full bg-baseBlue transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-mutedText mt-2 text-right font-mono">
        {current}/{max}
      </div>
    </div>
  );
}