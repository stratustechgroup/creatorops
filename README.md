# Creator Ops

Marketing site and client dashboard for Creator Ops — a managed Minecraft infrastructure platform for content creators.

## Tech Stack

- **React 18** + TypeScript + Vite (SWC)
- **React Router v6** with lazy-loaded routes
- **TanStack Query** for server state
- **Tailwind CSS** + **shadcn/ui** components
- **Framer Motion** for animations
- **react-hook-form** + **Zod** for forms
- **Convex** for backend (queries, mutations, actions)
- **Clerk** for authentication
- **Vercel Analytics** for traffic insights

## Prerequisites

- Node.js **20+** (`nvm use 20`)
- npm

## Getting Started

```sh
# Install dependencies
npm install

# Start the dev server (port 8080)
npm run dev
```

## Available Scripts

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Start the dev server on port 8080          |
| `npm run build`    | Build for production                       |
| `npm run lint`     | Run ESLint                                 |
| `npm run preview`  | Preview the production build locally       |

## Environment Variables

Create a `.env.local` at the project root with:

```env
# Convex backend URL (required for data fetches)
VITE_CONVEX_URL=

# Clerk publishable key (required for authenticated routes)
VITE_CLERK_PUBLISHABLE_KEY=
```

If `VITE_CLERK_PUBLISHABLE_KEY` is omitted, the app falls back to an unauthenticated Convex client so public marketing pages still render.

## Project Structure

```
src/
  pages/              Route components (lazy-loaded)
  components/
    landing/          Marketing landing sections
    dashboard/        Client dashboard (server cards, layout)
    auth/             ProtectedRoute wrapper
    ui/               shadcn/ui primitives
  contexts/           AuthContext
  hooks/              useAnalytics, usePterodactyl, useFormAutosave
  integrations/       Supabase client (legacy)
  lib/                Utilities (cn, convexAuth, spotsConfig)
convex/               Convex functions (queries, mutations, actions)
```

## Routing

Public:
- `/` Landing
- `/about`, `/team`
- `/apply`, `/founding-apply`, `/founding-creators`
- `/studio`, `/events-quote`
- `/privacy`, `/terms`, `/sla`, `/fair-usage`

Auth:
- `/login`, `/forgot-password`

Protected (Clerk-gated):
- `/dashboard`
- `/support`
- `/settings/{profile,security,notifications,team,account}`

## Conventions

- Path alias `@/` maps to `src/`
- Forms autosave drafts to localStorage via `useFormAutosave` (debounced 500ms)
- Analytics is GDPR-aware via `useAnalytics` and the cookie consent banner
- Dark mode is class-based; theme tokens live in `src/index.css`

## Deployment

Production builds are deployed to Vercel. The Convex backend is deployed separately via the Convex CLI.
