# Backend scaffold

This folder contains the first backend scaffold for turning the static dashboard into a multi-user application.

## Planned API surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/finance/state`
- `PUT /api/finance/state`
- `GET /api/metrics`

## Local setup

1. Copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL`.
3. Install dependencies with `npm install`.
4. Apply database migrations with `npm run db:migrate`.
5. Run the server with `npm run server:dev`.

## Current status

The server boots and exposes `/api/health`.
Auth already supports registration, login, logout, and current-session lookup via signed cookies and the `user_sessions` table.
Per-user finance state already supports loading and saving `records` plus `currentRows`.
Server-side metrics now load CBR rates and inflation through `GET /api/metrics` with in-memory caching.
Auth routes also have an in-memory rate limiter and async errors are forwarded to the API error handler.
