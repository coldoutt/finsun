create extension if not exists citext;

create table if not exists users (
  id bigserial primary key,
  email citext not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists user_sessions (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_used_at timestamptz not null default now()
);

create table if not exists user_finance_state (
  user_id bigint primary key references users(id) on delete cascade,
  current_rows jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists finance_snapshots (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  year integer not null,
  month integer not null check (month between 0 and 11),
  total bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year, month)
);

create table if not exists finance_rows (
  id bigserial primary key,
  snapshot_id bigint not null references finance_snapshots(id) on delete cascade,
  category text not null,
  name text not null,
  amount bigint not null default 0
);

create index if not exists user_sessions_user_id_idx on user_sessions(user_id);
create index if not exists user_sessions_expires_at_idx on user_sessions(expires_at);
create index if not exists finance_snapshots_user_id_idx on finance_snapshots(user_id);
create index if not exists finance_rows_snapshot_id_idx on finance_rows(snapshot_id);
