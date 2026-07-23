-- Run through Supabase migrations. Browser access is always restricted by RLS.

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '' check (char_length(first_name) <= 80),
  last_name text not null default '' check (char_length(last_name) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.finance_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{"records":[],"currentRows":[],"ownerHistoryVersion":0}'::jsonb
    check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.finance_states enable row level security;

create policy "Users can read their profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can read their finance state"
on public.finance_states
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their finance state"
on public.finance_states
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their finance state"
on public.finance_states
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select, update on table public.profiles to authenticated;
grant select, insert, update on table public.finance_states to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
