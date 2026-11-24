import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const body = await request.json();
    const { state_id, city_id, city_other, language_code, set_code } = body;

    if (!state_id || !language_code) {
      return NextResponse.json(
        { success: false, error: 'State and language selection are required.' },
        { status: 400 }
      );
    }

    // Determine target question set
    let targetSetCode = set_code;
    const activeSets = db.prepare('SELECT code FROM assessment_sets WHERE is_active = 1').all() as { code: string }[];
    const validCodes = activeSets.map((s) => s.code);

    if (!targetSetCode || targetSetCode === 'RANDOM' || !validCodes.includes(targetSetCode)) {
      if (activeSets.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeSets.length);
        targetSetCode = activeSets[randomIndex].code;
      } else {
        targetSetCode = 'SET_A';
      }
    }

    const sessionId = `SES_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO assessment_sessions (
        id, set_code, state_id, city_id, city_other, language_code, started_at, updated_at, status, current_level, current_question, answers_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'in_progress', 1, 1, '{}')
    `);

    insertStmt.run(sessionId, targetSetCode, state_id, city_id || null, city_other || null, language_code, now, now);

    return NextResponse.json({
      success: true,
      data: {
        session_id: sessionId,
        set_code: targetSetCode,
        language_code,
        started_at: now,
      },
    });
  } catch (error: any) {
    console.error('Error starting assessment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
