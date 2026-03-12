<!-- task_id: upgrade_001 -->
<!-- created_at: 2026-01-10 -->
<!-- status: RESEARCH -->

# Upgrade Next.js to Latest Version

## I. Context
- **Goal**: Upgrade Next.js from 14.x to the latest stable version (likely Next.js 15).
- **Current Stack**: Next.js 14.2.14, React 18, App Router.
- **Risks**: Breaking changes in App Router, Caching behavior, and React 19 compatibility.

## II. Mode Status
- [x] RESEARCH
- [x] INNOVATE
- [x] PLAN
- [x] EXECUTE
- [ ] REVIEW

## III. Research Log
- Pending: specific version check.
- Pending: React version compatibility check.

## IV. Innovation & Ideation
- **Option 1: Next.js 15 + React 19 (Recommended)**
    - This is the "latest" version.
    - Requires updating `next`, `react`, `react-dom`.
    - Note: App Router params are now Promises.
    - Note: Default caching behavior changed to `no-store` by default for `fetch`.
- **Selection**: **Option 1**. User requested "latest version".

## V. Detailed Plan
### Implementation Checklist
1. **Update Dependencies**
    - [x] Run `npm install next@latest react@latest react-dom@latest eslint-config-next@latest`.
    - [x] Run `npm install -D @types/react@latest @types/react-dom@latest @types/node@latest`.
2. **Handle Breaking Changes (Adaptive)**
    - [ ] Try `npm run build` to identify issues.
    - [ ] Fix `params` await issue in App Router pages if reported.
    - [ ] Fix other TypeScript errors related to React 19 typings.
3. **Verification**
    - [ ] Verify `npm run dev` starts successfully.
