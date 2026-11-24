import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = 'SELECT id, category, question, options_json, correct_answer, explanation, verified_source, difficulty FROM trivia_questions';
    let params: any[] = [];

    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    query += ' ORDER BY id ASC';

    const rows = db.prepare(query).all(...params) as any[];
    const questions = rows.map((r) => ({
      id: r.id,
      category: r.category,
      question: r.question,
      options: JSON.parse(r.options_json),
      correct_answer: r.correct_answer,
      explanation: r.explanation,
      verified_source: r.verified_source,
      difficulty: r.difficulty,
    }));

    // Categories list
    const categoriesRows = db.prepare('SELECT DISTINCT category FROM trivia_questions ORDER BY category ASC').all() as { category: string }[];
    const categories = ['All', ...categoriesRows.map((c) => c.category)];

    return NextResponse.json({
      success: true,
      data: {
        categories,
        total: questions.length,
        questions,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
