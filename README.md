# DSR Automation Frontend

Next.js 15 frontend for the [DSR Automation](https://github.com/PreetamP146/DSR_Automation) Go backend. Automates Daily Status Reports by aggregating Git activity, Jira/planning events, and AI-generated summaries.

## Features

- JWT authentication (register, login, logout)
- **Demo login** — explore the UI without calling the auth API
- Dashboard with activity overview, integrations, and recent DSR reports
- Git integration (GitHub / GitLab) — connect, sync repos, track projects
- Jira integration — connect, view assigned/completed tickets
- Activity tracking — daily Git and planning activity with date filters
- DSR management — generate, preview, history, and detail views
- Settings — profile, integrations, notification preferences
- Dark / light theme, responsive sidebar layout, toast notifications

## Prerequisites

- Node.js 18+
- npm
- Go backend running at `http://localhost:3000` (required for real data; optional for demo login)

## Quick Start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (Next.js uses 3001 if port 3000 is taken by the backend).

### Start the backend

```bash
cd ../DSR_Automation   # or Desktop/DSR_Automation
go run ./cmd/server
```

Verify: `curl http://localhost:3000/api/health`

## Demo Login

Use these credentials to sign in **without calling** `POST /api/auth/login`:

| Field    | Value          |
|----------|----------------|
| Email    | `demo@dsr.com` |
| Password | `demo123`      |

On the login page, click **Use demo account** to auto-fill the fields, then **Sign in**.

> **Note:** Demo login sets a local session only. Protected API routes still call the real backend and may return 401 with the fake token. For full functionality, register a real account via `/signup`.

## Real Account

1. Go to `/signup` and create an account (password min 6 characters).
2. Log in at `/login` with your email and password.
3. Connect Git and Jira integrations from their respective pages.

Example backend registration (optional):

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret12"}'
```

## Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Go backend API base URL | `http://localhost:3000/api` |

Copy from example:

```bash
cp .env.local.example .env.local
```

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Sign in (demo or real account) |
| `/signup` | Create account |
| `/dashboard` | Overview cards, today's DSR, integrations, recent activity |
| `/dsr` | DSR history |
| `/dsr/generate` | Generate and preview AI DSR |
| `/dsr/[id]` | DSR report details |
| `/git` | Connect GitHub/GitLab, sync repos, manage tracked projects |
| `/jira` | Connect Jira, view assigned/completed tickets |
| `/activity` | Daily activity with date filter and sync |
| `/settings` | Profile, password, integrations, notifications |

## Tech Stack

- **Next.js 15** — App Router
- **TypeScript**
- **Tailwind CSS** + shadcn/ui components
- **TanStack Query** — server state and caching
- **Axios** — HTTP client with JWT interceptors
- **React Hook Form** + **Zod** — form validation
- **Zustand** — auth state (persisted)
- **next-themes** — dark/light mode
- **sonner** — toast notifications

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup
│   └── (app)/           # Protected pages (dashboard, dsr, git, jira, …)
├── components/
│   ├── ui/              # Reusable UI primitives
│   └── layout/          # Sidebar, navbar, dashboard shell
├── services/            # API layer (auth, git, dsr, activity)
├── hooks/               # React Query hooks
├── lib/                 # Axios, utils, validations, demo-auth
├── store/               # Zustand auth store
├── types/               # TypeScript interfaces (backend DTOs)
├── constants/
└── providers/           # Query + theme providers
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Docker

Build and run with Docker Compose:

```bash
docker compose up --build
```

App: [http://localhost:3001](http://localhost:3001)

### Environment variables (Docker)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend URL **as seen by the browser** (baked in at build time) | `http://localhost:3000/api` |
| `FRONTEND_PORT` | Host port mapped to the container | `3001` |

Example with a custom API URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api FRONTEND_PORT=3001 docker compose up --build
```

> Start the Go backend separately (or add it to your own compose stack). The frontend container only serves the Next.js app.

### Docker files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage production build (Node 20 Alpine, standalone output) |
| `docker-compose.yml` | Run the frontend service |
| `.dockerignore` | Exclude `node_modules`, `.next`, env files from build context |

## Backend API

All data endpoints live under `NEXT_PUBLIC_API_URL` (default `http://localhost:3000/api`).

Key groups:

- **Auth** — `/auth/register`, `/auth/login`
- **Git** — `/integrations/git`, `/integrations/git/projects`, …
- **DSR** — `/dsr`, `/dsr/generate`, `/dsr/activity`
- **Activity** — `/activity`, `/activity/planning`, `/activity/sync`

See the Go backend README for the full API reference.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| No API calls in terminal | API calls go browser → backend; check **DevTools → Network** |
| Login fails (real account) | Ensure backend is running on port 3000 |
| CORS errors | Frontend (3001) and backend (3000) are different origins; add CORS to the Go backend |
| Dashboard empty after demo login | Expected — demo token is not valid on the backend; use a real account for data |
| Redirected to `/login` | Session expired or not authenticated; log in again |

## License

Private — DSR Automation project.
