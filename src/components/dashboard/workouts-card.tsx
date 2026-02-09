import { format } from "date-fns";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WorkoutExercise {
  id: number;
  order: number;
  exercise: {
    id: number;
    name: string;
  };
  sets: {
    id: number;
    setNumber: number;
    reps: number | null;
    weight: string | null;
  }[];
}

interface Workout {
  id: number;
  name: string | null;
  createdAt: Date;
  workoutExercises: WorkoutExercise[];
}

interface WorkoutsCardProps {
  selectedDate: Date;
  workouts: Workout[];
}

function formatDate(date: Date): string {
  return format(date, "do MMM yyyy");
}

export function WorkoutsCard({ selectedDate, workouts }: WorkoutsCardProps) {
  const totalExercises = workouts.reduce(
    (acc, workout) => acc + workout.workoutExercises.length,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workouts for {formatDate(selectedDate)}</CardTitle>
        <CardDescription>
          {totalExercises} exercise{totalExercises !== 1 && "s"} logged
        </CardDescription>
        <CardAction>
          <Button asChild size="sm">
            <Link href="/dashboard/workout/new">New Workout</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {workouts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No workouts logged for this date.
            </p>
          ) : (
            workouts.map((workout) => (
              <div key={workout.id} className="space-y-4">
                {workout.name && (
                  <h3 className="font-semibold text-lg">{workout.name}</h3>
                )}
                {workout.workoutExercises.map((workoutExercise) => (
                  <div
                    key={workoutExercise.id}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="font-medium">
                      {workoutExercise.exercise.name}
                    </p>
                    <div className="mt-2 space-y-1">
                      {workoutExercise.sets.map((set) => (
                        <p
                          key={set.id}
                          className="text-sm text-muted-foreground"
                        >
                          Set {set.setNumber}: {set.reps ?? "-"} reps
                          {set.weight && ` @ ${set.weight} lbs`}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
