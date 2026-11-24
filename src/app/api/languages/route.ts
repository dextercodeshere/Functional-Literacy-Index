import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/seed';

export async function GET() {
  try {
    ensureDbInitialized();
    const db = getDb();
    const languages = db.prepare('SELECT id, code, name, native_name, is_reviewed, is_active FROM languages WHERE is_active = 1 ORDER BY id ASC').all();
    return NextResponse.json({ success: true, data: languages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
