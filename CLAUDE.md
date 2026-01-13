# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (port 8080)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

**Note**: Requires Node.js 20+ (use `nvm use 20` if needed).

## Architecture

React SPA for Creator Ops, a managed Minecraft infrastructure platform for content creators. Built with Vite, TypeScript, and Supabase.

### Tech Stack
- **React 18** with TypeScript and Vite (SWC compiler)
- **React Router v6** for client-side routing with lazy-loaded pages
- **React Query** for server state management (auto-refresh patterns)
- **Supabase** for authentication, database, and Edge Functions
- **shadcn/ui** components (Radix UI + Tailwind CSS)
- **Framer Motion** for animations
- **react-hook-form + Zod** for form handling and validation

### Project Structure

```
src/
├── pages/              # Route components (lazy-loaded via React.lazy)
├── components/
│   ├── landing/        # Landing page sections (Hero, Pricing, FAQ, etc.)
│   ├── dashboard/      # Client dashboard components (ServerCard, DashboardLayout)
│   ├── auth/           # Auth components (ProtectedRoute)
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom hooks (useAnalytics, usePterodactyl, useFormAutosave)
├── integrations/
│   └── supabase/       # Supabase client and auto-generated types
├── lib/utils.ts        # cn() helper for Tailwind class merging
├── App.tsx             # Root component with React Router setup
└── main.tsx            # Entry point

supabase/
└── functions/          # Supabase Edge Functions (Deno)
    ├── send-application-email/   # Email notifications via Resend
    └── pterodactyl-proxy/        # Proxies Pterodactyl Panel API
```

### Routing

Routes defined in `App.tsx` with lazy loading:
- `/` - Landing page
- `/login` - Client login
- `/dashboard` - Client dashboard (protected)
- `/apply`, `/founding-apply` - Application forms
- `/founding-creators` - Founding program info
- `/privacy`, `/terms`, `/sla`, `/fair-usage` - Legal pages

### Key Patterns

**Path Alias**: Use `@/` to import from `src/` (configured in vite.config.ts and tsconfig).

**Authentication**: `AuthContext` wraps app, provides `useAuth()` hook. `ProtectedRoute` component redirects unauthenticated users to `/login`.

**Dashboard Data**: `usePterodactyl` hooks fetch server data via Edge Function proxy. Uses React Query with 30-second auto-refresh for real-time status.

**Form Autosave**: Forms use `useFormAutosave` hook which debounces saves to localStorage (500ms) with timestamps for recovery.

**Analytics**: GDPR-compliant Google Analytics via `useAnalytics` hook. Respects cookie consent settings.

**Supabase Client**: Imported from `@/integrations/supabase/client`. Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.

**Theming**: CSS variables (HSL colors) in `index.css`. Emerald green primary (`hsl 152`). Dark mode via class strategy.

### Database Tables (Supabase)

- `client_profiles` - Links auth.users to client info
- `client_servers` - Maps clients to their Pterodactyl server IDs (admin-managed)

### Edge Functions

Edge Functions use Deno runtime. Deploy with `supabase functions deploy <function-name>`.

- `pterodactyl-proxy`: Requires `PTERODACTYL_URL` and `PTERODACTYL_API_KEY` env vars
- `send-application-email`: Requires `RESEND_API_KEY` env var
