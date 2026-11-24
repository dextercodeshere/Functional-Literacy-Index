import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export async function GET() {
  try {
    ensureDbInitialized();
    const db = getDb();
    const states = db.prepare('SELECT id, code, name, type FROM states ORDER BY name ASC').all();
    return NextResponse.json({ success: true, data: states });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
