'use client';

import React, { useState, useEffect } from 'react';
import { TriviaQuestion } from '@/lib/types';
import { Sparkles, CheckCircle2, XCircle, HelpCircle, Trophy, RefreshCw, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export default function TriviaQuiz() {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function loadTrivia() {
      try {
        setLoading(true);
        const res = await fetch(`/api/trivia/questions?category=${encodeURIComponent(selectedCategory)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setQuestions(json.data.questions);
          if (json.data.categories) {
            setCategories(json.data.categories);
          }
        }
      } catch (e) {
        console.error('Failed to load trivia', e);
      } finally {
        setLoading(false);
      }
    }
    loadTrivia();
  }, [selectedCategory]);

  const handleSelect = (questionId: number, label: string) => {
    if (revealed[questionId]) return; // locked once revealed
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: label }));
  };

  const handleReveal = (questionId: number, correctAns: string) => {
    if (revealed[questionId]) return;
    setRevealed((prev) => ({ ...prev, [questionId]: true }));
    const chosen = selectedAnswers[questionId];
    if (chosen && chosen.toUpperCase() === correctAns.toUpperCase()) {
      setScore((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setRevealed({});
    setScore(0);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#0A4D5C] border-t-transparent animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-[#0A192F]">Loading Indian Trivia & Heritage Questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isAnswered = currentQ ? Boolean(selectedAnswers[currentQ.id]) : false;
  const isRevealed = currentQ ? Boolean(revealed[currentQ.id]) : false;
  const isCorrect = isRevealed && selectedAnswers[currentQ.id]?.toUpperCase() === currentQ.correct_answer.toUpperCase();

  return (
    <div className="space-y-8">
      {/* Category Filter Horizontal Oval Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
            }}
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

      {/* Main Trivia Runner Card with Cylinder / Oval Styling */}
      {currentQ ? (
        <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-[#E2DED5] shadow-elevated p-6 sm:p-10 relative overflow-hidden">
          {/* Top metadata strip */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0EDE6] text-xs">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0A4D5C] font-semibold">
                {currentQ.category}
              </span>
              <span className="text-[#64748B]">
                Question <strong className="text-[#0A192F]">{currentIndex + 1}</strong> of {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>Score: {score}</span>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0A192F] leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.label;
              const isOptionCorrect = isRevealed && opt.label.toUpperCase() === currentQ.correct_answer.toUpperCase();
              const isOptionWrongSelection = isRevealed && isSelected && !isOptionCorrect;

              return (
                <button
                  key={opt.label}
                  type="button"
                  disabled={isRevealed}
                  onClick={() => handleSelect(currentQ.id, opt.label)}
                  className={`w-full p-4 sm:p-5 rounded-full border text-left transition-all flex items-center justify-between ${
                    isOptionCorrect
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-soft-pill font-bold'
                      : isOptionWrongSelection
                      ? 'bg-rose-500 border-rose-600 text-white shadow-soft-pill'
                      : isSelected
                      ? 'bg-[#0A192F] border-[#0A192F] text-white shadow-sm'
                      : 'bg-white border-[#CBD5E1] text-[#1E293B] hover:border-[#0A4D5C] hover:bg-[#FBFBF9]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isOptionCorrect || isOptionWrongSelection
                          ? 'bg-white/20 text-white'
                          : isSelected
                          ? 'bg-amber-300 text-slate-950'
                          : 'bg-[#F0EDE6] text-[#475569]'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-sm sm:text-base font-medium">{opt.text}</span>
                  </div>

                  {isOptionCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                  {isOptionWrongSelection && <XCircle className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Action & Explanation Box */}
          <div className="pt-4 border-t border-[#F0EDE6] space-y-4">
            {!isRevealed ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">
                  Select an answer, then reveal the verified fact.
                </span>
                <button
                  type="button"
                  disabled={!isAnswered}
                  onClick={() => handleReveal(currentQ.id, currentQ.correct_answer)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold shadow-soft-pill transition-all ${
                    isAnswered
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Reveal Answer & Source
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-[#FAF9F5] border border-[#E5E0D5] space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{isCorrect ? 'Correct Knowledge!' : `Correct Answer: Option ${currentQ.correct_answer}`}</span>
                  </span>

                  <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fact Checked</span>
                  </span>
                </div>

                <p className="text-sm text-[#1E293B] leading-relaxed">
                  {currentQ.explanation}
                </p>

                <div className="text-[11px] text-[#64748B] pt-2 border-t border-[#EAE5DA]">
                  <strong>Verified Source: </strong>
                  <span>{currentQ.verified_source}</span>
                </div>
              </div>
            )}

            {/* Bottom Nav Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-5 py-2 rounded-full bg-[#F0EDE6] text-[#334155] text-xs font-semibold disabled:opacity-30"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-6 py-2 rounded-full bg-[#0A192F] text-white text-xs font-semibold hover:bg-[#0A4D5C]"
                  >
                    Next Trivia
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2 rounded-full bg-[#0A4D5C] text-white text-xs font-semibold"
                  >
                    Play Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2DED5]">
          <p className="text-sm text-[#64748B]">No trivia questions found for this category.</p>
        </div>
      )}
    </div>
  );
}
