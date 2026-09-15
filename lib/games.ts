export type Category = 'arcade' | 'puzzle' | 'action' | 'classic' | 'sandbox';

export type GameMeta = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  categories: Category[];
};

export const CATEGORIES: { id: Category | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '🔥' },
  { id: 'arcade', label: 'Arcade', icon: '🕹️' },
  { id: 'puzzle', label: 'Puzzle', icon: '🧩' },
  { id: 'action', label: 'Action', icon: '⚡' },
  { id: 'classic', label: 'Classic', icon: '👾' },
  { id: 'sandbox', label: 'Sandbox', icon: '🏗️' }
];

export const GAMES: GameMeta[] = [
  {
    slug: 'fishing',
    title: 'Shoozy Fishing',
    description: 'Cast your line and catch the biggest fish in the sea.',
    emoji: '�',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    categories: ['arcade', 'classic'],
  },
  {
    slug: 'shoozy-craft',
    title: 'Shoozy Craft',
    description: 'A voxel sandbox with infinite procedural terrain. Mine, build, explore.',
  emoji: '🧱',
  gradient: 'linear-gradient(135deg, #7ab850 0%, #8a6a3a 100%)',
  categories: ['sandbox', 'action'],
},
  {
    slug: 'snake',
    title: 'Neon Snake',
    description: 'Classic snake reborn with neon glow and climbing speed.',
    emoji: '🐍',
    gradient: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
    categories: ['arcade', 'classic'],
  },
  {
    slug: 'memory',
    title: 'Memory Match',
    description: 'Flip cards and match pairs. Quick, focused puzzle fun.',
    emoji: '🧠',
    gradient: 'linear-gradient(135deg, #f97316 0%, #9a3412 100%)',
    categories: ['puzzle', 'classic'],
  },
  {
    slug: 'breakout',
    title: 'Breakout',
    description: 'Smash every brick with a paddle and ball.',
    emoji: '🧱',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)',
    categories: ['arcade', 'action', 'classic'],
  },
  {
  slug: 'sniper',
  title: 'Shoozy Sniper',
  description: 'Long-range precision shooting. Account for wind, chain combos, master the scope.',
  emoji: '🎯',
  gradient: 'linear-gradient(135deg, #7c3aed 0%, #1e1b4b 100%)',
  categories: ['action', 'arcade'],
},
{
  slug: 'hunter',
  title: 'Shoozy Hunter',
  description: 'Pilot a chopper and hunt wild game from above. Chain kills for big multipliers.',
  emoji: '🚁',
  gradient: 'linear-gradient(135deg, #22c55e 0%, #052e16 100%)',
  categories: ['action', 'arcade'],
},
{
  slug: 'riders',
  title: 'Shoozy Riders',
  description: 'Multiplayer vehicle sandbox. Pick a ride, pick a world, race with friends.',
  emoji: '🏎️',
  gradient: 'linear-gradient(135deg, #8b5cf6 0%, #e11d48 100%)',
  categories: ['action', 'arcade'],
},
{
  slug: 'parkour',
  title: 'Shoozy Parkour',
  description: 'First-person parkour racing with wall-runs, wall-jumps, and live multiplayer ghosts.',
  emoji: '🏃',
  gradient: 'linear-gradient(135deg, #00e5ff 0%, #7c3aed 100%)',
  categories: ['action', 'arcade'],
},
];

export type GameStats = {
  slug: string;
  likes: number;
  dislikes: number;
  plays: number;
  userVote: 1 | -1 | null;
};

