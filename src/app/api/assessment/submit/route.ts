import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const body = await request.json();
    const { session_id, answers } = body;

    if (!session_id) {
      return NextResponse.json({ success: false, error: 'session_id is required' }, { status: 400 });
    }

    // Check if session exists
    const session = db.prepare(`
      SELECT s.*, st.name as state_name, c.name as city_name, l.name as language_name
      FROM assessment_sessions s
      LEFT JOIN states st ON s.state_id = st.id
      LEFT JOIN cities c ON s.city_id = c.id
      LEFT JOIN languages l ON s.language_code = l.code
      WHERE s.id = ?
    `).get(session_id) as any;

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    const targetSetCode = session.set_code || 'SET_A';

    // Fetch all 35 questions for this set from database with correct answers & explanations
    const allQuestions = db.prepare(`
      SELECT 
        id, level_number, level_title, question_number, skill_category,
        question_text, options_json, correct_answer, explanation,
        stimulus_title, stimulus_content
      FROM questions
      WHERE set_code = ?
      ORDER BY level_number ASC, question_number ASC
    `).all(targetSetCode) as any[];

    // Fetch translations if non-English
    let translationsMap: Record<string, any> = {};
    if (session.language_code !== 'en') {
      const transRows = db.prepare(`
        SELECT question_id, stimulus_title, stimulus_content, question_text, options_json, explanation
        FROM question_translations
        WHERE language_code = ?
      `).all(session.language_code) as any[];

      for (const t of transRows) {
        translationsMap[t.question_id] = t;
      }
    }

    let totalScore = 0;
    const maxScore = allQuestions.length || 35;
    const userAnswers: Record<string, string> = answers || JSON.parse(session.answers_json || '{}');

    // Categorization aggregates
    const levelScores: Record<string, { correct: number; total: number; percentage: number; title: string }> = {
      '1': { correct: 0, total: 0, percentage: 0, title: 'LEVEL 1 — FOUNDATION' },
      '2': { correct: 0, total: 0, percentage: 0, title: 'LEVEL 2 — EVERYDAY READER' },
      '3': { correct: 0, total: 0, percentage: 0, title: 'LEVEL 3 — FUNCTIONAL THINKER' },
      '4': { correct: 0, total: 0, percentage: 0, title: 'LEVEL 4 — ANALYTICAL MIND' },
      '5': { correct: 0, total: 0, percentage: 0, title: 'LEVEL 5 — MASTER INTERPRETER' },
    };

    const categoryScores: Record<string, { correct: number; total: number; percentage: number }> = {
      'Reading Comprehension': { correct: 0, total: 0, percentage: 0 },
      'Numeracy & Quantitative': { correct: 0, total: 0, percentage: 0 },
      'Practical Interpretation': { correct: 0, total: 0, percentage: 0 },
      'Analytical Reasoning': { correct: 0, total: 0, percentage: 0 },
      'Accessing Information': { correct: 0, total: 0, percentage: 0 },
    };

    function mapSkillToCategory(rawSkill: string): string {
      const s = rawSkill.toLowerCase();
      if (s.includes('arithmetic') || s.includes('numeracy') || s.includes('percentage') || s.includes('calculation') || s.includes('mathematics')) {
        return 'Numeracy & Quantitative';
      }
      if (s.includes('evaluating') || s.includes('analytical') || s.includes('comparing') || s.includes('inference') || s.includes('argument') || s.includes('evidence') || s.includes('logical')) {
        return 'Analytical Reasoning';
      }
      if (s.includes('accessing') || s.includes('finding') || s.includes('locating')) {
        return 'Accessing Information';
      }
      if (s.includes('practical') || s.includes('instructions') || s.includes('schedule') || s.includes('notice') || s.includes('bill') || s.includes('real-world') || s.includes('written information')) {
        return 'Practical Interpretation';
      }
      return 'Reading Comprehension';
    }

    const detailedReviews = [];

    for (const q of allQuestions) {
      const trans = translationsMap[q.id];
      const selectedOption = userAnswers[q.id] || '';
      const isCorrect = selectedOption.toUpperCase() === q.correct_answer.toUpperCase();

      if (isCorrect) {
        totalScore += 1;
      }

      // Level breakdown
      const lvlKey = String(q.level_number);
      if (levelScores[lvlKey]) {
        levelScores[lvlKey].total += 1;
        if (isCorrect) levelScores[lvlKey].correct += 1;
      }

      // Category breakdown
      const broadCat = mapSkillToCategory(q.skill_category);
      if (categoryScores[broadCat]) {
        categoryScores[broadCat].total += 1;
        if (isCorrect) categoryScores[broadCat].correct += 1;
      }

      const options = trans?.options_json ? JSON.parse(trans.options_json) : JSON.parse(q.options_json);

      detailedReviews.push({
        question_id: q.id,
        level_title: q.level_title,
        question_text: trans?.question_text || q.question_text,
        stimulus_title: trans?.stimulus_title || q.stimulus_title,
        stimulus_content: trans?.stimulus_content || q.stimulus_content,
        selected_option: selectedOption,
        correct_option: q.correct_answer,
        is_correct: isCorrect,
        explanation: trans?.explanation || q.explanation,
        skill_category: q.skill_category,
        options,
      });
    }

    // Compute percentages
    for (const lvl of Object.values(levelScores)) {
      lvl.percentage = lvl.total > 0 ? Number(((lvl.correct / lvl.total) * 100).toFixed(1)) : 0;
    }
    for (const cat of Object.values(categoryScores)) {
      cat.percentage = cat.total > 0 ? Number(((cat.correct / cat.total) * 100).toFixed(1)) : 0;
    }

    const overallPercentage = maxScore > 0 ? Number(((totalScore / maxScore) * 100).toFixed(1)) : 0;
    const meetsBenchmark = overallPercentage >= 70.0; // Benchmark attainment is 70%

    // Provisional platform proficiency title
    let provisionalLevel = 'LEVEL 1 — FOUNDATION (Preliminary)';
    let provisionalLevelNum = 1;

    if (totalScore >= 31) {
      provisionalLevel = 'LEVEL 5 — MASTER INTERPRETER (Preliminary)';
      provisionalLevelNum = 5;
    } else if (totalScore >= 25) {
      provisionalLevel = 'LEVEL 4 — ANALYTICAL MIND (Preliminary)';
      provisionalLevelNum = 4;
    } else if (totalScore >= 19) {
      provisionalLevel = 'LEVEL 3 — FUNCTIONAL THINKER (Preliminary)';
      provisionalLevelNum = 3;
    } else if (totalScore >= 13) {
      provisionalLevel = 'LEVEL 2 — EVERYDAY READER (Preliminary)';
      provisionalLevelNum = 2;
    }

    // Identify strongest skill and improvement areas
    const sortedCats = Object.entries(categoryScores).sort((a, b) => b[1].percentage - a[1].percentage);
    const strongestSkill = sortedCats[0] ? `${sortedCats[0][0]} (${sortedCats[0][1].percentage}%)` : 'Reading Comprehension';

    const improvementAreas: string[] = [];
    for (const [catName, catData] of sortedCats.slice(-2)) {
      if (catData.percentage < 75) {
        improvementAreas.push(`${catName}: Focus on multi-step calculations, data interpretation or contextual reading verification.`);
      }
    }
    if (improvementAreas.length === 0) {
      improvementAreas.push('All skill domains achieved high proficiency. You have demonstrated exemplary functional literacy across all five proficiency tiers.');
    }

    const now = new Date().toISOString();
    const resultId = `RES_${session_id}`;

    // Upsert into assessment_results
    const insertResult = db.prepare(`
      INSERT OR REPLACE INTO assessment_results (
        id, session_id, total_score, max_score, percentage, meets_benchmark,
        provisional_level, provisional_level_num, category_scores_json,
        level_scores_json, strongest_skill, improvement_areas_json, generated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertResult.run(
      resultId,
      session_id,
      totalScore,
      maxScore,
      overallPercentage,
      meetsBenchmark ? 1 : 0,
      provisionalLevel,
      provisionalLevelNum,
      JSON.stringify(categoryScores),
      JSON.stringify(levelScores),
      strongestSkill,
      JSON.stringify(improvementAreas),
      now
    );

    // Mark session as completed
    db.prepare(`
      UPDATE assessment_sessions
      SET status = 'completed', completed_at = ?, updated_at = ?, answers_json = ?
      WHERE id = ?
    `).run(now, now, JSON.stringify(userAnswers), session_id);

    return NextResponse.json({
      success: true,
      data: {
        session_id,
        set_code: targetSetCode,
        total_score: totalScore,
        max_score: maxScore,
        percentage: overallPercentage,
        meets_benchmark: meetsBenchmark,
        provisional_level: provisionalLevel,
        provisional_level_num: provisionalLevelNum,
        category_scores: categoryScores,
        level_scores: levelScores,
        strongest_skill: strongestSkill,
        improvement_areas: improvementAreas,
        detailed_reviews: detailedReviews,
        generated_at: now,
        participant_meta: {
          state: session.state_name || 'India',
          city: session.city_name || session.city_other || 'General',
          language: session.language_name || 'English',
        },
      },
    });
  } catch (error: any) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
