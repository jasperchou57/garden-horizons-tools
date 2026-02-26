'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Calculator, Leaf, Save, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Planner', icon: Sprout },
  { href: '/calculator', label: 'Calc', icon: Calculator },
  { href: '/plants', label: 'Plants', icon: Leaf },
  { href: '/plans', label: 'Plans', icon: Save },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors
                  ${isActive 
                    ? 'text-accent-green' 
                    : 'text-text-muted'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for fixed bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  );
}
