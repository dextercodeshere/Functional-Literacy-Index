'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Users, CheckCircle, Database, Download, FileText, Globe, Layers, Settings, LogOut, RefreshCw, BarChart2, PlusCircle, Check, Search, Filter } from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Admin Data
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'sets' | 'export'>('overview');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedSet, setSelectedSet] = useState('SET_A');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadAdminData();
      } else {
        setAuthError(data.error || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setAuthError('Connection failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [statsRes, questionsRes] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch(`/api/admin/questions?set_code=${selectedSet}`).then((r) => r.json()),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (questionsRes.success) setQuestions(questionsRes.data);
    } catch (e) {
      console.error('Failed to load admin stats', e);
    } finally {
      setLoadingData(false);
    }
  };

  // Re-fetch questions when selectedSet changes
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`/api/admin/questions?set_code=${selectedSet}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setQuestions(data.data);
        })
        .catch(console.error);
    }
  }, [selectedSet, isAuthenticated]);

  const handleExport = (format: 'csv' | 'json') => {
    window.open(`/api/admin/export?format=${format}`, '_blank');
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesLevel = selectedLevel === 'all' || String(q.level_number) === selectedLevel;
    const matchesSearch =
      searchQuery === '' ||
      q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.skill_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl border border-[#E2DED5] p-8 shadow-elevated text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#0A192F] text-amber-300 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-editorial text-3xl font-bold text-[#0A192F]">
              Admin <span className="font-normal italic text-[#0A4D5C]">Access</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Authorized research personnel & platform managers
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-[#0A192F] block mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#0A4D5C]"
                placeholder="Enter admin username"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0A192F] block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#0A4D5C]"
                placeholder="••••••••••••"
                required
              />
              <span className="text-[10px] text-[#64748B] mt-1 block">Default research access key: admin123</span>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-full bg-[#0A192F] hover:bg-[#0A4D5C] text-white text-xs font-bold transition-all shadow-soft-pill"
            >
              {loggingIn ? 'Authenticating...' : 'Sign in to Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Top Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E2DED5] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0A4D5C] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#0A192F]">
              Platform <span className="font-normal italic text-[#0A4D5C]">Control Center</span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Role: Superadmin • Database: Persistent Native SQLite (Zero Artificial Offsets)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="p-2 rounded-full bg-[#F0EDE6] text-[#334155] hover:bg-[#E2DED5] transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 text-rose-700 bg-rose-50 text-xs font-semibold hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'overview', label: 'Telemetry & Real-Time Metrics', icon: BarChart2 },
          { key: 'questions', label: 'Question Repository (140 Items)', icon: FileText },
          { key: 'sets', label: 'Question Sets & Versioning', icon: Layers },
          { key: 'export', label: 'Export Anonymized Research Data', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[#0A192F] text-white shadow-soft-pill'
                  : 'bg-white border border-[#CBD5E1] text-[#475569] hover:border-[#0A4D5C]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & REAL-TIME TELEMETRY */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Real-time Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E2DED5] shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                Total Started
              </span>
              <div className="font-sans text-3xl font-extrabold text-[#0A192F]">
                {stats.total_sessions.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-teal-600 font-medium">Live recorded sessions</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2DED5] shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                Completed Assessments
              </span>
              <div className="font-sans text-3xl font-extrabold text-emerald-600">
                {stats.completed_sessions.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#64748B]">Full submissions</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2DED5] shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                In-Progress Sessions
              </span>
              <div className="font-sans text-3xl font-extrabold text-[#0A4D5C]">
                {stats.in_progress_sessions}
              </div>
              <span className="text-[10px] text-teal-700 font-medium">Currently active</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2DED5] shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                Total Question Items
              </span>
              <div className="font-sans text-3xl font-extrabold text-amber-600">
                140
              </div>
              <span className="text-[10px] text-[#64748B]">Across Sets A, B, C, D</span>
            </div>
          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2DED5] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
                <h4 className="font-bold text-sm text-[#0A192F] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0A4D5C]" />
                  <span>Language Distribution</span>
                </h4>
                <span className="text-xs text-[#64748B]">Active Sessions</span>
              </div>

              <div className="space-y-2">
                {(stats.language_distribution || []).map((l: any) => (
                  <div key={l.code} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FAF9F5]">
                    <span className="font-semibold text-[#0A192F]">{l.language_name} ({l.code})</span>
                    <span className="font-bold text-[#0A4D5C]">{l.count} sessions</span>
                  </div>
                ))}
                {(!stats.language_distribution || stats.language_distribution.length === 0) && (
                  <p className="text-xs text-[#94A3B8] italic py-2">No language session data yet.</p>
                )}
              </div>
            </div>

            {/* Recent Completions Stream */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2DED5] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
                <h4 className="font-bold text-sm text-[#0A192F] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Recent Assessment Submissions</span>
                </h4>
                <span className="text-xs text-[#64748B]">Real-time Log</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(stats.recent_completions || []).map((c: any) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-[#FBFBF9] border border-[#EAE7DF] text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-[#0A192F] block">{c.provisional_level}</strong>
                      <span className="text-[10px] text-[#64748B]">{c.state_name} • {c.language_name} • {c.set_code || 'SET_A'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700">{c.total_score} / 35 ({c.percentage}%)</span>
                    </div>
                  </div>
                ))}
                {(!stats.recent_completions || stats.recent_completions.length === 0) && (
                  <p className="text-xs text-[#94A3B8] italic text-center py-4">
                    New live assessment submissions will stream here in real-time.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE 140 QUESTION REPOSITORY */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-3xl border border-[#E2DED5] p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EDE6]">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-[#0A192F]">
                Complete Question <span className="font-normal italic text-[#0A4D5C]">Repository</span>
              </h3>
              <p className="text-xs text-[#64748B]">
                140 peer-calibrated functional literacy items across Sets A, B, C, and D (35 questions each).
              </p>
            </div>

            {/* Set Selection Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { code: 'SET_A', label: 'Set A (Core Foundation)' },
                { code: 'SET_B', label: 'Set B (Analytical)' },
                { code: 'SET_C', label: 'Set C (Quantitative)' },
                { code: 'SET_D', label: 'Set D (Critical Media)' },
              ].map((s) => (
                <button
                  key={s.code}
                  onClick={() => setSelectedSet(s.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedSet === s.code
                      ? 'bg-[#0A4D5C] text-white shadow-sm'
                      : 'bg-[#F0EDE6] text-[#334155] hover:bg-[#E2DED5]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions by text, skill domain, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 rounded-full border border-[#CBD5E1] text-xs bg-[#FBFBF9] focus:outline-none focus:ring-2 focus:ring-[#0A4D5C]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['all', '1', '2', '3', '4', '5'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedLevel === lvl
                      ? 'bg-[#0A192F] text-white font-semibold'
                      : 'bg-white border border-[#CBD5E1] text-[#475569] hover:border-[#0A4D5C]'
                  }`}
                >
                  {lvl === 'all' ? 'All 5 Levels' : `Level ${lvl}`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E0D5] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0A4D5C]">{q.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-[#0A192F] font-bold text-[10px]">
                      {q.level_title}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-semibold text-[#475569]">
                    Skill: {q.skill_category}
                  </span>
                </div>

                {q.stimulus_content && (
                  <div className="p-2.5 rounded-xl bg-white/70 border border-[#E2DED5] text-[#334155] italic text-[11px] font-serif">
                    <strong className="not-italic text-[#0A4D5C] block mb-0.5">{q.stimulus_title}</strong>
                    {q.stimulus_content}
                  </div>
                )}

                <p className="font-semibold text-[#0A192F] text-sm">
                  {q.question_text}
                </p>

                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt: any) => {
                      const isCorrect = opt.label === q.correct_answer;
                      return (
                        <div
                          key={opt.label}
                          className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-[11px] ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                              : 'bg-white border-[#E2DED5] text-[#475569]'
                          }`}
                        >
                          <span><strong>{opt.label}.</strong> {opt.text}</span>
                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 ml-1" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="text-[#475569] pt-1 text-[11px] bg-white/50 p-2 rounded-xl border border-[#E2DED5]">
                  <strong className="text-emerald-700">Answer Key: Option {q.correct_answer}</strong> — {q.explanation}
                </div>
              </div>
            ))}

            {filteredQuestions.length === 0 && (
              <p className="text-center text-xs text-[#94A3B8] py-8">
                No questions found matching your filter.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: QUESTION SETS & VERSIONING */}
      {activeTab === 'sets' && (
        <div className="bg-white rounded-3xl border border-[#E2DED5] p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#0A192F]">
              Assessment Sets & <span className="font-normal italic text-[#0A4D5C]">Architecture</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              All 4 question sets (140 total items) are fully seeded and active in Version 1.0.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-emerald-50/70 border-2 border-emerald-500 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Active (35 Items)
                </span>
                <span className="text-xs font-bold text-emerald-900">SET_A</span>
              </div>
              <h4 className="font-bold text-base text-[#0A192F]">Set A — Core Foundation & Functional Literacy</h4>
              <p className="text-xs text-[#334155] leading-relaxed">
                Foundational comprehension, everyday notices, transit schedules, utility billing math, and public informational texts across 5 progressive levels.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-teal-50/70 border-2 border-teal-500 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Active (35 Items)
                </span>
                <span className="text-xs font-bold text-teal-900">SET_B</span>
              </div>
              <h4 className="font-bold text-base text-[#0A192F]">Set B — Analytical Framework & Daily Interpretations</h4>
              <p className="text-xs text-[#334155] leading-relaxed">
                Contextual vocabulary, clinic hours, multi-step commerce, discount logic, and comparative instructions with Level 4 Q4 corrected to ₹2,070.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-500 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Active (35 Items)
                </span>
                <span className="text-xs font-bold text-blue-900">SET_C</span>
              </div>
              <h4 className="font-bold text-base text-[#0A192F]">Set C — Quantitative Reasoning & Consumer Data</h4>
              <p className="text-xs text-[#334155] leading-relaxed">
                Corporate profit change (+₹50,000 corrected in L4 Q5), electricity slabs, medication instructions, and consumer purchase trade-offs.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-purple-50/70 border-2 border-purple-500 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Active (35 Items)
                </span>
                <span className="text-xs font-bold text-purple-900">SET_D</span>
              </div>
              <h4 className="font-bold text-base text-[#0A192F]">Set D — Critical Media & Public Systems Literacy</h4>
              <p className="text-xs text-[#334155] leading-relaxed">
                Retail tiered profit (+₹5,500 corrected in L4 Q4), media fact-checking, public scheme eligibility, municipal budgeting, and research design.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXPORT ANONYMIZED DATA */}
      {activeTab === 'export' && (
        <div className="bg-white rounded-3xl border border-[#E2DED5] p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#0A192F]">
              Export <span className="font-normal italic text-[#0A4D5C]">Anonymized Research Data</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Download complete, de-identified participant responses for statistical research and data journalism. Contains zero PII.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl border border-[#E2DED5] bg-[#FAF9F6] space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#0A192F]">CSV Spreadsheet Export</h4>
                <p className="text-xs text-[#64748B] mt-1">
                  Ready for Excel, Google Sheets, R, and Python Pandas statistical pipelines.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0A192F] hover:bg-[#0A4D5C] text-white text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download .CSV Spreadsheet</span>
              </button>
            </div>

            <div className="p-5 rounded-3xl border border-[#E2DED5] bg-[#FAF9F6] space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#0A192F]">JSON API Format</h4>
                <p className="text-xs text-[#64748B] mt-1">
                  Full structured JSON payload for database replication and dashboards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleExport('json')}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export .JSON Payload</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
