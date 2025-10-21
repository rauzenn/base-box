'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Clock, Unlock, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/capsules', icon: Package, label: 'Capsules' },
    { href: '/create', icon: Clock, label: 'Create' },
    { href: '/reveals', icon: Unlock, label: 'Reveals' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/98 backdrop-blur-xl border-t border-[#0052FF]/20 z-50 safe-area-inset-bottom">
      <div className="max-w-screen-xl mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 transition-all min-w-[60px] ${
                  isActive ? 'text-[#0052FF]' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 transition-all ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-bold ${
                  isActive ? 'text-[#0052FF]' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}