'use client';

import { useEffect, useState } from 'react';

// Ripple Effect Hook
export const useRipple = () => {
  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = event.clientX - rect.left - 10 + 'px';
    ripple.style.top = event.clientY - rect.top - 10 + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  };
  
  return createRipple;
};

// Sparkle Effect
export const createSparkles = (element: HTMLElement, count: number = 12) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const sparkleEmojis = ['✨', '⭐', '💫', '🌟'];
  
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    
    const angle = (i / count) * Math.PI * 2;
    const distance = 60 + Math.random() * 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    sparkle.style.setProperty('--tx', `${tx}px`);
    sparkle.style.setProperty('--ty', `${ty}px`);
    sparkle.style.left = centerX + 'px';
    sparkle.style.top = centerY + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1500);
  }
};

// Particle Burst
export const createParticleBurst = (
  element: HTMLElement,
  color: string = '#0052FF',
  count: number = 16
) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.backgroundColor = color;
    
    const angle = (i / count) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    const px = Math.cos(angle) * distance;
    const py = Math.sin(angle) * distance;
    
    particle.style.setProperty('--px', `${px}px`);
    particle.style.setProperty('--py', `${py}px`);
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
  }
};

// Energy Wave
export const createEnergyWave = (element: HTMLElement) => {
  const wave = document.createElement('div');
  wave.className = 'energy-wave';
  element.style.position = 'relative';
  element.appendChild(wave);
  
  setTimeout(() => wave.remove(), 1000);
};

// Confetti
export const createConfetti = (count: number = 50) => {
  const colors = ['#0052FF', '#00D395', '#FFB800', '#FF0080', '#00FFFF'];
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
  }
};

// Reveal Animation Sequence
export const playRevealAnimation = (element: HTMLElement) => {
  // 1. Shake
  element.classList.add('lock-shake');
  setTimeout(() => element.classList.remove('lock-shake'), 500);
  
  // 2. Glow Pulse (starts immediately)
  element.classList.add('glow-pulse');
  
  // 3. Particle Burst (at 0.3s)
  setTimeout(() => {
    createParticleBurst(element, '#00D395', 16);
  }, 300);
  
  // 4. Unlock Rotation (at 0.5s)
  setTimeout(() => {
    element.classList.add('unlock-rotate');
    setTimeout(() => element.classList.remove('unlock-rotate'), 800);
  }, 500);
  
  // 5. Sparkle Explosion (at 0.8s)
  setTimeout(() => {
    createSparkles(element, 12);
  }, 800);
  
  // 6. Energy Wave (at 1s)
  setTimeout(() => {
    createEnergyWave(element);
  }, 1000);
  
  // 7. Confetti (at 1.2s)
  setTimeout(() => {
    createConfetti(30);
  }, 1200);
  
  // Remove glow pulse (at 2s)
  setTimeout(() => {
    element.classList.remove('glow-pulse');
  }, 2000);
};

// Toast Notification Component
export const Toast = ({ 
  message, 
  type = 'success',
  onClose 
}: { 
  message: string; 
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const colors = {
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-pink-500',
    info: 'from-blue-500 to-cyan-500'
  };
  
  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`px-6 py-4 bg-gradient-to-r ${colors[type]} rounded-xl shadow-2xl flex items-center gap-3`}>
        {type === 'success' && (
          <svg className="w-6 h-6 text-white checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
        <p className="text-white font-bold">{message}</p>
      </div>
    </div>
  );
};

// Number Counter Animation
export const useCountUp = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const startValue = 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(startValue + (end - startValue) * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return count;
};

// Loading Skeleton
export const Skeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`skeleton rounded-lg ${className}`} />
  );
};