"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatCard({ label, value, className = "" }: StatCardProps) {
  return (
    <div className={`bg-card rounded-lg p-4 ${className}`}>
      <div className="text-mutedText text-xs font-medium mb-2">
        {label}
      </div>
      <div className="text-white text-2xl font-bold">
        {value}
      </div>
    </div>
  );
}