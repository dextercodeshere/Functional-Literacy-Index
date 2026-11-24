import React from 'react';
import FactsExplorer from '../../components/FactsExplorer';
import { BarChart3, Calculator, PieChart, Sparkles, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "India in Numbers — Interactive Data Journalism & Statistics",
  description: "Understand India through demographic statistics, mobility data, urban metrics, and step-by-step mathematical calculations.",
};

export default function InteractiveFactsPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Editorial Header Banner - Inspired by Reference Images */}
      <div className="rounded-3xl lg:rounded-[3rem] bg-gradient-to-br from-[#0A4D5C] via-[#09414E] to-[#0A192F] text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-teal-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-emerald-300">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visual Data Journalism • V1 Platform</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            India in <span className="font-normal italic text-teal-200">Numbers</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-teal-100/90 font-normal leading-relaxed">
            Understand the country through numbers, comparisons and interactive data. Every statistic features an open mathematical breakdown, methodology, and live calculator.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-teal-200/80 relative z-10">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>"Show the Mathematics" Step-by-Step Formulas</span>
          </div>
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-300" />
            <span>Interactive Demographic & Mobility Simulations</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Strictly Verified Baseline Calculations</span>
          </div>
        </div>
      </div>

      {/* Main Facts Explorer */}
      <FactsExplorer />
    </div>
  );
}
