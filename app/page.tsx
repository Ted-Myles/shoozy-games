'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import GameCard from '@/components/GameCard';
import { GAMES, Category, CATEGORIES } from '@/lib/games';
import { useStats } from '@/lib/useStats';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const router = useRouter();

  const slugs = useMemo(() => GAMES.map((g) => g.slug), []);
  const { stats } = useStats(slugs);

  const filteredGames = useMemo(() => {
    let list = GAMES;
    if (activeCategory !== 'all') {
      list = list.filter((g) => g.categories.includes(activeCategory));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: GAMES.length };
    for (const g of GAMES) {
      for (const c of g.categories) {
        result[c] = (result[c] ?? 0) + 1;
      }
    }
    return result;
  }, []);

  const totalPlayers = useMemo(
    () => Object.values(stats).reduce((sum, s) => sum + (s.plays ?? 0), 0),
    [stats]
  );

  const handleRandom = () => {
    if (filteredGames.length === 0) return;
    const random = filteredGames[Math.floor(Math.random() * filteredGames.length)];
    router.push(`/games/${random.slug}/`);
  };

  return (
    <>
      <div className="app-bg" />
      <div className="app">
        <Sidebar active="home" />

        <div className="main-col">
          <Topbar
            search={search}
            onSearchChange={setSearch}
            onRandom={handleRandom}
          />

          <main className="content">
            <div className="section-head">
              <h1 className="section-title">
                {search.trim() ? 'Search Results' : 'All Games'}
                <span className="count">{filteredGames.length}</span>
              </h1>
            </div>

            <div className="chips">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`chip ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="chip-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredGames.length > 0 ? (
              <div className="games-grid">
                {filteredGames.map((g) => (
                  <GameCard key={g.slug} game={g} stats={stats[g.slug]} />
                ))}
              </div>
            ) : (
              <div className="games-grid">
                <div className="empty-state">
                  <span className="emoji">🔍</span>
                  <p>No games match your search.</p>
                </div>
              </div>
            )}

            
          </main>
        </div>
      </div>
    </>
  );
}