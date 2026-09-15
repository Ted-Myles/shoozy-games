'use client';

import Link from 'next/link';

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  onRandom?: () => void;
};

export default function Topbar({ search, onSearchChange, onRandom }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand" aria-label="Shoozy Games home">
          <span className="brand-icon" aria-hidden>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer rounded square with gradient */}
              <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#shoozyGrad)" />
              {/* Star burst / spark */}
              <path
                d="M20 9 L22.2 16.4 L29.5 18.5 L22.2 20.6 L20 28 L17.8 20.6 L10.5 18.5 L17.8 16.4 Z"
                fill="#fff"
                stroke="#fff"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
              {/* Small accent dot */}
              <circle cx="29" cy="11" r="2.4" fill="#fde68a" />
              <defs>
                <linearGradient id="shoozyGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="0.5" stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="brand-text">
            <span className="brand-shoozy">Shoozy</span>
            <span className="brand-games">Games</span>
          </span>
        </Link>

        <div className="search desktop-search">
          <input
            type="text"
            placeholder="Search games…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search games"
          />
          <span className="search-icon">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
        </div>

        <button
          className="random-btn"
          onClick={onRandom}
          aria-label="Play a random game"
          title="Play a random game"
        >
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <div className="mobile-search">
        <div className="search">
          <input
            type="text"
            placeholder="Search games…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search games"
          />
          <span className="search-icon">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
        </div>
      </div>
    </header>
  );
}