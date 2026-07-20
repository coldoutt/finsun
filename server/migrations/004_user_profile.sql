alter table users
add column if not exists first_name text not null default '';

alter table users
add column if not exists last_name text not null default '';

update users
set first_name = 'Tony', last_name = 'Gazz'
where lower(email::text) = 'tonygazz@gmail.com'
  and first_name = ''
  and last_name = '';
