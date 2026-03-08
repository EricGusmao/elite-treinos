# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Elite Treinos: fullstack platform where personal trainers manage students and assign workouts (templates A/B/C/D). Three roles: superadmin, personal, aluno (student).

## Project Structure

```
elite-treinos/
  frontend/    # React SPA (React Router v7 + Vite 7 + Tailwind v4)
  backend/     # Laravel 12 API (PHP 8.5, PostgreSQL, Sanctum auth)
```

See `frontend/CLAUDE.md` and `backend/CLAUDE.md` for stack-specific rules.

## Common Commands

### Frontend (`cd frontend`)
```bash
npm install              # install dependencies
npm run dev              # dev server (Vite)
npm run build            # production build
npm run format           # format with Biome
npm run typecheck        # TypeScript type checking
```

### Backend (`cd backend`)
```bash
composer install                          # install dependencies
composer run dev                          # run server + queue + pail + vite concurrently
php artisan serve                         # API server only
php artisan migrate --seed                # run migrations and seeders
php artisan test --compact                # run all tests (Pest) — MUST pass before any commit
php artisan test --compact --filter=Name  # run single test
vendor/bin/pint --dirty --format agent    # format modified PHP files (MUST run after changes)
```

## Architecture

### Frontend
- **SPA mode** (`ssr: false`) with React Router v7 file-based routing
- **Routes** defined in `frontend/app/routes.ts` — three role-based layout groups (`admin/`, `personal/`, `aluno/`)
- **UI components**: Catalyst-style component library in `frontend/components/` (Headless UI + Heroicons)
- **Mock data** in `frontend/app/data/mock.ts` — types and sample data, to be replaced by API calls
- **Biome** for linting/formatting (tabs, double quotes)
- **Path alias**: `~/*` maps to `./app/*`

### Backend
- **Laravel 12** streamlined structure — no `Kernel.php`, middleware configured in `bootstrap/app.php`
- **Database**: PostgreSQL (`DB_CONNECTION=pgsql` in `.env`)
- **Auth**: Laravel Sanctum SPA authentication (session/cookie-based via `$middleware->statefulApi()`)
- **API docs**: Swagger/OpenAPI via Scramble at `/api/docs`
- **Pint config** (`pint.json`): Laravel preset with `declare_strict_types`, `final_class`, strict comparison, ordered class elements
- **Testing**: Pest 4 (prefer feature tests, use factories) — **required for all backend changes**

### Key Pint Rules (affects all PHP code)
- All classes must be `final` (enforced by `final_class` rule)
- All files must have `declare(strict_types=1)`
- Use strict comparison (`===`/`!==`), no superfluous elseif/else

## Domain Model & Business Rules

### Roles (RBAC)
1. **Superadmin** — CRUD personal trainers, read-only view of their students
2. **Personal** — CRUD own students, assign up to 2 workouts per student from templates A/B/C/D
3. **Aluno** — read-only view of assigned workouts

### Constraints
- 4 pre-seeded workout templates: A (Full Body), B (Lower Body), C (Upper Body), D (Conditioning + Core)
- Max 2 workouts per student; no duplicate assignments
- Personals can only see/manage their own students

### Data Entities
- **Users**: name, email (unique), password (hashed), role (superadmin/personal/aluno)
- **Personais**: user_id, phone, CREF (optional)
- **Alunos**: user_id, personal_id, birth_date (optional), notes (optional)
- **Treinos** (templates): code (A/B/C/D), name, objective, exercises list
- **Exercicios**: order, name, sets, reps/time, notes (optional)
- **Treinos atribuidos**: aluno_id, treino_id, personal_id, assigned_at

## API Endpoints

### Auth
- `POST /api/login` — session-based login, returns user profile (cookie auth)
- `POST /api/logout` — invalidate session
- `GET /api/me` — current user info + role

### Superadmin
- `GET|POST /api/personais` — list/create personal trainers
- `GET|PUT|DELETE /api/personais/{id}` — view/update/delete personal
- `GET /api/personais/{id}/alunos` — list students of a personal (read-only)

### Personal
- `GET|POST /api/alunos` — list/create own students
- `GET|PUT|DELETE /api/alunos/{id}` — view/update/delete student
- `POST /api/alunos/{id}/treinos` — assign workout
- `DELETE /api/alunos/{id}/treinos/{treinoId}` — remove workout
- `GET /api/alunos/{id}/treinos` — list student's workouts

### Student
- `GET /api/meus-treinos` — list own workouts
- `GET /api/meus-treinos/{id}` — workout detail with exercises

### Shared
- `GET /api/treinos` — list workout templates

## TDD Workflow (MANDATORY)

**All backend features must follow the Red → Green → Refactor cycle:**

1. **Write a failing test first** — before writing any implementation code
2. **Run the test to confirm it fails** (`php artisan test --compact --filter=TestName`)
3. **Write the minimum code to make it pass** — no gold-plating
4. **Run all tests** to ensure nothing regressed (`php artisan test --compact`)
5. **Refactor** if needed, keeping tests green
6. **Format** (`vendor/bin/pint --dirty --format agent`)

**Rules:**
- Never write implementation code without a corresponding test
- Every API endpoint must have at least one feature test covering: happy path, auth/authorization, and validation errors
- Use factories for test data — never hardcode IDs or rely on seeded data
- Tests must be isolated (use `RefreshDatabase` or `LazilyRefreshDatabase`)
- Business rule constraints (max 2 workouts, no duplicates, ownership) must each have a dedicated test

## Conventions
- UI text in Portuguese (pt-BR); code identifiers in English or Portuguese matching domain
- Standardized JSON API responses with proper HTTP status codes (401/403/404/422)
- Use Form Request classes for validation (not inline)
- Use Eloquent API Resources for API responses
- Prefer `Model::query()` over `DB::` facade
- Use eager loading to prevent N+1 queries
- Use `config()` helper, never `env()` outside config files
