-- ============================================================
-- faceless-reels  Supabase schema
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query)
-- ============================================================

-- 1) PROFILES ------------------------------------------------
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text,
  credits        integer not null default 1,     -- 1 free video credit
  is_subscribed  boolean not null default false,
  stripe_customer_id text,
  created_at     timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using ( auth.uid() = id );

-- Auto-create a profile row (with 1 free credit) when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, credits, is_subscribed)
  values (new.id, new.email, 1, false)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2) VIDEOS --------------------------------------------------
create table if not exists public.videos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  niche       text not null,
  prompt      text not null,
  status      text not null default 'completed',  -- pending | completed | failed
  video_url   text,
  thumbnail_url text,
  created_at  timestamptz not null default now()
);

alter table public.videos enable row level security;

create policy "Videos are viewable by owner"
  on public.videos for select
  using ( auth.uid() = user_id );

create policy "Videos are insertable by owner"
  on public.videos for insert
  with check ( auth.uid() = user_id );

create index if not exists videos_user_id_idx on public.videos(user_id);
