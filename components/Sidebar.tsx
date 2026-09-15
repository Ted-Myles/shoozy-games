'use client';

import Link from 'next/link';

type Props = {
  active?: string;
};

export default function Sidebar({ active = 'home' }: Props) {
  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
        </svg>
      ),
    },
    {
      id: 'recent',
      label: 'Recent',
      href: '/#recent',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      ),
    },
    {
      id: 'popular',
      label: 'Popular',
      href: '/#popular',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 3c1 3.5 4 5 4 8.5A4.5 4.5 0 0 1 12 16a4.5 4.5 0 0 1-4-4.5C8 8 11 6.5 12 3z" />
          <path d="M12 16v5" />
          <path d="M8 21h8" />
        </svg>
      ),
    },
    {
      id: 'categories',
      label: 'Categories',
      href: '/#categories',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      id: 'random',
      label: 'Random',
      href: '/#random',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 4h4l3 4 3-4h4" />
          <path d="M20 4v4" />
          <path d="M4 20h4l3-4 3 4h4" />
          <path d="M20 20v-4" />
          <path d="M9 12l-3 0" />
          <path d="M18 12l-3 0" />
        </svg>
      ),
    },
    {
      id: 'multiplayer',
      label: 'Multiplayer',
      href: '/#multiplayer',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="9" cy="9" r="3" />
          <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
          <circle cx="17" cy="8" r="2.5" />
          <path d="M15 15c3 0 5 1.8 5 4.5" />
        </svg>
      ),
    },
    {
      id: 'action',
      label: 'Action',
      href: '/#action',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="m4 20 8-8" />
          <path d="m14 6 4-4 4 4-4 4-4-4z" />
          <path d="M16 12 8 20" />
        </svg>
      ),
    },
    {
      id: 'puzzle',
      label: 'Puzzle',
      href: '/#puzzle',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M9 3a2 2 0 0 1 4 0v1h3a1 1 0 0 1 1 1v3h1a2 2 0 0 1 0 4h-1v3a1 1 0 0 1-1 1h-3v-1a2 2 0 0 0-4 0v1H6a1 1 0 0 1-1-1v-3H4a2 2 0 0 1 0-4h1V5a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-logo" aria-label="PlayPort">
        🎮
      </Link>
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`sidebar-icon ${active === item.id ? 'active' : ''}`}
          aria-label={item.label}
          title={item.label}
        >
          {item.icon}
        </Link>
      ))}
    </aside>
  );
}