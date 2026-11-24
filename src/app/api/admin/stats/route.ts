import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();

    // Summary counts directly from real database records (Zero Fake Offsets)
    const totalSessions = db.prepare('SELECT COUNT(*) as count FROM assessment_sessions').get() as { count: number };
    const completedSessions = db.prepare('SELECT COUNT(*) as count FROM assessment_sessions WHERE status = "completed"').get() as { count: number };
    const inProgressSessions = db.prepare('SELECT COUNT(*) as count FROM assessment_sessions WHERE status = "in_progress"').get() as { count: number };

    // Set distribution
    const setDistribution = db.prepare(`
      SELECT set_code, COUNT(*) as count
      FROM assessment_sessions
      GROUP BY set_code
    `).all();

    // State distribution
    const stateDistribution = db.prepare(`
      SELECT st.name as state_name, COUNT(s.id) as count
      FROM assessment_sessions s
      JOIN states st ON s.state_id = st.id
      GROUP BY st.name
      ORDER BY count DESC
      LIMIT 10
    `).all();

    // Language distribution
    const languageDistribution = db.prepare(`
      SELECT l.name as language_name, l.code, COUNT(s.id) as count
      FROM assessment_sessions s
      JOIN languages l ON s.language_code = l.code
      GROUP BY l.name, l.code
      ORDER BY count DESC
    `).all();

    // Recent completions
    const recentCompletions = db.prepare(`
      SELECT r.id, r.session_id, r.total_score, r.percentage, r.provisional_level,
             r.generated_at, st.name as state_name, l.name as language_name,
             s.set_code
      FROM assessment_results r
      JOIN assessment_sessions s ON r.session_id = s.id
      LEFT JOIN states st ON s.state_id = st.id
      LEFT JOIN languages l ON s.language_code = l.code
      ORDER BY r.generated_at DESC
      LIMIT 15
    `).all();

    // Question sets
    const questionSets = db.prepare('SELECT * FROM assessment_sets ORDER BY id ASC').all();

    return NextResponse.json({
      success: true,
      data: {
        total_sessions: totalSessions?.count || 0,
        completed_sessions: completedSessions?.count || 0,
        in_progress_sessions: inProgressSessions?.count || 0,
        live_actual_sessions: totalSessions?.count || 0,
        live_actual_completed: completedSessions?.count || 0,
        set_distribution: setDistribution,
        state_distribution: stateDistribution,
        language_distribution: languageDistribution,
        recent_completions: recentCompletions,
        question_sets: questionSets,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
