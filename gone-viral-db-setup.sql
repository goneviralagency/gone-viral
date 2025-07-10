
-- AUTH users handled by Supabase auth
-- Extend using user_metadata during signup

-- AVAILABILITY table
create table if not exists availability (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  day_of_week text,
  start_time time,
  end_time time,
  timezone text,
  match_id uuid
);

-- BATTLES table
create table if not exists battles (
  id uuid primary key default uuid_generate_v4(),
  creator_a_id uuid references auth.users(id),
  creator_b_id uuid references auth.users(id),
  scheduled_at timestamptz,
  timezone text,
  match_id uuid,
  battle_confirmed_by_both boolean default false
);

-- CANCELLATIONS table
create table if not exists cancellations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  battle_id uuid references battles(id),
  reason text,
  created_at timestamptz default now()
);
