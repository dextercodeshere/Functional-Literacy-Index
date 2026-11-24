import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const sessionId = params.id;

    const session = db.prepare(`
      SELECT s.*, st.name as state_name, c.name as city_name, l.name as language_name
      FROM assessment_sessions s
      LEFT JOIN states st ON s.state_id = st.id
      LEFT JOIN cities c ON s.city_id = c.id
      LEFT JOIN languages l ON s.language_code = l.code
      WHERE s.id = ?
    `).get(sessionId) as any;

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        state_id: session.state_id,
        state_name: session.state_name,
        city_id: session.city_id,
        city_name: session.city_name || session.city_other || 'Not specified',
        language_code: session.language_code,
        language_name: session.language_name,
        current_level: session.current_level,
        current_question: session.current_question,
        status: session.status,
        answers: JSON.parse(session.answers_json || '{}'),
        started_at: session.started_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
