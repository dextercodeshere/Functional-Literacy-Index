import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    ensureDbInitialized();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('state_id');

    if (!stateId) {
      return NextResponse.json({ success: false, error: 'state_id query parameter is required' }, { status: 400 });
    }

    const cities = db.prepare('SELECT id, state_id, name, tier FROM cities WHERE state_id = ? ORDER BY name ASC').all(stateId);
    return NextResponse.json({ success: true, data: cities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
