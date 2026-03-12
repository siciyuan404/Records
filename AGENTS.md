# AGENTS.md

This file provides guidance for agentic coding assistants working on this Next.js 14 resource management application.

## Build, Lint, and Development Commands

```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:init      # Initialize PostgreSQL schema
npm run db:example   # Run database usage example
npm run docker:up    # Start services (PostgreSQL, Redis, MinIO)
npm run docker:down  # Stop services
```

**Note:** This project does not have a test suite configured. When adding new features, manually verify functionality in the development environment.

## Code Style Guidelines

### Imports and Path Aliases

- Use the `@/*` path alias for imports from the project root
- Group imports: external libraries first, then internal modules
- Example:
  ```typescript
  import axios from 'axios';
  import { NextResponse } from 'next/server';
  import { Resource } from '@/app/sys/add/types';
  import { cn } from '@/lib/utils';
  ```

### TypeScript and Types

- Strict TypeScript mode is enabled (tsconfig.json)
- Export interfaces and types from dedicated type files (e.g., `app/sys/add/types.ts`)
- Use interfaces for object shapes, types for unions/primitives
- Always annotate function parameters and return types
- Error handling: `(error as Error).message` for type assertions
- Example:
  ```typescript
  interface Resource {
    name: string;
    category: string;
    tags: Record<string, any>;
  }

  export async function fetchResources(): Promise<Record<string, Resource>> {
    // implementation
  }
  ```

### Naming Conventions

- **Components**: PascalCase (`Button`, `ResourceTable`, `DataTable`)
- **Functions**: camelCase (`fetchResources`, `syncFile`, `handleSubmit`)
- **Constants**: SCREAMING_SNAKE_CASE (`CACHE_DURATION`, `GITHUB_API_URL`)
- **Files**:
  - Components: PascalCase (`Button.tsx`, `ResourceTable.tsx`)
  - Utilities/hooks: camelCase (`utils.ts`, `use-toast.ts`)
  - API routes: `route.ts` (e.g., `app/api/resources/route.ts`)
- **Redux**: Slices use camelCase with `Slice` suffix (`resourcesSlice`)

### Formatting

- ESLint config: `next/core-web-vitals` + `next/typescript`
- Indentation: 2 spaces
- Quotes: Single quotes for strings
- Semicolons: Required
- No trailing commas in import/export statements

### Error Handling

- Wrap async operations in try-catch blocks
- Log errors with descriptive messages using `console.error()`
- User-facing error messages in Chinese (matching project convention)
- Use toast notifications for async errors:
  ```typescript
  try {
    await operation();
    toast({ title: "操作成功", variant: "default" });
  } catch (error) {
    console.error('操作失败:', error);
    toast({ title: "错误", description: "操作失败，请重试", variant: "destructive" });
  }
  ```

### Component Patterns

- Client components must use `"use client"` directive at top
- Use `React.forwardRef` for component composition
- UI components use class-variance-authority (cva) for variants:
  ```typescript
  const buttonVariants = cva("base-classes", {
    variants: {
      variant: { default: "...", outline: "..." },
      size: { default: "...", sm: "..." },
    },
  });
  ```
- Merge className with `cn()` utility:
  ```typescript
  className={cn("base-class", isActive && "active-class", className)}
  ```

### Redux and State Management

- Use Redux Toolkit for state management (`app/store/`)
- Slices created with `createSlice()`
- Async thunks with `createAsyncThunk()`
- RTK Query for API caching (`resourcesApi`, `listApi`, etc.)
- Type store with `RootState` and `AppDispatch`

### Styling

- Tailwind CSS for utility-first styling
- Design tokens defined in `app/design-tokens.css`
- Component-specific styles in CSS Modules (`.module.css`)
- CSS variables for colors, spacing, shadows

### Framework-Specific Conventions

- Next.js 14 App Router
- API routes: `app/api/[endpoint]/route.ts`
- Page components: `app/[route]/page.tsx`
- Use Server Components by default, add `"use client"` for interactivity
- Middleware at project root (`middleware.ts`)

### Comments and Documentation

- Add inline comments in Chinese for complex logic (matching existing codebase)
- Export type definitions for public APIs
- No JSDoc required unless documenting a public utility function

### Architecture Patterns

- GitHub as primary data source (stores JSON files in `db/` directory)
- API layer: `/app/api/` routes fetch from GitHub and serve to frontend
- lib/api.ts contains `syncWithGithub()` for CRUD operations on resources
- Database layer (PostgreSQL, Redis, MinIO) configured via environment variables
- Authentication: JWT with optional Cloudflare Turnstile verification
