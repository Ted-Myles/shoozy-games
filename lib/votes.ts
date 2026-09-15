'use client';

const VOTES_KEY = 'playport_votes_v1';

export type VoteState = {
  [slug: string]: 'like' | 'dislike';
};

export type VoteCounts = {
  [slug: string]: { likes: number; dislikes: number };
};

/**
 * Get the user's votes from localStorage.
 * No accounts — purely local per browser.
 */
export function getUserVotes(): VoteState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setUserVote(slug: string, vote: 'like' | 'dislike' | null) {
  if (typeof window === 'undefined') return;
  const votes = getUserVotes();
  if (vote === null) {
    delete votes[slug];
  } else {
    votes[slug] = vote;
  }
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
    // Notify other components on the same page
    window.dispatchEvent(new CustomEvent('playport-vote-change'));
  } catch {}
}

/**
 * Simulated global counts. Since there's no backend, we generate
 * deterministic-looking "seed" counts per slug so each game has a
 * baseline like/dislike count. The user's own vote adds to it.
 */
const SEED_COUNTS: VoteCounts = {
  snake: { likes: 412, dislikes: 38 },
  memory: { likes: 287, dislikes: 24 },
  breakout: { likes: 356, dislikes: 41 },
};

export function getVoteCounts(slug: string, userVote: 'like' | 'dislike' | null) {
  const base = SEED_COUNTS[slug] || { likes: 100, dislikes: 10 };
  return {
    likes: base.likes + (userVote === 'like' ? 1 : 0),
    dislikes: base.dislikes + (userVote === 'dislike' ? 1 : 0),
  };
}