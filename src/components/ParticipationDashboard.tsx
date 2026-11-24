'use client';

import React, { useEffect, useState } from 'react';
import { Users, CheckCircle2, Award, MapPin, AlertCircle, Sparkles, RefreshCw, Radio } from 'lucide-react';

interface StatsData {
  total_started: number;
  total_completed: number;
  benchmark_attainment_pct: number;
  participating_states: number;
  label: string;
  explanation: string;
  is_demonstration: boolean;
  telemetry_mode?: string;
}

export default function ParticipationDashboard({ onStartClick }: { onStartClick: () => void }) {
  const [stats, setStats] = useState<StatsData>({
    total_started: 0,
    total_completed: 0,
    benchmark_attainment_pct: 0.0,
    participating_states: 0,
    label: "Benchmark attainment among completed participants",
    explanation: "These results represent participants who completed this platform's assessment. They are not a representative estimate of India's national literacy rate.",
    is_demonstration: false,
    telemetry_mode: "Live Real-Time Telemetry",
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/stats/overview', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (e) {
      console.error('Failed to load live stats', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-poll stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-10 pb-14 px-4 sm:px-6 lg:px-8">
      {/* Editorial Hero Background - Deep Teal Petroleum Palette (#0A4D5C) inspired by reference design */}
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl lg:rounded-[3rem] bg-gradient-to-b from-[#0A4D5C] via-[#09414E] to-[#0A192F] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-teal-500/20 overflow-hidden">
          {/* Ambient lighting glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

          {/* Top Pill Tags: Horizontal Oval Cylinders */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 relative z-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Independent Public Platform • Version 1.0</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-300/15 border border-teal-300/30 text-teal-200 text-xs font-medium">
                <Radio className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                <span>Live Real-Time Telemetry</span>
              </div>
            </div>

            <button
              onClick={fetchStats}
              title="Refresh live metrics"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-xs text-teal-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>

          {/* Hero Headlines - Bold and Italic mix matching reference */}
          <div className="max-w-3xl relative z-10 space-y-4">
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              India’s <span className="font-normal italic text-teal-200">Literacy Assessment</span>
            </h1>
            <p className="font-sans text-lg sm:text-xl text-teal-100/90 font-normal leading-relaxed max-w-2xl">
              How well can we read, understand, interpret and use information in our everyday lives?
            </p>
          </div>

          {/* Live Platform Counters - 4 Horizontal Cylinder Capsules with Database Telemetry */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {/* Stat Card 1: Total Started */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 hover:bg-white/15 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                  Total Started
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-teal-200">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {stats.total_started.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-teal-100/75 font-medium">
                  Live initiated sessions
                </p>
              </div>
            </div>

            {/* Stat Card 2: Completed Assessments */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 hover:bg-white/15 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Completed
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-sans text-3xl sm:text-4xl font-bold text-emerald-300 tracking-tight">
                  {stats.total_completed.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-teal-100/75 font-medium">
                  Verified completions
                </p>
              </div>
            </div>

            {/* Stat Card 3: Benchmark Attainment */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 hover:bg-white/15 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Benchmark Rate
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-sans text-3xl sm:text-4xl font-bold text-amber-300 tracking-tight">
                  {stats.benchmark_attainment_pct.toFixed(1)}%
                </div>
                <p className="text-[11px] text-teal-100/75 font-medium">
                  Meeting benchmark
                </p>
              </div>
            </div>

            {/* Stat Card 4: Participating States */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 hover:bg-white/15 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                  Active States
                </span>
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-300">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-sans text-3xl sm:text-4xl font-bold text-sky-200 tracking-tight">
                  {stats.participating_states}
                </div>
                <p className="text-[11px] text-teal-100/75 font-medium">
                  States & UTs represented
                </p>
              </div>
            </div>
          </div>

          {/* Mandatory Critical Disclaimer Box */}
          <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 flex items-start gap-3.5 relative z-10 text-xs sm:text-sm text-teal-100/80 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">
                {stats.label}
              </p>
              <p>
                {stats.explanation}
              </p>
            </div>
          </div>

          {/* CTA Cylinder Pill Button - Emerald accent like reference image */}
          <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center gap-4 relative z-10">
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-base shadow-elevated transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
              <span>Take the Literacy Assessment</span>
              <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
            <div className="text-xs text-teal-200/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>100% Free • 35 Everyday Practical Questions • No Sign-up Required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
