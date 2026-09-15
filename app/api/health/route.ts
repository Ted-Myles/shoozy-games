import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('games')
      .select('id, likes, dislikes, plays')
      .limit(10);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, hint: error.hint },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Supabase connected successfully',
      games: data,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}