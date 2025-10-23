'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Package, PlusCircle, Unlock, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/', 
      icon: Home, 
      label: 'Home',
      isActive: pathname === '/'
    },
    { 
      href: '/capsules', 
      icon: Package, 
      label: 'Capsules',
      isActive: pathname === '/capsules'
    },
    { 
      href: '/create', 
      icon: PlusCircle, 
      label: 'Create',
      isActive: pathname === '/create',
      isSpecial: true
    },
    { 
      href: '/reveals', 
      icon: Unlock, 
      label: 'Reveals',
      isActive: pathname === '/reveals'
    },
    { 
      href: '/profile', 
      icon: User, 
      label: 'Profile',
      isActive: pathname === '/profile'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0A0E14]/95 backdrop-blur-md border-t-2 border-[#0052FF]/20 z-50 safe-area-bottom">
      <div className="h-full flex items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all scale-hover relative ${
                item.isActive 
                  ? 'text-[#0052FF]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {/* Active indicator */}
              {item.isActive && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-slide-up" />
              )}

              {/* Icon with special styling for Create button */}
              <div className={`relative ${
                item.isSpecial && item.isActive
                  ? 'w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/50 -mt-4 pulse'
                  : 'w-6 h-6'
              }`}>
                <Icon className={item.isSpecial && item.isActive ? 'w-6 h-6' : 'w-6 h-6'} />
              </div>

              {/* Label */}
              <span className={`text-xs font-bold ${
                item.isActive ? 'text-[#0052FF]' : ''
              }`}>
                {item.label}
              </span>

              {/* Ripple effect on tap */}
              {item.isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-[#0052FF]/30 animate-ping" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}