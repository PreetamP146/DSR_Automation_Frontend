# DSR Automation Frontend

Next.js 15 frontend for the DSR Automation System.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

App runs at [http://localhost:3001](http://localhost:3001) (or next available port).

## Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Go backend API base URL | `http://localhost:3000/api` |

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query
- Axios
- React Hook Form + Zod
- Zustand (auth state)

## Backend

Requires the Go backend at `Desktop/DSR_Automation` running on port 3000.
