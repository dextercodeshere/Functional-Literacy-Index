import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const body = await request.json();
    const { session_id, current_level, current_question, answers } = body;

    if (!session_id) {
      return NextResponse.json({ success: false, error: 'session_id is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const updateStmt = db.prepare(`
      UPDATE assessment_sessions
      SET 
        current_level = COALESCE(?, current_level),
        current_question = COALESCE(?, current_question),
        answers_json = ?,
        updated_at = ?
      WHERE id = ? AND status = 'in_progress'
    `);

    updateStmt.run(current_level, current_question, JSON.stringify(answers || {}), now, session_id);

    return NextResponse.json({ success: true, updated_at: now });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
