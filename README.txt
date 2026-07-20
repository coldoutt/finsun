Финансовые итоги
================

Как открыть:
- Откройте `index.html` в браузере для интерфейса.
- Для многопользовательского режима запустите backend из папки `server/`.

Режимы работы:
- Без входа приложение работает в пустом гостевом режиме: активы и история не сохраняются.
- После регистрации или входа данные загружаются и сохраняются через backend API в персональный аккаунт.
- Для быстрого локального запуска без Docker и PostgreSQL используйте `DATA_BACKEND=file`.

Backend:
- Скопируйте `.env.example` в `.env`.
- Для локального режима без БД оставьте `DATA_BACKEND=file`.
- Если хотите PostgreSQL, переключите `DATA_BACKEND=postgres` и укажите `DATABASE_URL`.
- Установите зависимости: `npm install`
- Примените миграции: `npm run db:migrate`
- Запустите сервер: `npm run server:dev`
- Запустите frontend: `npm run web:start`

Основные backend endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/finance/state`
- `PUT /api/finance/state`
- `GET /api/metrics`

Метрики ЦБ на GitHub Pages:
- Актуальные курсы USD/EUR и инфляция хранятся в `metrics.json`.
- Workflow `.github/workflows/update-metrics.yml` проверяет данные ЦБ каждый час.
- Новый коммит создаётся только при изменении значений.
- Обновить снимок вручную можно командой `npm run metrics:update`.

Важно:
- Персональные данные теперь предназначены для хранения в PostgreSQL через backend.
- В локальном dev-режиме без БД они могут храниться в `server/data/app-data.json`.
- `finance.json` можно оставить как исторический статический файл и резерв для старого сценария, но новый frontend на него больше не опирается.
