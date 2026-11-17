alter table public.player_profiles
  add column if not exists gender text check (gender is null or gender in ('masculino', 'feminino')),
  add column if not exists experience bigint not null default 0 check (experience >= 0),
  add column if not exists progress_summary text,
  add column if not exists badges text[] not null default '{}',
  add column if not exists last_game_sync_at timestamptz;

alter table public.player_profiles
  alter column player_level set default 1,
  alter column region set default 'Kanto';

update public.player_profiles
set region = 'Kanto'
where region is null;

alter table public.player_profiles
  alter column region set not null;

alter table public.pokemon_party
  add column if not exists species_id text,
  add column if not exists nickname text check (nickname is null or char_length(nickname) <= 60);
