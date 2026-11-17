create table public.player_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  player_name text not null check (char_length(btrim(player_name)) between 1 and 60),
  gender text not null check (gender in ('masculino', 'feminino')),
  player_level integer not null default 1 check (player_level between 1 and 999),
  experience bigint not null default 0 check (experience >= 0),
  region text not null default 'Kanto' check (char_length(region) <= 60),
  progress_summary text,
  progress_note text check (progress_note is null or char_length(progress_note) <= 1000),
  badges text[] not null default '{}',
  last_game_sync_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.pokemon_party (
  user_id uuid not null references auth.users(id) on delete cascade,
  slot integer not null check (slot between 1 and 6),
  pokemon_name text not null check (char_length(btrim(pokemon_name)) between 1 and 60),
  pokemon_level integer check (pokemon_level is null or pokemon_level between 1 and 999),
  species_id text,
  nickname text check (nickname is null or char_length(nickname) <= 60),
  primary key (user_id, slot)
);

grant select, insert, update, delete on public.player_profiles to authenticated;
grant select, insert, update, delete on public.pokemon_party to authenticated;

alter table public.player_profiles enable row level security;
alter table public.pokemon_party enable row level security;

create policy "Users manage their own player profile"
  on public.player_profiles
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own Pokemon party"
  on public.pokemon_party
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
