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

    let query = 'SELECT * FROM fact_cards';
    let params: any[] = [];

    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    query += ' ORDER BY sort_order ASC, id ASC';

    const rows = db.prepare(query).all(...params) as any[];
    const facts = rows.map((r) => ({
      id: r.id,
      category: r.category,
      title: r.title,
      main_number: r.main_number,
      unit: r.unit,
      short_explanation: r.short_explanation,
      formula: r.formula,
      formula_components: JSON.parse(r.formula_components_json || '[]'),
      calculation_example: r.calculation_example,
      source: r.source,
      reference_date: r.reference_date,
      plain_meaning: r.plain_meaning,
      sort_order: r.sort_order,
    }));

    const categoriesRows = db.prepare('SELECT DISTINCT category FROM fact_cards ORDER BY category ASC').all() as { category: string }[];
    const categories = ['All', ...categoriesRows.map((c) => c.category)];

    return NextResponse.json({
      success: true,
      data: {
        categories,
        total: facts.length,
        facts,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
