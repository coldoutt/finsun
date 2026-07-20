update users
set first_name = 'Антон', last_name = 'Гасилин'
where lower(email::text) = 'tonygazz@gmail.com'
  and first_name = 'Tony'
  and last_name = 'Gazz';
