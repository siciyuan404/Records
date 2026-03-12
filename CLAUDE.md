# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:init      # Initialize database schema
npm run db:example   # Run database usage example
```

## Architecture Overview

This is a Next.js 14 resource management application (App Router) that uses GitHub as a backend for storing resource data, with PostgreSQL, Redis, and MinIO for additional data services.

### Data Flow

- **Primary Data Source**: GitHub repository stores resources as JSON files (`db/resources.json`, `db/list.json`, individual `{uuid}.json` files)
- **API Layer**: `/app/api/` routes fetch from GitHub and serve to frontend
- **State Management**: Redux Toolkit with RTK Query for API caching
- **Database Layer** (`lib/db.ts`): PostgreSQL (data), Redis (caching), MinIO (file storage) - configured via environment variables

### Key Directories

- `app/(main)/` - Public-facing pages (home, resource browsing)
- `app/sys/` - Admin/system pages (protected by auth, requires `/verify`)
- `app/api/` - API routes (GitHub proxy, resources, categories, auth)
- `app/store/` - Redux store with RTK Query APIs and feature slices
- `components/ui/` - Reusable UI components (shadcn/ui based)
- `lib/` - Utilities, database connections, auth logic

### State Management Structure

Redux store (`app/store/store.ts`) combines:
- Feature slices: `categories`, `resources`, `list`, `tabs`, `changeRecords`
- RTK Query APIs: `resourcesApi`, `listApi`, `categoriesApi`, `tagsApi`, `iconsApi`

### Authentication

- Password-based auth with optional Cloudflare Turnstile verification
- Protected paths: `/sys/*`, `/admin/*`
- Auth config in `lib/auth/config.ts`, JWT handling in `lib/auth/jwt.ts`
- Verify page at `/verify`

### GitHub Sync

`lib/api.ts` contains `syncWithGithub()` for CRUD operations on resources:
- Actions: `add`, `edit`, `delete`, `updateList`, `sync`
- Commits changes directly to the configured GitHub repository

### Styling

- Tailwind CSS with design tokens in `app/design-tokens.css`
- CSS variables for colors, spacing, shadows defined in design tokens
- Component-specific styles use CSS Modules (`.module.css`)

## Environment Variables

Key variables (see `.env.template`):
- `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_REPO`, `GITHUB_TOKEN` - GitHub backend
- `DATABASE_URL`, `REDIS_URL`, `MINIO_*` - Database connections
- `AUTH_ENABLED`, `AUTH_PASSWORD_ENV_KEY` - Authentication
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` - Cloudflare Turnstile

## Type Definitions

Core types in `app/sys/add/types.ts`:
- `Resource` - Main resource entity with name, category, images, tags, source_links
- `ResourcesState` - UUID-keyed resource map
- `Categories` - Nested category structure with icons and links
