'use client';

// Ripple Effect
export function createRipple(event: React.MouseEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const ripple = document.createElement('span');
  ripple.className = 'absolute rounded-full bg-[#0052FF]/40 pointer-events-none';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.width = '10px';
  ripple.style.height = '10px';
  ripple.style.animation = 'ripple-animation 0.6s ease-out';
  
  element.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// Particle Burst Effect
export function createParticleBurst(event: React.MouseEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('span');
    particle.className = 'absolute w-1.5 h-1.5 bg-[#0052FF] rounded-full pointer-events-none';
    
    const angle = (Math.PI * 2 * i) / 12;
    const velocity = 50 + Math.random() * 30;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.animation = 'particle-float 1s ease-out forwards';
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    particle.style.animationDelay = (i * 30) + 'ms';
    
    element.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000 + (i * 30));
  }
}

// Sparkle Effect
export function createSparkles(element: HTMLElement) {
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'absolute w-1 h-1 bg-[#FFD700] rounded-full pointer-events-none';
    sparkle.style.boxShadow = '0 0 10px #FFD700';
    
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 60 + Math.random() * 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    sparkle.style.left = '50%';
    sparkle.style.top = '50%';
    sparkle.style.animation = 'sparkle-float 1.5s ease-out forwards';
    sparkle.style.setProperty('--tx', tx + 'px');
    sparkle.style.setProperty('--ty', ty + 'px');
    sparkle.style.animationDelay = (i * 50) + 'ms';
    
    element.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1500 + (i * 50));
  }
}