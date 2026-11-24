import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    let languageCode = searchParams.get('lang') || 'en';
    let targetSetCode = searchParams.get('set_code') || 'SET_A';

    if (sessionId) {
      const session = db.prepare('SELECT language_code, set_code FROM assessment_sessions WHERE id = ?').get(sessionId) as { language_code: string; set_code: string } | undefined;
      if (session) {
        if (session.language_code) languageCode = session.language_code;
        if (session.set_code) targetSetCode = session.set_code;
      }
    }

    const rows = db.prepare(`
      SELECT 
        id, set_code, level_number, level_title, question_number, question_type,
        skill_category, difficulty, stimulus_type, stimulus_title, stimulus_content,
        stimulus_metadata, question_text, options_json
      FROM questions
      WHERE set_code = ?
      ORDER BY level_number ASC, question_number ASC
    `).all(targetSetCode) as any[];

    // If non-English language requested, fetch translations
    let translationsMap: Record<string, any> = {};
    if (languageCode !== 'en') {
      const transRows = db.prepare(`
        SELECT question_id, stimulus_title, stimulus_content, question_text, options_json
        FROM question_translations
        WHERE language_code = ?
      `).all(languageCode) as any[];

      for (const t of transRows) {
        translationsMap[t.question_id] = t;
      }
    }

    const questions = rows.map((q) => {
      const trans = translationsMap[q.id];
      const options = trans?.options_json ? JSON.parse(trans.options_json) : JSON.parse(q.options_json);

      return {
        id: q.id,
        set_code: q.set_code,
        level_number: q.level_number,
        level_title: q.level_title,
        question_number: q.question_number,
        question_type: q.question_type,
        skill_category: q.skill_category,
        difficulty: q.difficulty,
        stimulus_type: q.stimulus_type,
        stimulus_title: trans?.stimulus_title || q.stimulus_title,
        stimulus_content: trans?.stimulus_content || q.stimulus_content,
        stimulus_metadata: q.stimulus_metadata ? JSON.parse(q.stimulus_metadata) : null,
        question_text: trans?.question_text || q.question_text,
        options,
        // Security rule: correct_answer and explanation are withheld until final submission
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        set_code: targetSetCode,
        language_code: languageCode,
        total_questions: questions.length,
        questions,
      },
    });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
