'use client';

import React, { useState } from 'react';
import ParticipationDashboard from '../components/ParticipationDashboard';
import PreSurveyRegistration from '../components/PreSurveyRegistration';
import AssessmentRunner from '../components/AssessmentRunner';
import ResultsView from '../components/ResultsView';
import { AssessmentResult } from '../lib/types';

export default function LiteracySurveyPage() {
  const [viewState, setViewState] = useState<'dashboard' | 'setup' | 'assessment' | 'results'>('dashboard');
  const [activeSession, setActiveSession] = useState<{
    sessionId: string;
    setCode?: string;
    stateId: number;
    cityId?: number;
    cityOther?: string;
    languageCode: string;
  } | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const handleStartSetup = () => {
    setViewState('setup');
  };

  const handleSetupComplete = (sessionData: {
    sessionId: string;
    setCode?: string;
    stateId: number;
    cityId?: number;
    cityOther?: string;
    languageCode: string;
  }) => {
    setActiveSession(sessionData);
    setViewState('assessment');
  };

  const handleAssessmentComplete = (resultData: AssessmentResult) => {
    setAssessmentResult(resultData);
    setViewState('results');
  };

  const handleRetake = () => {
    setActiveSession(null);
    setAssessmentResult(null);
    setViewState('setup');
  };

  const handleCancelSetup = () => {
    setViewState('dashboard');
  };

  return (
    <div className="min-h-[85vh]">
      {viewState === 'dashboard' && (
        <ParticipationDashboard onStartClick={handleStartSetup} />
      )}

      {viewState === 'setup' && (
        <PreSurveyRegistration
          onStart={handleSetupComplete}
          onCancel={handleCancelSetup}
        />
      )}

      {viewState === 'assessment' && activeSession && (
        <AssessmentRunner
          sessionId={activeSession.sessionId}
          languageCode={activeSession.languageCode}
          setCode={activeSession.setCode}
          onComplete={handleAssessmentComplete}
          onExit={() => setViewState('dashboard')}
        />
      )}

      {viewState === 'results' && assessmentResult && (
        <ResultsView
          result={assessmentResult}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}
