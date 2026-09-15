'use client';

import Link from 'next/link';
import type { GameMeta, GameStats } from '@/lib/games';

type Props = {
  game: GameMeta;
  stats: GameStats | undefined;
};

export default function GameCard({ game, stats }: Props) {
  const players = stats?.plays ?? 0;

  return (
    <Link href={`/games/${game.slug}/`} className="card">
      <div className="card-art" style={{ background: game.gradient }}>
        <span className="card-emoji">{game.emoji}</span>
      </div>

      <div className="card-players">
        <span className="dot" />
        {players.toLocaleString()}
      </div>

      <div className="card-title">{game.title}</div>
    </Link>
  );
}