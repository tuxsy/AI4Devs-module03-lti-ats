# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Setup

```bash
nvm install && nvm use
npm run install:all          # installs all deps + generates Prisma client + creates backend/.env symlink
cp .env.example .env
npm run db:up
npm run db:migration:deploy
npm run dev
```

### Development

```bash
npm run dev                  # starts frontend (4200) and backend (3000) in parallel
npm run dev:frontend
npm run dev:backend
```

### Database

```bash
npm run db:up                    # start PostgreSQL (Docker)
npm run db:down                  # stop PostgreSQL
npm run db:reset                 # wipe and restart
npm run db:migration:deploy      # apply pending migrations (use this in setup)
npm run db:migrate               # create a new migration from schema changes (dev only)
npm run db:studio                # Prisma Studio at http://localhost:5555
```

### Testing

```bash
npm run test                     # all tests (frontend + backend)
npm run test:backend             # Jest
npm run test:frontend            # Karma + Jasmine
```

Single test (backend, from repo root):

```bash
npm run --prefix backend test -- --testPathPattern="modules/auth"
npm run --prefix backend test -- --testNamePattern="should login"
```

Single test (frontend, from repo root):

```bash
npm run --prefix frontend test -- --include="**/job-list.component.spec.ts" --watch=false
```

### Code quality

```bash
npm run lint
npm run format                   # Prettier on all files
```

## Architecture

### Monorepo layout

- `backend/` — NestJS v11 API + Prisma ORM
- `frontend/` — Angular v21 SPA
- `docker-compose.yml` — PostgreSQL 16 (port 5432, container `lti-ats-db`)
- `scripts/dev.sh` — parallel startup with port-conflict detection
- `.env` lives at the repo root; `backend/.env` is a symlink to `../.env` (created by `install:all`)

### Backend (`backend/src/`)

Feature modules under `src/modules/`: `auth`, `users`, `jobs`, `candidates`, `interviews`.

Each module follows the NestJS convention: `*.module.ts`, `*.service.ts`, `*.controller.ts`, `dto/`.

Key wiring:

- `DatabaseModule` (global) provides `PrismaService` — a singleton `PrismaClient` wrapper with dev-only query logging.
- `ConfigModule` validates env vars with Joi on startup; required: `DATABASE_URL`, `JWT_SECRET` (≥32 chars), `JWT_EXPIRES_IN`, `ALLOWED_ORIGINS`.
- `ThrottlerModule` enforces two limits globally (5 req/s, 100 req/min); login endpoint is additionally limited to 5 attempts/min.
- `ValidationPipe` is global with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.
- Swagger is enabled only when `NODE_ENV !== production` at `/api/docs`.

Auth flow: `POST /auth/register` → bcrypt hash → store user. `POST /auth/login` → verify bcrypt → return JWT. Protected routes use `JwtAuthGuard` (Passport strategy).

`UsersService` exposes a `SELECT_SAFE` object that excludes `password` from all public responses; `findByEmail()` returns the full row for internal auth use.

### Frontend (`frontend/src/app/`)

- Standalone components only (`standalone: true`), `ChangeDetectionStrategy.OnPush` everywhere.
- State via Angular Signals (`signal()`, `computed()`); no external state library.
- Use `input()` / `output()` functions, not `@Input` / `@Output` decorators.
- Lazy-loaded feature routes: `features/jobs/`, `features/candidates/`, `features/interviews/`.
- Styling: TailwindCSS v4 for utilities, Angular Material v21 for complex components.
- HTTP via `provideHttpClient()` with `withInterceptorsFromDi()`.

### Prisma schema (`backend/prisma/schema.prisma`)

Models: `User`, `Job`, `Candidate`, `Application`, `Interview`.
Enums: `Role`, `JobStatus`, `ApplicationStatus`, `InterviewStatus`.
`Application` has a unique constraint on `(jobId, candidateId)`.

After editing the schema, run `npm run db:migrate` to create a migration, then `npm run --prefix backend prisma:generate` if the client needs to be refreshed mid-session.

## Ports

| Service       | URL                            |
| ------------- | ------------------------------ |
| Frontend      | http://localhost:4200          |
| Backend       | http://localhost:3000          |
| Swagger       | http://localhost:3000/api/docs |
| Prisma Studio | http://localhost:5555          |
| PostgreSQL    | localhost:5432                 |
