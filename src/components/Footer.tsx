import React from 'react';
import NextLink from 'next/link';
import { BookOpen, Sparkles, BarChart3, Shield, Info, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A192F] text-[#E2E8F0] pt-16 pb-12 border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[#1E293B]">
          {/* Brand & Mandate */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0A4D5C] text-white flex items-center justify-center font-serif font-bold text-lg border border-teal-400/30">
                <span>आई</span>
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                India<span className="font-normal italic text-teal-300">Literacy</span> Platform
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md">
              An independent, public knowledge and statistical research initiative assessing functional everyday comprehension, quantitative reasoning, and data literacy across India.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2744] border border-[#1E3A8A] text-xs text-amber-300 font-medium">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Independent Platform • Not affiliated with any government agency</span>
            </div>
          </div>

          {/* Platform Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-300 font-sans">
              Platform Areas
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li>
                <NextLink href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Literacy Survey (V1)</span>
                </NextLink>
              </li>
              <li>
                <NextLink href="/explore" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explore India Trivia</span>
                </NextLink>
              </li>
              <li>
                <NextLink href="/facts" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                  <span>India in Numbers (Data)</span>
                </NextLink>
              </li>
              <li>
                <NextLink href="/admin" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Administrator Portal</span>
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Research & Privacy Commitment */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-300 font-sans">
              Methodology & Privacy
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              We collect zero personal identifiable information (PII). No names, phone numbers, or email addresses are stored. All assessment data is strictly anonymised by broad administrative district.
            </p>
            <div className="text-xs text-[#64748B]">
              Framework inspired by international adult competency standards (Level 1 Foundation through Level 5 Master Interpreter).
            </div>
          </div>
        </div>

        {/* Bottom Banner & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>
            © {new Date().getFullYear()} India Literacy, Knowledge & Data Platform. V1 Release.
          </p>
          <div className="flex items-center gap-6">
            <span>Built for Public Good</span>
            <span>Open Research Framework</span>
            <span className="text-emerald-400">140 Questions Across Sets A, B, C & D</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
