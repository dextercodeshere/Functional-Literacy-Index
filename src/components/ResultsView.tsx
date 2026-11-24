'use client';

import React, { useState } from 'react';
import { AssessmentResult } from '@/lib/types';
import { Award, CheckCircle2, XCircle, BarChart, Printer, Share2, ArrowRight, RefreshCw, Sparkles, BookOpen, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import NextLink from 'next/link';

interface ResultsViewProps {
  result: AssessmentResult;
  onRetake: () => void;
}

export default function ResultsView({ result, onRetake }: ResultsViewProps) {
  const [showFullReview, setShowFullReview] = useState(false);
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>('all');

  const handlePrint = () => {
    window.print();
  };

  const filteredReviews = (result.detailed_reviews || []).filter((r) => {
    if (activeLevelFilter === 'all') return true;
    return r.level_title.includes(activeLevelFilter);
  });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Top Controls Banner */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E2DED5] no-print">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Assessment Completed</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#CBD5E1] text-[#334155] text-xs font-semibold hover:border-[#0A192F] transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save Summary</span>
          </button>

          <button
            onClick={onRetake}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F0EDE6] text-[#334155] text-xs font-semibold hover:bg-[#E2DED5] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake</span>
          </button>
        </div>
      </div>

      {/* Main Results Certificate Card - Horizontal Oval & Cylinder Styling */}
      <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-[#E2DED5] shadow-elevated p-6 sm:p-12 mb-8 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#0A4D5C] to-[#0A192F] text-amber-300 shadow-md mx-auto mb-2">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-[#0A4D5C] block">
            Individual Performance Summary
          </span>

          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#0A192F] tracking-tight">
            {result.provisional_level}
          </h2>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Based on {result.set_code ? result.set_code.replace('_', ' ') : 'Standard Assessment'} (35 items) across sentence comprehension, instructions, practical calculations, multiple-source evaluation, and complex inference.
          </p>

          {/* Benchmark status pill */}
          <div className="pt-2">
            <span
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
                result.meets_benchmark
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {result.meets_benchmark
                  ? 'Met Pilot Functional Literacy Benchmark (≥ 70%)'
                  : 'Developing Functional Literacy (Below 70% Benchmark)'}
              </span>
            </span>
          </div>
        </div>

        {/* Score Counters Grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#FAF9F6] p-4 rounded-3xl border border-[#EBE7DF] text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
              Overall Score
            </span>
            <div className="font-sans text-3xl font-bold text-[#0A192F]">
              {result.total_score} <span className="text-sm font-normal text-[#94A3B8]">/ {result.max_score}</span>
            </div>
            <span className="text-[10px] text-[#64748B]">Questions Correct</span>
          </div>

          <div className="bg-[#FAF9F6] p-4 rounded-3xl border border-[#EBE7DF] text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
              Percentage
            </span>
            <div className="font-sans text-3xl font-bold text-[#0A4D5C]">
              {result.percentage}%
            </div>
            <span className="text-[10px] text-[#64748B]">Proficiency Score</span>
          </div>

          <div className="bg-[#FAF9F6] p-4 rounded-3xl border border-[#EBE7DF] text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
              Location
            </span>
            <div className="font-sans text-sm font-bold text-[#0A192F] truncate">
              {result.city_name || 'City'}
            </div>
            <span className="text-[10px] text-[#64748B] truncate block">
              {result.state_name || 'India'}
            </span>
          </div>

          <div className="bg-[#FAF9F6] p-4 rounded-3xl border border-[#EBE7DF] text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
              Language
            </span>
            <div className="font-sans text-sm font-bold text-[#0A192F]">
              {result.language_name || 'English'}
            </div>
            <span className="text-[10px] text-[#64748B]">Assessed Version</span>
          </div>
        </div>

        {/* Mandatory Research Classification Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Preliminary assessment result:</strong> This classification reflects performance on this platform’s 35-question pilot framework. It does not claim to be a statistically validated national adult proficiency classification.
          </p>
        </div>
      </div>

      {/* Level-Wise Breakdown Section */}
      <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-[#E2DED5] shadow-elevated p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0EDE6]">
          <h3 className="font-editorial text-2xl font-bold text-[#0A192F]">
            Level-Wise <span className="font-normal italic text-[#0A4D5C]">Attainment</span>
          </h3>
          <span className="text-xs text-[#64748B]">5 Progressive Tiers (7 Questions Each)</span>
        </div>

        <div className="space-y-4">
          {Object.entries(result.level_scores || {}).map(([lvlNum, lvl]) => {
            return (
              <div key={lvlNum} className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#EAE7DF] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0A192F] tracking-wide">
                    {lvl.title || `Level ${lvlNum}`}
                  </span>
                  <span className="font-semibold text-[#0A4D5C]">
                    {lvl.correct} / {lvl.total} ({lvl.percentage}%)
                  </span>
                </div>
                {/* Cylinder progress track */}
                <div className="w-full bg-[#EAE7DF] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      lvl.percentage >= 70 ? 'bg-emerald-500' : lvl.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${lvl.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Domain Competency Analysis */}
      <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-[#E2DED5] shadow-elevated p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0EDE6]">
          <h3 className="font-editorial text-2xl font-bold text-[#0A192F]">
            Skill Category <span className="font-normal italic text-[#0A4D5C]">Diagnostics</span>
          </h3>
          <span className="text-xs text-[#64748B]">Cognitive Dimensions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {Object.entries(result.category_scores || {}).map(([catName, cat]) => (
            <div key={catName} className="p-4 rounded-2xl border border-[#EAE7DF] bg-[#FAF9F6]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#0A192F]">{catName}</span>
                <span className="text-xs font-bold text-[#0A4D5C]">{cat.percentage}%</span>
              </div>
              <div className="w-full bg-[#E5E0D5] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0A4D5C] h-full rounded-full"
                  style={{ width: `${cat.percentage}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-[#64748B] mt-1.5 block">
                {cat.correct} of {cat.total} correct
              </span>
            </div>
          ))}
        </div>

        {/* Strongest Skill & Improvement Areas Callouts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F0EDE6]">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              Strongest Competency
            </span>
            <p className="text-sm font-semibold text-emerald-950">
              {result.strongest_skill}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Target Improvement Focus
            </span>
            <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside">
              {(result.improvement_areas || []).map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Question Review Toggle */}
      <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-[#E2DED5] shadow-elevated p-6 sm:p-8 mb-8 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EDE6]">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#0A192F]">
              Question-by-Question <span className="font-normal italic text-[#0A4D5C]">Review</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Inspect your answers against the official rationales and explanations.
            </p>
          </div>

          <button
            onClick={() => setShowFullReview(!showFullReview)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0A192F] text-white text-xs font-semibold hover:bg-[#0A4D5C] transition-all shadow-sm self-start sm:self-auto"
          >
            <span>{showFullReview ? 'Hide Detailed Review' : 'View All 35 Questions'}</span>
            {showFullReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showFullReview && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              {['all', 'FOUNDATION', 'EVERYDAY', 'FUNCTIONAL', 'ANALYTICAL', 'MASTER'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveLevelFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeLevelFilter === f
                      ? 'bg-[#0A4D5C] text-white shadow-sm'
                      : 'bg-[#F0EDE6] text-[#475569] hover:bg-[#E2DED5]'
                  }`}
                >
                  {f === 'all' ? 'All Levels (35)' : f}
                </button>
              ))}
            </div>

            {/* Questions list */}
            <div className="space-y-4">
              {filteredReviews.map((rev, idx) => (
                <div
                  key={rev.question_id}
                  className={`p-5 rounded-3xl border transition-all ${
                    rev.is_correct
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0A192F]">
                        {rev.question_id}: {rev.level_title}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        rev.is_correct
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rev.is_correct ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{rev.is_correct ? 'Correct' : 'Incorrect'}</span>
                    </span>
                  </div>

                  {rev.stimulus_content && (
                    <div className="my-2 p-3 rounded-2xl bg-white/70 border border-[#E5E0D5] text-xs text-[#334155] italic">
                      {rev.stimulus_content}
                    </div>
                  )}

                  <p className="font-semibold text-sm text-[#0A192F] my-2">
                    {rev.question_text}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs my-3">
                    <div className="p-2.5 rounded-xl bg-white border border-[#CBD5E1]">
                      <span className="text-[10px] text-[#64748B] block">Your Answer:</span>
                      <strong className="text-[#0A192F]">{rev.selected_option ? `Option ${rev.selected_option}` : 'Not Answered'}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#CBD5E1]">
                      <span className="text-[10px] text-[#64748B] block">Correct Answer:</span>
                      <strong className="text-emerald-700">Option {rev.correct_option}</strong>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-[#334155] bg-white/80 p-3 rounded-2xl border border-[#CBD5E1]/60">
                    <strong className="text-[#0A4D5C]">Explanation: </strong>
                    <span>{rev.explanation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Step / Explore India Callout */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0A4D5C] to-[#0A192F] text-white p-8 shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
        <div className="space-y-1 max-w-lg">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Continue Your Journey
          </span>
          <h4 className="font-editorial text-2xl font-bold">
            How Well Do You Know Your Country?
          </h4>
          <p className="text-xs text-teal-100/80">
            Test your knowledge of Indian geography, history, rivers, culture, and extraordinary facts on our dedicated trivia platform.
          </p>
        </div>

        <NextLink
          href="/explore"
          className="px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-soft-pill transition-all transform hover:-translate-y-0.5 flex items-center gap-2 flex-shrink-0"
        >
          <span>Explore India Trivia</span>
          <ArrowRight className="w-4 h-4" />
        </NextLink>
      </div>
    </div>
  );
}
