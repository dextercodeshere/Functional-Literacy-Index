import React from 'react';
import TriviaQuiz from '../../components/TriviaQuiz';
import { Sparkles, Map, Compass, BookOpen, Shield } from 'lucide-react';
import NextLink from 'next/link';

export const metadata = {
  title: "Explore India — How Well Do You Know Your Country? | Trivia Platform",
  description: "Test your knowledge of Indian geography, cultural heritage, rivers, states, and history.",
};

export default function ExploreIndiaPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header Banner - Inspired by Reference Images */}
      <div className="rounded-3xl lg:rounded-[3rem] bg-gradient-to-br from-[#0A4D5C] via-[#09414E] to-[#0A192F] text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-teal-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Knowledge Hub • V1 Collection</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            How Well Do You <span className="font-normal italic text-teal-200">Know Your Country?</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-teal-100/90 font-normal leading-relaxed">
            Explore the geography, culture, history and extraordinary facts of India. Answer verified trivia and uncover the research and heritage behind each milestone.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-teal-200/80 relative z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>100% Fact-Checked Against Official Sources</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>Categorized by Geography, Trade & Culture</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Independent From Literacy Survey Scoring</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Trivia Component */}
      <TriviaQuiz />
    </div>
  );
}
