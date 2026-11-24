'use client';

import React, { useState, useEffect } from 'react';
import { AssessmentQuestion } from '@/lib/types';
import { ChevronLeft, ChevronRight, CheckCircle, HelpCircle, FileText, Bookmark, AlertTriangle, Send, Sparkles } from 'lucide-react';

interface AssessmentRunnerProps {
  sessionId: string;
  languageCode: string;
  setCode?: string;
  initialAnswers?: Record<string, string>;
  onComplete: (results: any) => void;
  onExit: () => void;
}

export default function AssessmentRunner({
  sessionId,
  languageCode,
  setCode,
  initialAnswers = {},
  onComplete,
  onExit,
}: AssessmentRunnerProps) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  // Fetch questions for this session & language
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const res = await fetch(`/api/assessment/questions?session_id=${sessionId}&lang=${languageCode}`);
        const data = await res.json();
        if (data.success && data.data?.questions) {
          setQuestions(data.data.questions);
        }
      } catch (e) {
        console.error('Failed to load assessment questions', e);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [sessionId, languageCode]);

  // Auto-save progress whenever answer is updated
  const saveProgress = async (updatedAnswers: Record<string, string>, currentQIndex: number) => {
    try {
      const currentQ = questions[currentQIndex];
      await fetch('/api/assessment/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          current_level: currentQ ? currentQ.level_number : 1,
          current_question: currentQIndex + 1,
          answers: updatedAnswers,
        }),
      });
    } catch (err) {
      console.warn('Progress autosave failed', err);
    }
  };

  const handleSelectOption = (questionId: string, optionLabel: string) => {
    const updated = { ...answers, [questionId]: optionLabel };
    setAnswers(updated);
    saveProgress(updated, currentIndex);
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          answers,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        onComplete(data.data);
      } else {
        alert(data.error || 'Submission failed. Please check your connection.');
        setSubmitting(false);
      }
    } catch (e) {
      alert('Error submitting assessment. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#0A4D5C] border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="font-editorial text-2xl font-bold text-[#0A192F]">Preparing Your Assessment...</p>
        <p className="text-sm text-[#64748B] mt-1">Calibrating question set in chosen language</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <p className="text-rose-700 font-semibold">Unable to load assessment questions.</p>
        <button
          onClick={onExit}
          className="mt-4 px-6 py-2 rounded-full bg-[#0A192F] text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalCount = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((currentIndex + 1) / totalCount) * 100);
  const isAnswered = Boolean(answers[currentQ.id]);
  const isFlagged = Boolean(flaggedQuestions[currentQ.id]);

  // Level Badge Color Mapper
  const getLevelBadgeClass = (lvl: number) => {
    switch (lvl) {
      case 1: return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 2: return 'bg-teal-50 text-teal-800 border-teal-200';
      case 3: return 'bg-blue-50 text-blue-800 border-blue-200';
      case 4: return 'bg-amber-50 text-amber-800 border-amber-200';
      case 5: return 'bg-purple-50 text-purple-800 border-purple-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Session Progress Bar - Horizontal cylinder shape */}
      <div className="mb-6 bg-white p-4 sm:p-5 rounded-3xl border border-[#E2DED5] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#0A192F] text-amber-300 font-bold text-xs tracking-wider">
              {setCode ? setCode.replace('_', ' ') : currentQ.set_code ? currentQ.set_code.replace('_', ' ') : 'Set A'}
            </span>
            <span className={`px-3 py-1 rounded-full font-semibold border ${getLevelBadgeClass(currentQ.level_number)}`}>
              {currentQ.level_title}
            </span>
            <span className="text-[#64748B] font-medium">
              Question <strong className="text-[#0A192F] font-bold">{currentIndex + 1}</strong> of {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                isFlagged
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-[#F5F4F0] text-[#64748B] hover:text-[#0A192F]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
            </button>

            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#0A192F] text-white font-semibold hover:bg-[#0A4D5C] transition-colors"
            >
              <span>Review ({answeredCount}/{totalCount})</span>
            </button>
          </div>
        </div>

        {/* Cylinder Progress track */}
        <div className="w-full bg-[#F0EDE6] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#0A4D5C] to-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {/* Main Question Card with Cylinder / Oval Styling */}
      <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-[#E2DED5] shadow-elevated p-6 sm:p-10 relative overflow-hidden">
        {/* Skill domain badge */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0EDE6]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Skill Domain: <span className="text-[#0A4D5C] font-bold">{currentQ.skill_category}</span>
          </span>
          <span className="text-[11px] text-[#94A3B8]">
            Difficulty: <strong className="text-[#334155]">{currentQ.difficulty}</strong>
          </span>
        </div>

        {/* Reading Passage / Stimulus Container (if available) */}
        {currentQ.stimulus_content && (
          <div className="mb-8 rounded-3xl bg-[#FAF9F5] border border-[#E5E0D5] p-5 sm:p-6 shadow-inner relative">
            {currentQ.stimulus_title && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DDD7CA] text-xs font-semibold text-[#0A4D5C] mb-3">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentQ.stimulus_title}</span>
              </div>
            )}
            <div className="font-sans text-sm sm:text-base text-[#1E293B] leading-relaxed whitespace-pre-line">
              {currentQ.stimulus_content}
            </div>
          </div>
        )}

        {/* Question Text - Editorial Serif typography */}
        <div className="mb-8">
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0A192F] leading-snug">
            {currentQ.question_text}
          </h3>
        </div>

        {/* Answer Options - Horizontal Oval / Cylinder Shaped Radio Cards */}
        <div className="space-y-3.5 mb-10">
          {currentQ.options.map((opt) => {
            const isSelected = answers[currentQ.id] === opt.label;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt.label)}
                className={`w-full p-4 sm:p-5 rounded-full border text-left transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'border-[#0A192F] bg-[#0A192F] text-white shadow-soft-pill scale-[1.01]'
                    : 'border-[#CBD5E1] bg-white hover:border-[#0A4D5C] text-[#1E293B] hover:bg-[#FBFBF9]'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Cylinder option label bubble */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-[#F0EDE6] text-[#475569] group-hover:bg-[#E2DED5]'
                    }`}
                  >
                    {opt.label}
                  </div>
                  <span className={`text-sm sm:text-base font-medium ${isSelected ? 'text-white' : 'text-[#0F172A]'}`}>
                    {opt.text}
                  </span>
                </div>
                {isSelected && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mr-2" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="pt-6 border-t border-[#F0EDE6] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-[#94A3B8]'
                : 'bg-[#F0EDE6] text-[#334155] hover:bg-[#E2DED5]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {currentIndex < totalCount - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1))}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#0A192F] text-white hover:bg-[#0A4D5C] text-xs font-semibold shadow-soft-pill transition-all transform hover:-translate-y-0.5"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-elevated transition-all transform hover:-translate-y-0.5"
              >
                <span>Review & Submit</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal / Drawer */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-[#E2DED5] max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EDE6]">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#0A192F]">
                  Assessment <span className="font-normal italic text-[#0A4D5C]">Review</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Answered: <strong className="text-[#0A192F]">{answeredCount}</strong> of {totalCount} questions
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full bg-[#F5F4F0] text-[#64748B] hover:text-[#0A192F] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Warning if unanswered */}
            {answeredCount < totalCount && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  You have <strong>{totalCount - answeredCount} unanswered questions</strong>. We recommend answering all questions for an accurate functional literacy assessment score.
                </span>
              </div>
            )}

            {/* Questions Grid */}
            <div className="my-6 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {questions.map((q, idx) => {
                  const hasAnswer = Boolean(answers[q.id]);
                  const flagged = Boolean(flaggedQuestions[q.id]);
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowReviewModal(false);
                      }}
                      className={`h-11 rounded-full text-xs font-bold transition-all relative flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-offset-2 ring-[#0A192F]'
                          : ''
                      } ${
                        hasAnswer
                          ? 'bg-[#0A192F] text-white'
                          : 'bg-[#F0EDE6] text-[#475569] hover:bg-[#E2DED5]'
                      }`}
                    >
                      <span>Q{idx + 1}</span>
                      {flagged && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 border border-white text-[8px] text-white flex items-center justify-center">
                          •
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#F0EDE6] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#F0EDE6] text-[#334155] text-xs font-semibold"
              >
                Continue Assessment
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-soft-pill flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Calculating Results...' : 'Confirm & Finalize Submission'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
