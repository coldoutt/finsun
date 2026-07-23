# Финансовые итоги

Статическое веб-приложение работает на GitHub Pages, а регистрация и персональные данные хранятся в Supabase.

## Хранение данных

- Логины и безопасные хеши паролей находятся в закрытой таблице `auth.users`. Пароли в открытом виде не сохраняются и недоступны приложению.
- Имя и фамилия находятся в `public.profiles`.
- История финансов и текущие активы находятся в JSON-поле `public.finance_states.state`.
- Политики Row Level Security разрешают пользователю работать только со строками, связанными с его `auth.uid()`.
- `finance.json` содержит исходные исторические данные владельца. Они автоматически копируются в Supabase при первом подтверждённом входе `tonygazz@gmail.com`.
- Старые данные из `localStorage` автоматически переносятся при первом входе в соответствующий Supabase-аккаунт на том же устройстве.

Публичный ключ Supabase в `app.js` предназначен для браузера и не является секретом. Без пользовательской сессии и разрешения RLS он не даёт доступа к данным.

## Настройка Supabase

Схема проекта хранится в `supabase-schema.sql` и уже применена как миграция `create_user_profiles_and_finance_states`.

Для корректного возврата после подтверждения email добавьте в Supabase:

- `Authentication -> URL Configuration -> Site URL`: `https://coldoutt.github.io/finance/`
- `Authentication -> URL Configuration -> Redirect URLs`: `https://coldoutt.github.io/finance/**`

## Локальный запуск

Откройте `index.html` или запустите статический сервер:

```powershell
npm run web:start
```

Отдельный Express-сервер в `server/` оставлен для локальных экспериментов, но production-версия использует Supabase напрямую.
