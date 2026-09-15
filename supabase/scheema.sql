-- ============================================================
-- GAMES TABLE: one row per game
-- ============================================================
create table if not exists games (
  id text primary key,
  title text not null,
  likes integer not null default 0,
  dislikes integer not null default 0,
  plays integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- VOTES TABLE: one row per anonymous voter per game
-- voter_id is a random UUID stored in the browser's localStorage
-- ============================================================
create table if not exists votes (
  id bigserial primary key,
  game_id text not null references games(id) on delete cascade,
  voter_id text not null,
  vote smallint not null check (vote in (-1, 1)), -- -1 = dislike, 1 = like
  created_at timestamptz not null default now(),
  unique (game_id, voter_id)
);

create index if not exists votes_game_id_idx on votes(game_id);
create index if not exists votes_voter_id_idx on votes(voter_id);

-- ============================================================
-- PLAYS TABLE: optional (for unique-player counting)
-- if you only want total play counts, you can just increment games.plays
-- ============================================================
create table if not exists plays (
  id bigserial primary key,
  game_id text not null references games(id) on delete cascade,
  player_id text not null,
  played_at timestamptz not null default now()
);

create index if not exists plays_game_id_idx on plays(game_id);

-- ============================================================
-- ATOMIC INCREMENT FUNCTION FOR PLAYS
-- ============================================================
create or replace function increment_plays(gid text)
returns void
language sql
as $$
  update games set plays = plays + 1, updated_at = now() where id = gid;
$$;

-- ============================================================
-- SEED THE 3 GAMES
-- ============================================================
insert into games (id, title) values
  ('snake', 'Neon Snake'),
  ('memory', 'Memory Match'),
  ('breakout', 'Breakout')
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table games enable row level security;
alter table votes enable row level security;
alter table plays enable row level security;

-- Public can read game stats
create policy "public read games" on games for select using (true);

-- Only the service role (server) can mutate tables.
-- No insert/update/delete policies for anon → all writes go through API routes.