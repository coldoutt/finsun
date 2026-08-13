alter table public.finance_states
add column if not exists version bigint not null default 0;

do $$
begin
  alter table public.finance_states
  add constraint finance_states_version_nonnegative
  check (version >= 0);
exception
  when duplicate_object then null;
end
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'goal-images',
  'goal-images',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read their goal images" on storage.objects;
create policy "Users can read their goal images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'goal-images'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can upload their goal images" on storage.objects;
create policy "Users can upload their goal images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'goal-images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can delete their goal images" on storage.objects;
create policy "Users can delete their goal images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'goal-images'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
