"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, HourglassIcon, Unlock, UserCircle } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/capsules", icon: Box, label: "Capsules" },
  { href: "/create", icon: HourglassIcon, label: "Create" },
  { href: "/reveals", icon: Unlock, label: "Reveals" },
  { href: "/profile", icon: UserCircle, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-[#0052FF]/20">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive
                    ? "text-[#0052FF]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "drop-shadow-[0_0_8px_rgba(0,82,255,0.6)]" : ""
                  }`}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}