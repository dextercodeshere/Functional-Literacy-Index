import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    ensureDbInitialized();
    const db = getDb();

    // Query real-time participant sessions directly from database
    const sessionCounts = db.prepare(`
      SELECT 
        COUNT(*) as total_started,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as total_completed,
        COUNT(DISTINCT state_id) as active_states
      FROM assessment_sessions
    `).get() as { total_started: number; total_completed: number | null; active_states: number };

    // Query real-time benchmark completions
    const benchmarkResult = db.prepare(`
      SELECT COUNT(*) as benchmark_met
      FROM assessment_results
      WHERE meets_benchmark = 1
    `).get() as { benchmark_met: number };

    const totalStarted = sessionCounts?.total_started || 0;
    const totalCompleted = sessionCounts?.total_completed || 0;
    const benchmarkMet = benchmarkResult?.benchmark_met || 0;
    const participatingStates = sessionCounts?.active_states || 0;

    // Calculate live benchmark percentage
    const benchmarkPct = totalCompleted > 0
      ? Number(((benchmarkMet / totalCompleted) * 100).toFixed(1))
      : 0.0;

    // Update statistics table with current real-time snapshot
    const now = new Date().toISOString();
    try {
      db.prepare(`UPDATE statistics SET stat_value = ?, updated_at = ? WHERE stat_key = 'total_started'`).run(totalStarted, now);
      db.prepare(`UPDATE statistics SET stat_value = ?, updated_at = ? WHERE stat_key = 'total_completed'`).run(totalCompleted, now);
      db.prepare(`UPDATE statistics SET stat_value = ?, updated_at = ? WHERE stat_key = 'benchmark_attainment_pct'`).run(benchmarkPct, now);
      db.prepare(`UPDATE statistics SET stat_value = ?, updated_at = ? WHERE stat_key = 'participating_states'`).run(participatingStates, now);
    } catch (e) {
      // Ignore background sync errors
    }

    return NextResponse.json({
      success: true,
      data: {
        total_started: totalStarted,
        total_completed: totalCompleted,
        benchmark_attainment_pct: benchmarkPct,
        participating_states: participatingStates,
        label: "Benchmark attainment among completed participants",
        explanation: "These results represent participants who completed this platform's assessment. They are not a representative estimate of India's national literacy rate.",
        is_demonstration: false,
        telemetry_mode: "Live Real-Time Telemetry",
      },
    });
  } catch (error: any) {
    console.error('Error fetching live stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
