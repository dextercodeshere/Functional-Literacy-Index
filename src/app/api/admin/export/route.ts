import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    const records = db.prepare(`
      SELECT 
        s.id as session_id,
        st.name as state,
        c.name as city,
        l.name as language,
        s.started_at,
        s.completed_at,
        s.status,
        r.total_score,
        r.percentage,
        r.meets_benchmark,
        r.provisional_level,
        r.strongest_skill
      FROM assessment_sessions s
      LEFT JOIN assessment_results r ON s.id = r.session_id
      LEFT JOIN states st ON s.state_id = st.id
      LEFT JOIN cities c ON s.city_id = c.id
      LEFT JOIN languages l ON s.language_code = l.code
      ORDER BY s.started_at DESC
    `).all() as any[];

    if (format === 'csv') {
      const headers = ['Session ID', 'State', 'City', 'Language', 'Started At', 'Completed At', 'Status', 'Score', 'Percentage', 'Meets Benchmark', 'Provisional Level', 'Strongest Skill'];
      const rows = records.map((r) => [
        r.session_id,
        `"${r.state || 'N/A'}"`,
        `"${r.city || 'N/A'}"`,
        `"${r.language || 'N/A'}"`,
        r.started_at,
        r.completed_at || '',
        r.status,
        r.total_score ?? '',
        r.percentage ?? '',
        r.meets_benchmark ? 'Yes' : 'No',
        `"${r.provisional_level || ''}"`,
        `"${r.strongest_skill || ''}"`,
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="anonymized_literacy_data.csv"',
        },
      });
    }

    return NextResponse.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
