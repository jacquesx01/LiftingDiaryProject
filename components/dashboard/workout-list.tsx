"use client";

import { Dumbbell, Clock } from "lucide-react";
import type { WorkoutWithExercises } from "@/app/dashboard/actions";

interface WorkoutListProps {
  workouts: WorkoutWithExercises[];
  isLoading: boolean;
}

export function WorkoutList({ workouts, isLoading }: WorkoutListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12">
        <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No workouts logged
        </h3>
        <p className="text-muted-foreground">
          No workouts were recorded for this date.
        </p>
      </div>
    );
  }

  const formatTime = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="border border-border rounded-xl p-6 bg-card"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {workout.name || "Workout"}
              </h3>
              {(workout.startedAt || workout.completedAt) && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    {workout.startedAt && `Started: ${formatTime(workout.startedAt)}`}
                    {workout.startedAt && workout.completedAt && " • "}
                    {workout.completedAt && `Completed: ${formatTime(workout.completedAt)}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {workout.exercises.length > 0 ? (
            <div className="space-y-4">
              {workout.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-border rounded-lg p-4 bg-background"
                >
                  <h4 className="font-medium text-foreground mb-3">
                    {exercise.name}
                  </h4>

                  {exercise.sets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-muted-foreground border-b border-border">
                            <th className="text-left py-2 pr-4">Set</th>
                            <th className="text-left py-2 pr-4">Weight</th>
                            <th className="text-left py-2">Reps</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set) => (
                            <tr key={set.id} className="border-b border-border last:border-0">
                              <td className="py-2 pr-4">{set.setNumber}</td>
                              <td className="py-2 pr-4">
                                {set.weight ? `${set.weight} lbs` : "-"}
                              </td>
                              <td className="py-2">{set.reps ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No sets recorded</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No exercises in this workout</p>
          )}
        </div>
      ))}
    </div>
  );
}
