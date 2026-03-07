# Elite Treinos

Fullstack case project: a platform where personal trainers manage students and assign workouts (based on pre-existing templates A/B/C/D), while students log in and view their assigned workouts.

## Project Structure

```
elite-treinos/
  frontend/    # React SPA (React Router v7 + Vite + Tailwind v4)
  backend/     # Laravel API (to be created)
```

## Tech Stack

### Frontend (go to @./frontend/CLAUDE.md for more)
- **Framework**: React 19 + React Router v7 (SPA mode)
- **Build**: Vite 7 + Tailwind CSS v4
- **Language**: TypeScript (strict mode)
- **Linter/Formatter**: Biome

### Backend (go to @./backend/CLAUDE.md for more)
- **Framework**: Laravel (PHP 8+)
- **Database**: PostgreSQL
- **API**: REST (JSON), documented with Swagger/OpenAPI using Scramble
- **Auth**: Token-based (Laravel Sanctum recommended)

## Domain Model

### User Roles (RBAC)
1. **Superadmin** - manages personal trainers (CRUD), views their students (read-only)
2. **Personal** - manages their own students (CRUD), creates student login, assigns up to 2 workouts per student from templates A/B/C/D
3. **Aluno (Student)** - views assigned workouts only (read-only)

### Key Business Rules
- 4 pre-seeded workout templates: A (Full Body), B (Lower Body), C (Upper Body), D (Conditioning + Core)
- Max 2 workouts per student
- Cannot assign the same workout twice to the same student
- Personal can only see/manage their own students
- Students cannot create or edit anything

### Data Entities
- **Users**: name, email (unique), password (hashed), role (superadmin/personal/aluno)
- **Personais**: linked to user, phone, CREF (optional)
- **Alunos**: linked to user, linked to personal, birth date (optional), notes (optional)
- **Treinos (templates)**: code (A/B/C/D), name, objective, exercises list
- **Exercicios**: order, name, sets, reps/time, notes (optional)
- **Treinos atribuidos**: student, workout template, assigning personal, assigned_at

## API Endpoints (to be implemented)

### Auth
- `POST /api/login` - login (returns token + user profile)
- `POST /api/logout` - logout (revoke token)
- `GET /api/me` - current user info + role

### Superadmin
- `GET /api/personais` - list personal trainers
- `POST /api/personais` - create personal trainer
- `GET /api/personais/{id}` - get personal detail
- `PUT /api/personais/{id}` - update personal
- `DELETE /api/personais/{id}` - delete personal
- `GET /api/personais/{id}/alunos` - list students of a personal (read-only)

### Personal
- `GET /api/alunos` - list own students
- `POST /api/alunos` - create student (includes user account creation)
- `GET /api/alunos/{id}` - get student detail
- `PUT /api/alunos/{id}` - update student
- `DELETE /api/alunos/{id}` - delete student
- `POST /api/alunos/{id}/treinos` - assign workout to student
- `DELETE /api/alunos/{id}/treinos/{treinoId}` - remove workout from student
- `GET /api/alunos/{id}/treinos` - list student's assigned workouts

### Student
- `GET /api/meus-treinos` - list own assigned workouts
- `GET /api/meus-treinos/{id}` - workout detail with exercises

### Shared
- `GET /api/treinos` - list available workout templates (A/B/C/D)

## Conventions
- Language: UI text in Portuguese (pt-BR), code identifiers in English or Portuguese matching domain
- API responses: standardized JSON format with proper HTTP status codes (401/403/404/422)
- Passwords stored securely (bcrypt via Laravel)

## Running the Project

### Frontend
```bash
cd frontend
npm install
npm run dev       # dev server
npm run build     # production build
npm run start     # serve production build
```

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Swagger UI should be available at `/api/docs`.

## Deliverables Checklist
- [ ] Backend: Laravel API with all endpoints
- [ ] Backend: Migrations + seeders (superadmin user, workout templates A/B/C/D)
- [ ] Backend: RBAC middleware (superadmin, personal, aluno)
- [ ] Backend: Input validation + standardized error responses
- [ ] Backend: Swagger/OpenAPI documentation (`/api/docs` + `openapi.yaml`)
- [ ] Frontend: Replace mock data with API consumption
- [ ] Frontend: Auth flow (login, token storage, redirect by role)
- [ ] Frontend: Protected routes per role
- [ ] README.md with setup instructions and test credentials
- [ ] Docker support (Dockerfile already exists for frontend)
