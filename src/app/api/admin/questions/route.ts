import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const setCode = searchParams.get('set_code') || 'SET_A';
    const level = searchParams.get('level');

    let query = 'SELECT * FROM questions WHERE set_code = ?';
    let params: any[] = [setCode];

    if (level) {
      query += ' AND level_number = ?';
      params.push(level);
    }
    query += ' ORDER BY level_number ASC, question_number ASC';

    const questions = db.prepare(query).all(...params) as any[];

    const formatted = questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options_json),
      stimulus_metadata: q.stimulus_metadata ? JSON.parse(q.stimulus_metadata) : null,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
