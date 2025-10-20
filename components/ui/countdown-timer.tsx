'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  unlockDate: string;
  compact?: boolean;
}

export function CountdownTimer({ unlockDate, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(unlockDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsReady(true);
        return 'Ready to reveal! 🎉';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockDate]);

  if (compact) {
    return (
      <span className={`font-bold ${isReady ? 'text-[#00D395] animate-pulse' : 'text-[#0052FF]'}`}>
        {timeLeft}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isReady ? 'text-[#00D395]' : 'text-[#0052FF]'}`}>
      <Clock className="w-5 h-5" />
      <span className="font-bold text-lg">{timeLeft}</span>
    </div>
  );
}