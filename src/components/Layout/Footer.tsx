'use client';

import Link from 'next/link';
import { Sparkles, Github, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-green" />
              <span className="font-bold">Garden Horizons Tools</span>
            </div>

            {/* Links Row 1 */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted">
              <Link href="/privacy" className="hover:text-accent-green transition-colors">
                Privacy Policy
              </Link>
              <span className="text-border">|</span>
              <Link href="/terms" className="hover:text-accent-green transition-colors">
                Terms of Service
              </Link>
              <span className="text-border">|</span>
              <Link href="/disclaimer" className="hover:text-accent-green transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>

          {/* Links Row 2 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <Link href="/cookies" className="hover:text-accent-green transition-colors">
                Cookie Settings
              </Link>
              <span className="text-border">|</span>
              <Link href="/support" className="hover:text-accent-green transition-colors">
                Support
              </Link>
              <span className="text-border">|</span>
              <Link href="/faq" className="hover:text-accent-green transition-colors">
                FAQ
              </Link>
            </div>

            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-accent-green transition-colors flex items-center gap-1 text-sm text-text-muted"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
            {/* Copyright */}
            <div>
              © {currentYear} Garden Horizons Tools. All rights reserved.
            </div>

            {/* Disclaimer */}
            <div className="text-center md:text-right max-w-md">
              <p>
                This is an unofficial tool. Not affiliated with Garden Horizons or Roblox.
              </p>
            </div>
          </div>

          {/* Made with love */}
          <div className="flex justify-center items-center gap-1 text-xs text-text-muted pt-2">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-accent-rose fill-accent-rose" />
            <span>for Garden Horizons players</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
