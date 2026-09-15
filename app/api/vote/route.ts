import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const slugsParam = req.nextUrl.searchParams.get('slugs') || '';
    const slugs = slugsParam
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (slugs.length === 0) {
      return NextResponse.json({});
    }

    const supabase = getServerSupabase();

    // 1. Get basic stats
    const { data: games, error: gamesErr } = await supabase
      .from('games')
      .select('id, likes, dislikes')
      .in('id', slugs);

    if (gamesErr) {
      return NextResponse.json(
        { step: 'games', error: gamesErr.message, code: gamesErr.code },
        { status: 500 }
      );
    }

    // 2. Get unique player counts
    const { data: uniqueData, error: uniqueErr } = await supabase.rpc(
      'get_unique_player_counts',
      { game_ids: slugs }
    );

    if (uniqueErr) {
      console.error('[vote GET] unique count error:', uniqueErr);
    }

    const uniqueMap: Record<string, number> = {};
    for (const u of uniqueData ?? []) {
      uniqueMap[u.game_id] = Number(u.unique_players);
    }

    const result: Record<
      string,
      { slug: string; likes: number; dislikes: number; plays: number }
    > = {};

    for (const row of games ?? []) {
      result[row.id] = {
        slug: row.id,
        likes: row.likes ?? 0,
        dislikes: row.dislikes ?? 0,
        plays: uniqueMap[row.id] ?? 0, // ← now shows unique players
      };
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message, step: 'GET' },
      { status: 500 }
    );
  }
}

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase server environment variables.');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
