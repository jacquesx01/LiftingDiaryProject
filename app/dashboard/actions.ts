"use server";

import { db } from "@/src/db";
import { workouts, workoutExercises, exercises, sets } from "@/src/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, gte, lt } from "drizzle-orm";

export type WorkoutWithExercises = {
  id: number;
  name: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  exercises: {
    id: number;
    name: string;
    order: number;
    sets: {
      id: number;
      setNumber: number;
      reps: number | null;
      weight: string | null;
    }[];
  }[];
};

export async function getWorkoutsForDate(
  dateString: string
): Promise<WorkoutWithExercises[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const date = new Date(dateString);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const userWorkouts = await db
    .select({
      id: workouts.id,
      name: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      createdAt: workouts.createdAt,
    })
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.createdAt, startOfDay),
        lt(workouts.createdAt, endOfDay)
      )
    );

  const workoutsWithExercises: WorkoutWithExercises[] = await Promise.all(
    userWorkouts.map(async (workout) => {
      const workoutExercisesList = await db
        .select({
          id: workoutExercises.id,
          exerciseId: workoutExercises.exerciseId,
          order: workoutExercises.order,
          exerciseName: exercises.name,
        })
        .from(workoutExercises)
        .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
        .where(eq(workoutExercises.workoutId, workout.id))
        .orderBy(workoutExercises.order);

      const exercisesWithSets = await Promise.all(
        workoutExercisesList.map(async (we) => {
          const exerciseSets = await db
            .select({
              id: sets.id,
              setNumber: sets.setNumber,
              reps: sets.reps,
              weight: sets.weight,
            })
            .from(sets)
            .where(eq(sets.workoutExerciseId, we.id))
            .orderBy(sets.setNumber);

          return {
            id: we.id,
            name: we.exerciseName,
            order: we.order,
            sets: exerciseSets,
          };
        })
      );

      return {
        ...workout,
        exercises: exercisesWithSets,
      };
    })
  );

  return workoutsWithExercises;
}
