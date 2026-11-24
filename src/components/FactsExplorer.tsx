'use client';

import React, { useState, useEffect } from 'react';
import { FactCard } from '@/lib/types';
import { Calculator, ArrowRight, ExternalLink, HelpCircle, Check, Info, Sliders, ChevronDown, ChevronUp, Sparkles, TrendingUp } from 'lucide-react';

export default function FactsExplorer() {
  const [facts, setFacts] = useState<FactCard[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Math inspector state
  const [activeMathCardId, setActiveMathCardId] = useState<number | null>(null);
  const [interactiveInputs, setInteractiveInputs] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadFacts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/facts?category=${encodeURIComponent(selectedCategory)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setFacts(json.data.facts);
          if (json.data.categories) {
            setCategories(json.data.categories);
          }
        }
      } catch (e) {
        console.error('Failed to load facts', e);
      } finally {
        setLoading(false);
      }
    }
    loadFacts();
  }, [selectedCategory]);

  const openMathModal = (fact: FactCard) => {
    setActiveMathCardId(fact.id);
    const defaults: Record<string, number> = {};
    for (const comp of fact.formula_components || []) {
      defaults[comp.key] = comp.default_val;
    }
    setInteractiveInputs(defaults);
  };

  const handleSliderChange = (key: string, val: number) => {
    setInteractiveInputs((prev) => ({ ...prev, [key]: val }));
  };

  const calculateDynamicValue = (fact: FactCard) => {
    if (fact.id === 2) {
      // Density = population / area
      const pop = interactiveInputs['population'] || 1428000000;
      const area = interactiveInputs['area'] || 3287263;
      return (pop / area).toFixed(1);
    }
    if (fact.id === 3) {
      // Share = (state / nat) * 100
      const st = interactiveInputs['state_pop'] || 235000000;
      const nat = interactiveInputs['nat_pop'] || 1428000000;
      return ((st / nat) * 100).toFixed(1);
    }
    if (fact.id === 4) {
      // Urban = (urban / total) * 100
      const urb = interactiveInputs['urban_pop'] || 505000000;
      const tot = interactiveInputs['total_pop'] || 1428000000;
      return ((urb / tot) * 100).toFixed(1);
    }
    if (fact.id === 6) {
      // Natural growth = (cbr - cdr) / 10
      const cbr = interactiveInputs['cbr'] || 16.9;
      const cdr = interactiveInputs['cdr'] || 6.0;
      return ((cbr - cdr) / 10).toFixed(2);
    }
    if (fact.id === 7) {
      // Daily = Annual / 365
      const ann = interactiveInputs['annual_passengers'] || 6.72;
      return ((ann * 1000) / 365).toFixed(1); // in Millions
    }
    if (fact.id === 8) {
      // Suburban per train = commuters / services
      const com = interactiveInputs['suburban_commuters'] || 7500000;
      const ser = interactiveInputs['train_services'] || 3100;
      return Math.round(com / ser).toLocaleString('en-IN');
    }
    if (fact.id === 9) {
      // Growth = ((curr - past) / past) * 100
      const curr = interactiveInputs['curr_pop'] || 13.6;
      const past = interactiveInputs['past_pop'] || 5.7;
      return (((curr - past) / past) * 100).toFixed(1);
    }
    if (fact.id === 10) {
      // Internet penetration = (subscribers / pop) * 100
      const sub = interactiveInputs['subscribers'] || 936000000;
      const pop = interactiveInputs['population'] || 1428000000;
      return ((sub / pop) * 100).toFixed(1);
    }
    if (fact.id === 11) {
      // Literacy = (lit / tot) * 100
      const lit = interactiveInputs['lit_pop'] || 994000000;
      const tot = interactiveInputs['tot_pop'] || 1280000000;
      return ((lit / tot) * 100).toFixed(1);
    }
    return fact.main_number;
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#0A4D5C] border-t-transparent animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-[#0A192F]">Loading Statistical Knowledge Cards & Math Models...</p>
      </div>
    );
  }

  const activeFact = facts.find((f) => f.id === activeMathCardId);

  return (
    <div className="space-y-8">
      {/* Category Navigation Horizontal Oval Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
              selectedCategory === cat
                ? 'bg-[#0A192F] text-white'
                : 'bg-white border border-[#CBD5E1] text-[#475569] hover:border-[#0A4D5C] hover:text-[#0A4D5C]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Fact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facts.map((fact) => (
          <div
            key={fact.id}
            className="bg-white rounded-3xl lg:rounded-[2.2rem] border border-[#E2DED5] p-6 shadow-sm hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Top Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1 rounded-full bg-[#F0EDE6] text-[#0A4D5C] text-[11px] font-bold uppercase tracking-wider">
                  {fact.category}
                </span>
                <span className="text-[10px] text-[#94A3B8] font-medium">Card #{fact.sort_order}</span>
              </div>

              {/* Title & Main Number */}
              <div className="space-y-2 mb-4">
                <h3 className="font-editorial text-xl font-bold text-[#0A192F] leading-snug group-hover:text-[#0A4D5C] transition-colors">
                  {fact.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
                    {fact.main_number}
                  </span>
                  <span className="text-xs font-semibold text-[#0A4D5C]">{fact.unit}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
                {fact.short_explanation}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#F0EDE6]">
              {/* Show the Mathematics Button - Cylinder Pill Shape */}
              <button
                type="button"
                onClick={() => openMathModal(fact)}
                className="w-full py-2.5 px-4 rounded-full bg-[#FAF9F5] border border-[#DDD7CA] text-[#0A192F] hover:bg-[#0A192F] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn"
              >
                <Calculator className="w-3.5 h-3.5 text-[#0A4D5C] group-hover/btn:text-emerald-400" />
                <span>Show the Mathematics</span>
                <span className="text-[10px] opacity-60">→</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#94A3B8] px-1">
                <span className="truncate max-w-[180px]">{fact.source}</span>
                <span>{fact.reference_date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show the Mathematics Modal / Calculator Drawer */}
      {activeFact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-[#E2DED5] max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EDE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 text-[#0A4D5C] flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A4D5C]">
                    Data Journalism • Mathematical Formulation
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#0A192F]">
                    {activeFact.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveMathCardId(null)}
                className="w-8 h-8 rounded-full bg-[#F5F4F0] text-[#64748B] hover:text-[#0A192F] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* 1. Formal Formula */}
            <div className="p-4 rounded-2xl bg-[#0A192F] text-white space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                1. Mathematical Formula
              </span>
              <div className="font-mono text-sm sm:text-base text-amber-300 bg-white/5 p-3 rounded-xl border border-white/10 overflow-x-auto">
                {activeFact.formula}
              </div>
            </div>

            {/* 2. Step-by-Step Calculation Walkthrough */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E0D5] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A4D5C]">
                2. Calculation Walkthrough (Baseline Values)
              </span>
              <p className="font-mono text-xs sm:text-sm text-[#1E293B] bg-white p-3 rounded-xl border border-[#CBD5E1]">
                {activeFact.calculation_example}
              </p>
            </div>

            {/* 3. Interactive Calculation Sandbox (Sliders) */}
            {activeFact.formula_components && activeFact.formula_components.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    <span>3. Interactive Live Simulation Sandbox</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
                    Dynamic Re-calculation
                  </span>
                </div>

                <div className="space-y-3">
                  {activeFact.formula_components.map((comp) => (
                    <div key={comp.key} className="space-y-1">
                      <div className="flex justify-between text-xs text-emerald-950 font-medium">
                        <span>{comp.label}:</span>
                        <strong>{interactiveInputs[comp.key]?.toLocaleString('en-IN') || comp.default_val.toLocaleString('en-IN')} {comp.unit}</strong>
                      </div>
                      <input
                        type="range"
                        min={comp.min}
                        max={comp.max}
                        step={comp.step}
                        value={interactiveInputs[comp.key] ?? comp.default_val}
                        onChange={(e) => handleSliderChange(comp.key, parseFloat(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Computed Output:</span>
                  <div className="font-sans text-2xl font-black text-emerald-800">
                    {calculateDynamicValue(activeFact)} <span className="text-xs font-normal text-emerald-700">{activeFact.unit}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Plain Language Real-World Interpretation */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1 text-xs text-amber-950">
              <strong className="text-amber-900 block font-bold text-xs uppercase tracking-wider">
                4. What This Number Means in Everyday Life:
              </strong>
              <p className="leading-relaxed">
                {activeFact.plain_meaning}
              </p>
            </div>

            {/* 5. Attribution & Verification Date */}
            <div className="pt-2 text-[11px] text-[#64748B] flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EDE6]">
              <span>Official Reference: <strong>{activeFact.source}</strong></span>
              <span>Survey Period: {activeFact.reference_date}</span>
            </div>

            <button
              type="button"
              onClick={() => setActiveMathCardId(null)}
              className="w-full py-3 rounded-full bg-[#0A192F] text-white text-xs font-bold hover:bg-[#0A4D5C] transition-colors"
            >
              Close Mathematical Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
