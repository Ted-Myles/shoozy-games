import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST /api/play
// Body: { slug: string, playerId: string }
// Records a unique play (only counts each player once per game)
export async function POST(req: NextRequest) {
  try {
    let body: { slug?: unknown; playerId?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { step: 'parse', error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const slug = typeof body.slug === 'string' ? body.slug : null;
    const playerId = typeof body.playerId === 'string' ? body.playerId : null;

    if (!slug) {
      return NextResponse.json(
        { step: 'validate', error: 'Missing slug' },
        { status: 400 }
      );
    }
    if (!playerId) {
      return NextResponse.json(
        { step: 'validate', error: 'Missing playerId' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // Call the atomic RPC
    const { data, error } = await supabase.rpc('record_unique_play', {
      p_game_id: slug,
      p_player_id: playerId,
    });

    if (error) {
      return NextResponse.json(
        {
          step: 'rpc',
          error: error.message,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    const row = Array.isArray(data) ? data[0] : data;

    return NextResponse.json({
      ok: true,
      slug,
      uniquePlayers: Number(row?.unique_players ?? 0),
      isNew: Boolean(row?.is_new),
    });
  } catch (err) {
    return NextResponse.json(
      { step: 'unexpected', error: (err as Error).message },
      { status: 500 }
    );
  }
}