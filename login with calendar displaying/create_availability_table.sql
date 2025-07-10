-- SQL script to create the availability table in Supabase
create table if not exists availability (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  date text not null,              -- e.g. "2025-07-10"
  month text not null,             -- e.g. "2025-07"
  start_time text not null,        -- e.g. "09:00"
  end_time text not null,          -- e.g. "11:30"
  created_at timestamp with time zone default now(),

  constraint fk_user foreign key (user_id) references auth.users (id) on delete cascade
);
