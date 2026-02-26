'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Calculator, Leaf, Gift, ChevronRight, Save, HelpCircle } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Planner', icon: Sprout },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/plants', label: 'Plants', icon: Leaf },
  { href: '/mutations', label: 'Mutations', icon: Leaf },
  { href: '/codes', label: 'Codes', icon: Gift },
  { href: '/plans', label: 'My Plans', icon: Save },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-accent-green/20 flex items-center justify-center group-hover:bg-accent-green/30 transition-colors">
              <Sprout className="w-5 h-5 text-accent-green" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              Garden Horizons <span className="text-accent-green">Tools</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-accent-green/20 text-accent-green' 
                      : 'text-text-muted hover:text-foreground hover:bg-surface-highlight'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
