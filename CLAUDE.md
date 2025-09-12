# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (project uses bun)
bun install

# Start development server
bun run dev

# Build for production
npm run build
# or
bun run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Environment Setup

1. Copy `.env.example` to `.env.local` and fill in the required Google OAuth credentials:
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret  
   - `AUTH_SECRET`: NextAuth secret (generate with `npx auth secret`)
   - `NEXT_PUBLIC_URL`: Application URL (http://localhost:3000 for development)

2. Set up a Google Cloud project and enable the Gmail API
3. Configure OAuth consent screen and add authorized redirect URIs

## Project Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js v5 (beta) with Google OAuth
- **State Management**: Zustand for email pagination state
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with custom Radix color system
- **Data Fetching**: TanStack Query (React Query) 
- **URL State**: nuqs for query parameter management
- **API Integration**: Google Gmail API via `@googleapis/gmail`
- **Type Safety**: TypeScript with Zod for environment validation
- **Table Management**: TanStack Table for email data tables

### Key Directories
- `src/app/`: Next.js app router pages and API routes
- `src/features/`: Feature-based components (dashboard, common)
- `src/components/ui/`: Reusable UI components (shadcn/ui)
- `src/lib/`: Utilities and core configurations (auth, utils)
- `src/store/`: Zustand stores for state management
- `src/providers/`: Context providers for stores
- `src/schemas/`: Zod schemas for data validation

### Gmail Integration Architecture

**Authentication Flow:**
- Uses NextAuth with Google OAuth provider
- Requests extensive Gmail permissions including full mail access
- Implements token refresh logic for expired access tokens
- Custom JWT callback handles token management and refresh

**Email Data Flow:**
1. Dashboard page (`src/app/(protected)/dashboard/page.tsx`) manages pagination state
2. API route at `/api/gmail/[id]/route.ts` fetches email lists using Gmail API
3. Email store (`src/store/email-store.ts`) tracks page tokens for pagination
4. TanStack Query handles caching and loading states
5. EmailDataTable renders emails using TanStack Table with row selection

**Pagination System:**
- Uses Gmail API page tokens stored in Zustand
- Tracks current, previous, and next page IDs
- URL state synchronized with query parameters via nuqs

### Protected Routes
- All dashboard routes are protected by NextAuth middleware
- Authentication check in `src/middleware.ts`
- Protected layout at `src/app/(protected)/layout.tsx`

### Environment Validation
- Uses `@t3-oss/env-nextjs` for strict environment variable validation
- Schema defined in `src/env.mjs` with server/client separation
- Required variables are validated at build time

## Important Implementation Notes

- **Gmail API Scopes**: The app requests full Gmail access including read, delete, and manage permissions
- **Token Management**: Custom JWT callback handles Google OAuth token refresh automatically
- **Error Handling**: Authentication errors are handled in session callbacks with error tokens
- **Type Safety**: Extended NextAuth types in `src/lib/auth.ts` for custom session data
- **Styling**: Uses shadcn/ui "new-york" style with custom Geist fonts
- **Data Tables**: Email lists use virtualized tables for performance with large datasets