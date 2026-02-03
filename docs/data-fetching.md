# Data Fetching Standards

## Core Principles

### Server Components Only

**ALL data fetching in this application MUST be done via Server Components.**

- **DO NOT** fetch data in Client Components
- **DO NOT** fetch data via Route Handlers (API routes)
- **ONLY** fetch data in Server Components

This ensures data fetching happens on the server, improving performance and security.

### Database Access via `/data` Directory

All database queries MUST be performed through helper functions located in the `/data` directory.

```typescript
// CORRECT: Import and use data helpers in Server Components
import { getWorkouts } from "@/data/workouts";

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();
  return <WorkoutList workouts={workouts} />;
}
```

```typescript
// WRONG: Do not query the database directly in components
import { db } from "@/db";

export default async function WorkoutsPage() {
  const workouts = await db.query.workouts.findMany(); // DON'T DO THIS
}
```

### Drizzle ORM Only

All database queries MUST use Drizzle ORM. **DO NOT use raw SQL queries.**

```typescript
// CORRECT: Use Drizzle ORM
const workouts = await db.query.workouts.findMany({
  where: eq(workouts.userId, userId),
});
```

```typescript
// WRONG: Do not use raw SQL
const workouts = await db.execute(
  sql`SELECT * FROM workouts WHERE user_id = ${userId}`
); // DON'T DO THIS
```

## User Data Isolation (CRITICAL)

**A logged-in user MUST only be able to access their own data. They should NEVER be able to access another user's data.**

Every data helper function MUST:

1. Retrieve the current user's ID from the session
2. Filter ALL queries by the user's ID
3. Never expose data belonging to other users

### Example Data Helper Pattern

```typescript
// /data/workouts.ts
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkouts() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db.query.workouts.findMany({
    where: eq(workouts.userId, session.user.id), // ALWAYS filter by user ID
  });
}

export async function getWorkoutById(workoutId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // ALWAYS include userId in the where clause
  return db.query.workouts.findFirst({
    where: and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, session.user.id) // Prevents accessing other users' data
    ),
  });
}
```

## Summary

| Rule | Requirement |
|------|-------------|
| Data fetching location | Server Components ONLY |
| Route Handlers | DO NOT use for data fetching |
| Client Components | DO NOT fetch data |
| Database queries | Use `/data` directory helpers |
| ORM | Drizzle ORM only (NO raw SQL) |
| User data | ALWAYS filter by current user's ID |
