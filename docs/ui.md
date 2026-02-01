# UI Coding Standards

## Component Library

This project uses **shadcn/ui** as the exclusive component library.

### Rules

- **ONLY** use shadcn/ui components for all UI elements
- **DO NOT** create custom components
- **DO NOT** use other component libraries (Material UI, Chakra, Ant Design, etc.)
- If a component doesn't exist in shadcn/ui, find the closest alternative or compose using existing shadcn/ui primitives

### Installing Components

Add new shadcn/ui components using the CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

### Documentation

Refer to the official shadcn/ui documentation: https://ui.shadcn.com

---

## Date Formatting

All dates must be formatted using **date-fns**.

### Required Format

Dates should display with ordinal day suffixes:

| Example Output |
|----------------|
| 1st Sep 2025  |
| 2nd Aug 2025   |
| 3rd Jan 2026   |
| 4th Jun 2024   |

### Implementation

```typescript
import { format } from "date-fns";

function formatDate(date: Date): string {
  return format(date, "do MMM yyyy");
}

// Examples:
// formatDate(new Date("2025-09-01")) → "1st Sep 2025"
// formatDate(new Date("2025-08-02")) → "2nd Aug 2025"
// formatDate(new Date("2026-01-03")) → "3rd Jan 2026"
// formatDate(new Date("2024-06-04")) → "4th Jun 2024"
```

### Format Token Reference

| Token | Description        | Example |
|-------|--------------------|---------|
| `do`  | Day with ordinal   | 1st, 2nd, 3rd |
| `MMM` | Abbreviated month  | Jan, Feb, Sep |
| `yyyy`| Full year          | 2025 |
