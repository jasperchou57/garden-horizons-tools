'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Calculator, Leaf, Gift, Save, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Planner', icon: Sprout },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/plants', label: 'Plants', icon: Leaf },
  { href: '/mutations', label: 'Mutations', icon: Sparkles },
  { href: '/codes', label: 'Codes', icon: Gift },
  { href: '/plans', label: 'My Plans', icon: Save },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent-green flex items-center justify-center">
              <Sprout className="w-4 h-4 text-background" />
            </div>
            <span className="font-bold text-foreground">
              Garden Horizons <span className="text-accent-green">Tools</span>
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-accent-green/20 text-accent-green' 
                      : 'text-text-muted hover:text-foreground'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Version Info */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="hidden sm:inline">Data v1.0</span>
            <span className="hidden sm:inline">•</span>
            <span>{27} Plants</span>
            <span>•</span>
            <span>{11} Mutations</span>
          </div>
        </div>
      </div>
    </header>
  );
}
