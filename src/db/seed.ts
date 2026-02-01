import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { exercises, workouts, workoutExercises, sets } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

const USER_ID = "user_38trCf77Ap263bwCPgpeU6nj1ca";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create exercises
  const exerciseData = [
    { name: "Bench Press" },
    { name: "Squat" },
    { name: "Deadlift" },
    { name: "Overhead Press" },
    { name: "Barbell Row" },
    { name: "Pull-ups" },
    { name: "Bicep Curls" },
    { name: "Tricep Dips" },
  ];

  console.log("Creating exercises...");
  const insertedExercises = await db
    .insert(exercises)
    .values(exerciseData)
    .returning();

  const exerciseMap = new Map(insertedExercises.map((e) => [e.name, e.id]));

  // Create workouts for different dates
  const workoutData = [
    {
      userId: USER_ID,
      name: "Push Day",
      createdAt: new Date("2026-01-31T09:00:00"),
      startedAt: new Date("2026-01-31T09:00:00"),
      completedAt: new Date("2026-01-31T10:15:00"),
    },
    {
      userId: USER_ID,
      name: "Pull Day",
      createdAt: new Date("2026-01-30T10:00:00"),
      startedAt: new Date("2026-01-30T10:00:00"),
      completedAt: new Date("2026-01-30T11:30:00"),
    },
    {
      userId: USER_ID,
      name: "Leg Day",
      createdAt: new Date("2026-01-29T08:30:00"),
      startedAt: new Date("2026-01-29T08:30:00"),
      completedAt: new Date("2026-01-29T09:45:00"),
    },
    {
      userId: USER_ID,
      name: "Full Body",
      createdAt: new Date("2026-01-27T14:00:00"),
      startedAt: new Date("2026-01-27T14:00:00"),
      completedAt: new Date("2026-01-27T15:30:00"),
    },
  ];

  console.log("Creating workouts...");
  const insertedWorkouts = await db
    .insert(workouts)
    .values(workoutData)
    .returning();

  // Define workout exercises and sets
  const workoutExercisesData = [
    // Push Day (Jan 31)
    {
      workoutId: insertedWorkouts[0].id,
      exercises: [
        {
          name: "Bench Press",
          sets: [
            { setNumber: 1, reps: 10, weight: "135" },
            { setNumber: 2, reps: 8, weight: "155" },
            { setNumber: 3, reps: 6, weight: "175" },
            { setNumber: 4, reps: 6, weight: "175" },
          ],
        },
        {
          name: "Overhead Press",
          sets: [
            { setNumber: 1, reps: 10, weight: "65" },
            { setNumber: 2, reps: 8, weight: "75" },
            { setNumber: 3, reps: 8, weight: "75" },
          ],
        },
        {
          name: "Tricep Dips",
          sets: [
            { setNumber: 1, reps: 12, weight: "0" },
            { setNumber: 2, reps: 10, weight: "0" },
            { setNumber: 3, reps: 8, weight: "0" },
          ],
        },
      ],
    },
    // Pull Day (Jan 30)
    {
      workoutId: insertedWorkouts[1].id,
      exercises: [
        {
          name: "Deadlift",
          sets: [
            { setNumber: 1, reps: 8, weight: "185" },
            { setNumber: 2, reps: 6, weight: "225" },
            { setNumber: 3, reps: 5, weight: "255" },
            { setNumber: 4, reps: 3, weight: "275" },
          ],
        },
        {
          name: "Barbell Row",
          sets: [
            { setNumber: 1, reps: 10, weight: "95" },
            { setNumber: 2, reps: 8, weight: "115" },
            { setNumber: 3, reps: 8, weight: "115" },
          ],
        },
        {
          name: "Pull-ups",
          sets: [
            { setNumber: 1, reps: 8, weight: "0" },
            { setNumber: 2, reps: 6, weight: "0" },
            { setNumber: 3, reps: 5, weight: "0" },
          ],
        },
        {
          name: "Bicep Curls",
          sets: [
            { setNumber: 1, reps: 12, weight: "25" },
            { setNumber: 2, reps: 10, weight: "30" },
            { setNumber: 3, reps: 10, weight: "30" },
          ],
        },
      ],
    },
    // Leg Day (Jan 29)
    {
      workoutId: insertedWorkouts[2].id,
      exercises: [
        {
          name: "Squat",
          sets: [
            { setNumber: 1, reps: 10, weight: "135" },
            { setNumber: 2, reps: 8, weight: "185" },
            { setNumber: 3, reps: 6, weight: "205" },
            { setNumber: 4, reps: 6, weight: "205" },
            { setNumber: 5, reps: 4, weight: "225" },
          ],
        },
      ],
    },
    // Full Body (Jan 27)
    {
      workoutId: insertedWorkouts[3].id,
      exercises: [
        {
          name: "Squat",
          sets: [
            { setNumber: 1, reps: 8, weight: "155" },
            { setNumber: 2, reps: 8, weight: "155" },
            { setNumber: 3, reps: 8, weight: "155" },
          ],
        },
        {
          name: "Bench Press",
          sets: [
            { setNumber: 1, reps: 8, weight: "135" },
            { setNumber: 2, reps: 8, weight: "135" },
            { setNumber: 3, reps: 8, weight: "135" },
          ],
        },
        {
          name: "Barbell Row",
          sets: [
            { setNumber: 1, reps: 8, weight: "95" },
            { setNumber: 2, reps: 8, weight: "95" },
            { setNumber: 3, reps: 8, weight: "95" },
          ],
        },
      ],
    },
  ];

  console.log("Creating workout exercises and sets...");
  for (const workout of workoutExercisesData) {
    let order = 0;
    for (const exercise of workout.exercises) {
      const exerciseId = exerciseMap.get(exercise.name);
      if (!exerciseId) {
        console.error(`Exercise not found: ${exercise.name}`);
        continue;
      }

      const [workoutExercise] = await db
        .insert(workoutExercises)
        .values({
          workoutId: workout.workoutId,
          exerciseId,
          order: order++,
        })
        .returning();

      await db.insert(sets).values(
        exercise.sets.map((set) => ({
          workoutExerciseId: workoutExercise.id,
          setNumber: set.setNumber,
          reps: set.reps,
          weight: set.weight,
        }))
      );
    }
  }

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${insertedExercises.length} exercises`);
  console.log(`Created ${insertedWorkouts.length} workouts`);
  console.log("\nWorkouts created for dates:");
  console.log("  - January 31, 2026 (Push Day)");
  console.log("  - January 30, 2026 (Pull Day)");
  console.log("  - January 29, 2026 (Leg Day)");
  console.log("  - January 27, 2026 (Full Body)");

  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
