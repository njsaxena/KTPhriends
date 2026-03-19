-- ─────────────────────────────────────────────────────────
-- KTPhriends — Supabase Database Schema
-- Run this in your Supabase SQL editor to set up the DB.
-- ─────────────────────────────────────────────────────────

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";

-- ── profiles ────────────────────────────────────────────
-- One row per user (both pledges and brothers).
-- Extends auth.users — id must match the Supabase auth user id.

create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null unique,
  full_name           text not null default '',
  initials            text not null default '',
  role                text not null default 'pledge' check (role in ('pledge', 'brother', 'admin')),
  major               text,
  grad_year           int,
  ktp_role            text,          -- e.g. "Treasurer", "VP", "Member"
  bio                 text,
  avatar_color        text not null default 'blue' check (avatar_color in ('blue', 'green')),
  available_this_week boolean not null default false,
  budget_max          int not null default 15,
  locations           text[] not null default '{}',
  transport           text[] not null default '{}',
  food_prefs          text[] not null default '{}',
  sports              text[] not null default '{}',
  hobbies             text[] not null default '{}',
  preferred_spots     text[] not null default '{}',
  profile_complete    boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── availability ────────────────────────────────────────
-- One row per user (upsert on save).
-- time_blocks stores "day,slot" strings (e.g. "0,2" = Monday 10am).

create table public.availability (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  time_blocks  text[] not null default '{}',
  week_of      date,   -- null = recurring; set for one-off overrides
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, week_of)
);

-- ── chat_requests ───────────────────────────────────────

create table public.chat_requests (
  id                      uuid primary key default uuid_generate_v4(),
  pledge_id               uuid not null references public.profiles(id) on delete cascade,
  brother_id              uuid not null references public.profiles(id) on delete cascade,
  status                  text not null default 'requested'
                            check (status in ('requested', 'confirmed', 'completed', 'cancelled')),
  proposed_time           timestamptz,
  confirmed_time          timestamptz,
  location                text,
  pledge_note             text,
  pledge_marked_complete  boolean not null default false,
  brother_marked_complete boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  -- A pledge can only have one active request with a given brother at a time
  unique (pledge_id, brother_id, status)
);

-- ── Row Level Security ───────────────────────────────────

alter table public.profiles      enable row level security;
alter table public.availability   enable row level security;
alter table public.chat_requests  enable row level security;

-- profiles: users can read all profiles, but only update their own
create policy "anyone can read profiles"
  on public.profiles for select using (true);

create policy "users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- availability: same pattern
create policy "anyone can read availability"
  on public.availability for select using (true);

create policy "users can upsert own availability"
  on public.availability for insert with check (auth.uid() = user_id);

create policy "users can update own availability"
  on public.availability for update using (auth.uid() = user_id);

-- chat_requests: pledges & brothers can see their own; admins see all
create policy "users can see their own chats"
  on public.chat_requests for select
  using (auth.uid() = pledge_id or auth.uid() = brother_id);

create policy "pledges can insert chat requests"
  on public.chat_requests for insert
  with check (auth.uid() = pledge_id);

create policy "brothers can update chat requests directed at them"
  on public.chat_requests for update
  using (auth.uid() = brother_id or auth.uid() = pledge_id);

-- ── Triggers ─────────────────────────────────────────────

-- Auto-update updated_at on profiles
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

create trigger availability_updated_at
  before update on public.availability
  for each row execute function update_updated_at();

create trigger chat_requests_updated_at
  before update on public.chat_requests
  for each row execute function update_updated_at();

-- ── Auto-create profile on signup ────────────────────────
-- When a new user signs in via magic link, create a stub profile.

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, initials, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    upper(left(coalesce(new.raw_user_meta_data->>'full_name', ''), 1)),
    'pledge'  -- default; admin can promote to 'brother' or 'admin'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
