# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation First

**IMPORTANT:** Before generating any code, ALWAYS refer to the relevant documentation files in the `/docs` directory. These files contain project-specific coding standards and conventions that must be followed.

| Document | Purpose |
|----------|---------|
| `docs/ui.md` | UI component standards and date formatting rules |
| `docs/data-fetching.md` | Data fetching patterns and user data isolation |

Always check these docs before implementing features to ensure consistency across the codebase.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4

## Project Structure

This uses the Next.js App Router. All pages and layouts live in the `app/` directory:
- `app/layout.tsx` - Root layout with Geist font configuration
- `app/page.tsx` - Home page
- `app/globals.css` - Global styles and Tailwind imports

## Path Aliases

Use `@/*` to import from the project root (e.g., `import { Component } from "@/components/Component"`).
