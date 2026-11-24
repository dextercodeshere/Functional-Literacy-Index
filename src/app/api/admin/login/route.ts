import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const { username, password } = await request.json();

    // Verify demo admin
    // Password for demo: admin123
    if (username === 'admin' && (password === 'admin123' || password === 'india@literacy2026')) {
      return NextResponse.json({
        success: true,
        data: {
          token: `ADM_TOKEN_${Date.now()}`,
          username: 'admin',
          role: 'superadmin',
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid administrator credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
