'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { BookOpen, Sparkles, BarChart3, ShieldCheck, Menu, X, Globe, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Literacy Survey', href: '/', icon: BookOpen, badge: 'V1 Core' },
    { label: 'Explore India', href: '/explore', icon: Sparkles, badge: 'Trivia' },
    { label: 'Interactive Facts', href: '/facts', icon: BarChart3, badge: 'Data Journalism' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-[#EAE7DF] transition-all">
      {/* Top micro bar for independent research platform disclaimer */}
      <div className="bg-[#0A192F] text-[#E2E8F0] text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
        <span>Independent National Research & Data Platform</span>
        <span className="opacity-40">•</span>
        <span className="text-[#94A3B8]">Public Knowledge & Adult Skills Initiative</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <NextLink href="/" className="flex items-center gap-3.5 group">
            {/* Geometric horizontal cylinder / oval emblem */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0A4D5C] to-[#0A192F] flex items-center justify-center shadow-sm border border-[#0A4D5C]/30 text-white font-serif font-bold text-lg tracking-wider transition-transform group-hover:scale-105">
              <span>आई</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-editorial text-2xl font-bold tracking-tight text-[#0A192F]">
                  India<span className="font-normal italic text-[#0A4D5C]">Literacy</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-100/80 text-amber-900 border border-amber-200/60">
                  Platform
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium tracking-wide">
                Assessment, Trivia & Statistics
              </p>
            </div>
          </NextLink>

          {/* Desktop Navigation - Horizontal oval cylinder capsules */}
          <nav className="hidden md:flex items-center p-1.5 bg-[#F0EDE6] rounded-full border border-[#E2DED5] shadow-inner">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[#0A192F] text-white shadow-soft-pill font-semibold'
                      : 'text-[#475569] hover:text-[#0A192F] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5"></span>
                  )}
                </NextLink>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <NextLink
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#CBD5E1] bg-white text-[#334155] text-xs font-semibold hover:border-[#0A192F] hover:text-[#0A192F] transition-all shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0A4D5C]" />
              <span>Admin Portal</span>
            </NextLink>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-[#F0EDE6] text-[#0A192F] hover:bg-[#E5E1D8] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2DED5] bg-[#FBFBF9] px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#0A192F] text-white font-semibold'
                      : 'bg-white border border-[#E2DED5] text-[#334155]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-[#64748B]'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </NextLink>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-[#EAE7DF]">
            <NextLink
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[#CBD5E1] bg-white text-[#334155] text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0A4D5C]" />
              <span>Admin Control Center</span>
            </NextLink>
          </div>
        </div>
      )}
    </header>
  );
}
