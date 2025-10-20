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
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-[#0052FF]/20 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all ${
                  isActive ? 'text-[#0052FF]' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon 
                  className={`w-6 h-6 transition-all ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-xs font-bold ${
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