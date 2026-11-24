'use client';

import React, { useState, useEffect } from 'react';
import { StateItem, CityItem, LanguageItem } from '@/lib/types';
import { MapPin, Globe, ChevronRight, Check, AlertCircle, ArrowLeft, Search, Layers, Sparkles } from 'lucide-react';

interface PreSurveyRegistrationProps {
  onStart: (sessionData: {
    sessionId: string;
    setCode?: string;
    stateId: number;
    cityId?: number;
    cityOther?: string;
    languageCode: string;
  }) => void;
  onCancel: () => void;
}

const QUESTION_SETS = [
  {
    code: 'RANDOM',
    title: 'Balanced Rotation (Recommended)',
    badge: 'Standard Protocol',
    description: 'System automatically balances across all 4 benchmark question sets (Sets A, B, C, D).',
  },
  {
    code: 'SET_A',
    title: 'Set A — Core Foundation & Functional',
    badge: '35 Questions',
    description: 'Everyday notices, transit schedules, utility math, and public informational text.',
  },
  {
    code: 'SET_B',
    title: 'Set B — Analytical Framework & Daily Tasks',
    badge: '35 Questions',
    description: 'Clinic hours, multi-step commerce, discount logic, and comparative instructions.',
  },
  {
    code: 'SET_C',
    title: 'Set C — Quantitative Reasoning & Consumer Data',
    badge: '35 Questions',
    description: 'Revenue/profit margins, electricity tariffs, medication dosage, and dietary facts.',
  },
  {
    code: 'SET_D',
    title: 'Set D — Critical Media & Public Systems',
    badge: '35 Questions',
    description: 'Scheme eligibility, municipal budgeting, media verification, and research design.',
  },
];

export default function PreSurveyRegistration({ onStart, onCancel }: PreSurveyRegistrationProps) {
  const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);

  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [cityOtherText, setCityOtherText] = useState<string>('');
  const [isOtherCity, setIsOtherCity] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [selectedSetCode, setSelectedSetCode] = useState<string>('RANDOM');

  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial states and languages
  useEffect(() => {
    async function initData() {
      try {
        const [statesRes, langsRes] = await Promise.all([
          fetch('/api/locations/states').then((r) => r.json()),
          fetch('/api/languages').then((r) => r.json()),
        ]);
        if (statesRes.success) setStates(statesRes.data);
        if (langsRes.success) setLanguages(langsRes.data);
      } catch (err) {
        console.error('Failed to load locations', err);
      }
    }
    initData();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity(null);
      setIsOtherCity(false);
      return;
    }

    async function loadCities() {
      try {
        const res = await fetch(`/api/locations/cities?state_id=${selectedState}`);
        const data = await res.json();
        if (data.success) {
          setCities(data.data);
        }
      } catch (err) {
        console.error('Failed to load cities', err);
      }
    }
    loadCities();
  }, [selectedState]);

  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const handleCityChange = (cityId: number) => {
    setSelectedCity(cityId);
    const chosen = cities.find((c) => c.id === cityId);
    if (chosen && chosen.name.includes('Other')) {
      setIsOtherCity(true);
    } else {
      setIsOtherCity(false);
    }
  };

  const handleStartAssessment = async () => {
    if (!selectedState) {
      setError('Please select your state or union territory.');
      return;
    }
    if (!selectedLanguage) {
      setError('Please select your preferred language.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state_id: selectedState,
          city_id: selectedCity || null,
          city_other: isOtherCity ? cityOtherText : null,
          language_code: selectedLanguage,
          set_code: selectedSetCode,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.session_id) {
        onStart({
          sessionId: json.data.session_id,
          setCode: json.data.set_code,
          stateId: selectedState,
          cityId: selectedCity || undefined,
          cityOther: isOtherCity ? cityOtherText : undefined,
          languageCode: selectedLanguage,
        });
      } else {
        setError(json.error || 'Failed to initialize session. Please try again.');
      }
    } catch (e: any) {
      setError('Network communication failed. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      {/* Container Card with Cylinder / Oval Styling */}
      <div className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-[#E2DED5] shadow-elevated p-6 sm:p-10 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#F0EDE6]">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#64748B] hover:text-[#0A192F] hover:bg-[#F5F4F0] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <span>Setup Participant Session</span>
          </div>
        </div>

        {/* Title */}
        <div className="mt-6 mb-8 space-y-2">
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#0A192F]">
            Before We <span className="font-normal italic text-[#0A4D5C]">Begin</span>
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            Please configure your geographic location, preferred language, and question set. No personal data, email addresses, or phone numbers are ever collected.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* 1. STATE SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0A192F] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0A4D5C]" />
                <span>1. Select Your State or Union Territory</span>
              </label>
              {selectedState && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>

            <div className="relative">
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type to filter states (e.g. Maharashtra, Karnataka, Delhi, Uttar Pradesh)..."
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-[#CBD5E1] bg-[#FBFBF9] text-sm text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A4D5C] focus:border-transparent transition-all"
                />
              </div>

              {/* State Pills Grid */}
              <div className="mt-3 max-h-48 overflow-y-auto p-2 flex flex-wrap gap-2 border border-[#E2DED5] rounded-2xl bg-[#FBFBF9]">
                {filteredStates.map((state) => {
                  const isSelected = selectedState === state.id;
                  return (
                    <button
                      key={state.id}
                      type="button"
                      onClick={() => {
                        setSelectedState(state.id);
                        setStateSearch('');
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#0A192F] text-white shadow-sm font-semibold scale-105'
                          : 'bg-white border border-[#CBD5E1] text-[#334155] hover:border-[#0A4D5C] hover:text-[#0A4D5C]'
                      }`}
                    >
                      {state.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. CITY SELECTION */}
          {selectedState && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#0A192F] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>2. Select Your City / District</span>
                </label>
                <span className="text-[11px] text-[#64748B]">Optional / Select Other if unlisted</span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-[#E2DED5] rounded-2xl bg-[#FBFBF9]">
                {cities.map((city) => {
                  const isSelected = selectedCity === city.id;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCityChange(city.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                          : 'bg-white border border-[#CBD5E1] text-[#334155] hover:border-emerald-600'
                      }`}
                    >
                      {city.name}
                    </button>
                  );
                })}
              </div>

              {isOtherCity && (
                <div className="mt-2 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Enter your town / district name..."
                    value={cityOtherText}
                    onChange={(e) => setCityOtherText(e.target.value)}
                    className="w-full px-5 py-2.5 rounded-full border border-[#CBD5E1] bg-white text-xs text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. QUESTION SET SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0A192F] flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>3. Select Question Bank / Set</span>
              </label>
              <span className="text-[11px] text-teal-700 font-medium">140 Questions Available Across 4 Sets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {QUESTION_SETS.map((qSet) => {
                const isSelected = selectedSetCode === qSet.code;
                return (
                  <button
                    key={qSet.code}
                    type="button"
                    onClick={() => setSelectedSetCode(qSet.code)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0A4D5C] bg-[#0A4D5C]/5 ring-2 ring-[#0A4D5C] shadow-sm'
                        : 'border-[#CBD5E1] bg-white hover:border-[#0A4D5C]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#0A192F]">
                        {qSet.title}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-[#0A4D5C] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {qSet.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-snug">
                      {qSet.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. LANGUAGE SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0A192F] flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-600" />
                <span>4. Preferred Assessment Language</span>
              </label>
              <span className="text-[11px] text-[#64748B]">Determines all questions & stimulus</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {languages.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-[#0A192F] bg-[#0A192F] text-white shadow-md'
                        : 'border-[#CBD5E1] bg-white hover:border-[#0A4D5C] text-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-amber-300' : 'text-[#64748B]'}`}>
                        {lang.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className={`text-base font-bold mt-1 ${isSelected ? 'text-white' : 'text-[#0A192F]'}`}>
                      {lang.native_name}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#64748B] italic">
              * Note: English and Hindi provide complete question stimulus sets. Regional languages support core foundation navigation and questions.
            </p>
          </div>

          {/* Begin Assessment Button */}
          <div className="pt-4 border-t border-[#F0EDE6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#64748B]">
              Takes ~15-20 minutes • 35 Questions across 5 Progressive Levels
            </div>

            <button
              type="button"
              onClick={handleStartAssessment}
              disabled={loading || !selectedState}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm shadow-soft-pill transition-all duration-200 flex items-center justify-center gap-2.5 ${
                !selectedState
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white transform hover:-translate-y-0.5'
              }`}
            >
              <span>{loading ? 'Initializing Session...' : 'Start Assessment'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
