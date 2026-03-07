# Frontend - Elite Treinos

## Tech Stack
- **Framework**: React 19 + React Router v7 (SPA mode, `ssr: false`)
- **Build**: Vite 7 + `@tailwindcss/vite`
- **Styling**: Tailwind CSS v4, Inter font (rsms.me)
- **UI Components**: Headless UI + Heroicons + custom component library (Catalyst UI) in `components/`
- **Linter/Formatter**: Biome (tabs, double quotes, recommended rules)
- **Language**: TypeScript (strict mode)
- **Path alias**: `~/*` maps to `./app/*`
- **Testing**: Vitest + Testing Library (`@testing-library/react`, `@testing-library/user-event`) — **required for all frontend changes**

## Routes
```
/                           # Login page
/admin/personais            # Superadmin: list personal trainers
/admin/personais/novo       # Superadmin: create personal
/admin/personais/:id        # Superadmin: personal detail (view students)
/admin/personais/:id/editar # Superadmin: edit personal
/personal/alunos            # Personal: list students
/personal/alunos/novo       # Personal: create student
/personal/alunos/:id        # Personal: student detail (view/assign workouts)
/personal/alunos/:id/editar # Personal: edit student
/aluno/treinos              # Student: list assigned workouts
/aluno/treinos/:id          # Student: workout detail (exercises)
```

## Layout Structure
- Each role has its own layout component: `admin/layout.tsx`, `personal/layout.tsx`, `aluno/layout.tsx`
- Shared UI components live in `components/` (Catalyst-style: button, table, input, sidebar, etc.)
- Mock data in `app/data/mock.ts` (types + sample data) - to be replaced by API calls

## Formatting
Run `npm run format` to format with Biome.
