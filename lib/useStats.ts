'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameStats } from './games';

// -------------------- Storage --------------------

const VOTER_KEY = 'playport_voter_id';
const VOTE_CACHE_KEY = 'playport_my_votes';
const PLAYED_KEY = 'playport_played_games';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getVoterId(): string {
  if (!isBrowser()) return '';
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}

function getMyVotes(): Record<string, 1 | -1> {
  if (!isBrowser()) return {};
  try {
    return JSON.parse(localStorage.getItem(VOTE_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function setMyVote(slug: string, vote: 1 | -1 | null) {
  if (!isBrowser()) return;
  const votes = getMyVotes();
  if (vote === null) delete votes[slug];
  else votes[slug] = vote;
  localStorage.setItem(VOTE_CACHE_KEY, JSON.stringify(votes));
  window.dispatchEvent(new CustomEvent('playport-vote-change'));
}

function getPlayedGames(): Record<string, true> {
  if (!isBrowser()) return {};
  try {
    return JSON.parse(localStorage.getItem(PLAYED_KEY) || '{}');
  } catch {
    return {};
  }
}

function markPlayed(slug: string) {
  if (!isBrowser()) return;
  const played = getPlayedGames();
  played[slug] = true;
  localStorage.setItem(PLAYED_KEY, JSON.stringify(played));
}

// -------------------- useStats hook --------------------

export function useStats(slugs: string[]) {
  const key = slugs.slice().sort().join(',');

  const [stats, setStats] = useState<Record<string, GameStats>>({});
  const [mounted, setMounted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const load = useCallback(async () => {
    if (!isBrowser() || !key) return;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`/api/vote?slugs=${encodeURIComponent(key)}`, {
        cache: 'no-store',
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as Record<
        string,
        { slug: string; likes: number; dislikes: number; plays: number }
      >;

      const myVotes = getMyVotes();
      const merged: Record<string, GameStats> = {};

      for (const slug of key.split(',')) {
        const d = data[slug] || { slug, likes: 0, dislikes: 0, plays: 0 };
        merged[slug] = {
          slug,
          likes: d.likes,
          dislikes: d.dislikes,
          plays: d.plays,
          userVote: myVotes[slug] ?? null,
        };
      }

      setStats(merged);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('[useStats] load failed:', err);
      }
    }
  }, [key]);

  useEffect(() => {
    if (!mounted) return;
    load();
  }, [mounted, load]);

  useEffect(() => {
    if (!mounted) return;
    const handler = () => load();
    window.addEventListener('playport-vote-change', handler);
    return () => window.removeEventListener('playport-vote-change', handler);
  }, [mounted, load]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const vote = useCallback(
    async (slug: string, dir: 1 | -1) => {
      if (!isBrowser()) return;

      const voterId = getVoterId();
      const current = stats[slug]?.userVote ?? null;
      const next: 1 | -1 | null = current === dir ? null : dir;

      // Optimistic update
      setStats((prev) => {
        const cur = prev[slug];
        if (!cur) return prev;
        let likes = cur.likes;
        let dislikes = cur.dislikes;
        if (cur.userVote === 1) likes -= 1;
        if (cur.userVote === -1) dislikes -= 1;
        if (next === 1) likes += 1;
        if (next === -1) dislikes += 1;
        return {
          ...prev,
          [slug]: { ...cur, likes, dislikes, userVote: next },
        };
      });

      setMyVote(slug, next);

      try {
        const res = await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, vote: next, voterId }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          console.error('[useStats] vote failed:', res.status, errBody);
          load();
          return;
        }

        const server = await res.json();
        setStats((prev) => {
          const cur = prev[slug];
          if (!cur) return prev;
          return {
            ...prev,
            [slug]: {
              ...cur,
              likes: server.likes ?? cur.likes,
              dislikes: server.dislikes ?? cur.dislikes,
              userVote:
                server.userVote === 1 || server.userVote === -1
                  ? server.userVote
                  : null,
            },
          };
        });
      } catch (err) {
        console.error('[useStats] vote network error:', err);
        load();
      }
    },
    [stats, load]
  );

  return { stats, vote, reload: load };
}

// -------------------- recordPlay --------------------

export async function recordPlay(slug: string) {
  if (!isBrowser()) return;

  // Skip if this browser already recorded this game
  const played = getPlayedGames();
  if (played[slug]) return;

  try {
    const playerId = getVoterId();
    const res = await fetch('/api/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, playerId }),
    });

    if (res.ok) {
      markPlayed(slug);
      window.dispatchEvent(new CustomEvent('playport-vote-change'));
    } else {
      const errBody = await res.json().catch(() => ({}));
      console.error('[recordPlay] failed:', res.status, errBody);
    }
  } catch (err) {
    console.error('[recordPlay] network error:', err);
  }
}