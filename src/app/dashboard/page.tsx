"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock workout data for UI demonstration
const mockWorkouts = [
  {
    id: "1",
    name: "Bench Press",
    sets: 4,
    reps: 8,
    weight: 185,
  },
  {
    id: "2",
    name: "Squat",
    sets: 5,
    reps: 5,
    weight: 275,
  },
  {
    id: "3",
    name: "Deadlift",
    sets: 3,
    reps: 5,
    weight: 315,
  },
];

function formatDate(date: Date): string {
  return format(date, "do MMM yyyy");
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Workout Dashboard</h1>

      <div className="grid gap-8 md:grid-cols-[auto_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>
              Choose a date to view your workouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workouts for {formatDate(selectedDate)}</CardTitle>
            <CardDescription>
              {mockWorkouts.length} exercise{mockWorkouts.length !== 1 && "s"}{" "}
              logged
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWorkouts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No workouts logged for this date.
                </p>
              ) : (
                mockWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.sets} sets x {workout.reps} reps
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{workout.weight} lbs</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
