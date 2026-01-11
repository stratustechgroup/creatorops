# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (port 8080)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

This is a React SPA for a creator-focused SaaS platform, built with Vite, TypeScript, and Supabase.

### Tech Stack
- **React 18** with TypeScript and Vite (SWC compiler)
- **React Router v6** for client-side routing with lazy-loaded pages
- **React Query** for server state management
- **Supabase** for authentication and database
- **shadcn/ui** components (Radix UI + Tailwind CSS)
- **Framer Motion** for animations
- **react-hook-form + Zod** for form handling and validation

### Project Structure

```
src/
├── pages/              # Route components (lazy-loaded via React.lazy)
├── components/
│   ├── landing/        # Landing page sections (Hero, Pricing, FAQ, etc.)
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom hooks (useAnalytics, useFormAutosave, useCookieConsent)
├── integrations/
│   └── supabase/       # Supabase client and auto-generated types
├── lib/utils.ts        # cn() helper for Tailwind class merging
├── App.tsx             # Root component with React Router setup
└── main.tsx            # Entry point
```

### Routing

Routes are defined in `App.tsx` with lazy loading. Main routes:
- `/` - Landing page
- `/apply` - Application form
- `/founding-creators` - Founding program info
- `/founding-apply` - Founding creator application
- `/privacy`, `/terms`, `/sla`, `/fair-usage` - Legal pages

### Key Patterns

**Path Alias**: Use `@/` to import from `src/` (configured in vite.config.ts and tsconfig)

**Form Autosave**: Forms use `useFormAutosave` hook which debounces saves to localStorage (500ms) with timestamps for recovery.

**Analytics**: GDPR-compliant Google Analytics via `useAnalytics` hook. Respects cookie consent settings and lazy-loads GTM script.

**Supabase Client**: Imported from `@/integrations/supabase/client`. Uses environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

**Theming**: Uses CSS variables (HSL colors) defined in `index.css`. Dark mode via `next-themes` with class strategy. Color tokens: primary, secondary, accent, muted, destructive, etc.
