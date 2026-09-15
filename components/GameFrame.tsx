'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { recordPlay, useStats } from '@/lib/useStats';

type Props = {
  title: string;
  slug: string;
  src: string;
};

export default function GameFrame({ title, slug, src }: Props) {
  // Stable array so useStats doesn't refetch on every render
  const slugs = useMemo(() => [slug], [slug]);
  const { stats } = useStats(slugs);

  // Record this play once per mount
  const countedRef = useRef(false);
  useEffect(() => {
    if (countedRef.current) return;
    countedRef.current = true;
    recordPlay(slug);
  }, [slug]);

  const current = stats[slug];
  const players = current?.plays ?? 0;

  return (
    <div className="game-view">
      <div className="game-view-header">
        <Link href="/" className="back-link">
          ← All Games
        </Link>
        <div className="game-view-title">{title}</div>
        <div className="game-view-meta">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
              }}
            />
            {players.toLocaleString()} players
          </span>
        </div>
      </div>
      <div className="game-frame-wrap">
        <iframe
          src={src}
          className="game-frame"
          title={title}
          allow="fullscreen; autoplay; accelerometer; gyroscope"
          loading="eager"
        />
      </div>
    </div>
  );
}