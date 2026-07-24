# finsun

Статическое финансовое веб-приложение работает на GitHub Pages. Регистрация,
профили и персональные финансовые данные хранятся в Supabase.

## Хранение данных

- Email и хеши паролей находятся в закрытой схеме Supabase Auth.
- Имя и фамилия находятся в `public.profiles`.
- Активы, история и бюджеты находятся в JSON-поле
  `public.finance_states.state`.
- Row Level Security ограничивает доступ строками текущего `auth.uid()`.
- В репозитории нет персональных финансовых seed-данных или локальной базы
  пользователей.
- После успешной загрузки аккаунта приложение удаляет старые данные этого
  пользователя из legacy-ключа `finance-auth-v1` и удаляет устаревший ключ
  `finance-summary-v1`.

Supabase сохраняет в браузере только пользовательскую сессию, поскольку в
клиенте включён `persistSession`. Пароль в `localStorage` не записывается.

## Supabase

Актуальная схема находится в `supabase-schema.sql`.

Для возврата после подтверждения email настройте:

- `Authentication -> URL Configuration -> Site URL`:
  `https://coldoutt.github.io/finsun/`
- `Authentication -> URL Configuration -> Redirect URLs`:
  `https://coldoutt.github.io/finsun/**`

## Локальный запуск

Откройте `index.html` или запустите статический сервер:

```powershell
npm run web:start
```

Локальный сервер не хранит аккаунты или финансовые данные.

## Метрики ЦБ

Курсы USD/EUR и инфляция находятся в `metrics.json`. Workflow
`.github/workflows/update-metrics.yml` обновляет файл каждый час. Ручное
обновление:

```powershell
npm run metrics:update
```
