# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit  # TypeScript type check (no tsc script defined)

# Database
npx prisma migrate dev --name <name>   # Create and apply a new migration
npx prisma studio                       # Open Prisma GUI
npx prisma generate                     # Regenerate Prisma client after schema changes
```

## Architecture

**Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS · Prisma ORM · SQLite (`prisma/dev.db`)

**Data models** (`prisma/schema.prisma`):
- `Company` — organization with optional website, industry, phone, address
- `Contact` — person, optionally linked to a `Company`
- `Task` — to-do item with status (`OPEN | IN_PROGRESS | DONE`), priority (`LOW | MEDIUM | HIGH`), optional link to a Contact and/or Company
- `Note` — free-text log entry, linked to a Contact or Company (cascade-deleted with parent)

**API routes** (`src/app/api/`):
- `/api/contacts` — GET (with `?search=`), POST
- `/api/contacts/[id]` — GET (includes tasks + notes), PUT, DELETE
- `/api/companies` — GET (with `?search=`), POST; includes `_count.contacts`
- `/api/companies/[id]` — GET (includes contacts + tasks + notes), PUT, DELETE
- `/api/tasks` — GET (with `?status=` filter), POST
- `/api/tasks/[id]` — PUT, DELETE
- `/api/notes` — POST
- `/api/notes/[id]` — DELETE
- `/api/stats` — GET; returns `{ contacts, companies, tasks, openTasks }` counts for the dashboard

**UI pages** (`src/app/`):
- `/` — Dashboard with stat tiles
- `/contacts` — Searchable table, inline create modal
- `/contacts/[id]` — Detail view with inline edit, task creation, note log
- `/companies` — Searchable table, inline create modal
- `/companies/[id]` — Detail view same as contact detail
- `/tasks` — Filterable task list with status toggle and inline edit

**Shared components** (`src/components/`):
- `Sidebar` — persistent left nav (client component, uses `usePathname`)
- `Modal` — backdrop modal with Escape-to-close
- `ContactForm`, `CompanyForm`, `TaskForm` — controlled forms used in both create and edit flows

**Prisma client** is a singleton in `src/lib/db.ts` to avoid multiple instances in dev hot-reload.

The Prisma client is generated into `src/generated/prisma` (not the default location). After any schema change run `npx prisma generate`.

**SQLite path note:** `DATABASE_URL` in `.env` uses an absolute path (`file:C:/Users/...`) because Next.js + Turbopack resolves relative SQLite paths inconsistently at runtime. If you move the project, update `.env` accordingly.
