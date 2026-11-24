import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const sessionId = params.sessionId;

    const result = db.prepare(`
      SELECT r.*, s.state_id, s.city_id, s.city_other, s.language_code, s.answers_json,
             st.name as state_name, c.name as city_name, l.name as language_name
      FROM assessment_results r
      JOIN assessment_sessions s ON r.session_id = s.id
      LEFT JOIN states st ON s.state_id = st.id
      LEFT JOIN cities c ON s.city_id = c.id
      LEFT JOIN languages l ON s.language_code = l.code
      WHERE r.session_id = ?
    `).get(sessionId) as any;

    if (!result) {
      return NextResponse.json({ success: false, error: 'Result not found for this session.' }, { status: 404 });
    }

    // Also build detailed review
    const allQuestions = db.prepare(`
      SELECT id, level_number, level_title, question_text, options_json, correct_answer, explanation,
             stimulus_title, stimulus_content, skill_category
      FROM questions
      WHERE set_code = 'SET_A'
      ORDER BY level_number ASC, question_number ASC
    `).all() as any[];

    let translationsMap: Record<string, any> = {};
    if (result.language_code !== 'en') {
      const transRows = db.prepare(`
        SELECT question_id, stimulus_title, stimulus_content, question_text, options_json, explanation
        FROM question_translations
        WHERE language_code = ?
      `).all(result.language_code) as any[];
      for (const t of transRows) {
        translationsMap[t.question_id] = t;
      }
    }

    const userAnswers = JSON.parse(result.answers_json || '{}');
    const detailedReviews = allQuestions.map((q) => {
      const trans = translationsMap[q.id];
      const selectedOption = userAnswers[q.id] || '';
      const isCorrect = selectedOption.toUpperCase() === q.correct_answer.toUpperCase();
      const options = trans?.options_json ? JSON.parse(trans.options_json) : JSON.parse(q.options_json);

      return {
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
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        session_id: result.session_id,
        total_score: result.total_score,
        max_score: result.max_score,
        percentage: result.percentage,
        meets_benchmark: Boolean(result.meets_benchmark),
        provisional_level: result.provisional_level,
        provisional_level_num: result.provisional_level_num,
        category_scores: JSON.parse(result.category_scores_json),
        level_scores: JSON.parse(result.level_scores_json),
        strongest_skill: result.strongest_skill,
        improvement_areas: JSON.parse(result.improvement_areas_json),
        generated_at: result.generated_at,
        state_name: result.state_name,
        city_name: result.city_name || result.city_other || 'Not specified',
        language_name: result.language_name,
        detailed_reviews: detailedReviews,
        disclaimer: "Preliminary assessment result — pilot framework. Not a statistically validated national proficiency classification.",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
