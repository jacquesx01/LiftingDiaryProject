"use client";

import { useState, useEffect, useCallback } from "react";
import { DatePicker } from "./date-picker";
import { WorkoutList } from "./workout-list";
import { getWorkoutsForDate, type WorkoutWithExercises } from "@/app/dashboard/actions";

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkouts = useCallback(async (date: string) => {
    setIsLoading(true);
    try {
      const data = await getWorkoutsForDate(date);
      setWorkouts(data);
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
      setWorkouts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts(selectedDate);
  }, [selectedDate, fetchWorkouts]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="space-y-8">
      <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
      <WorkoutList workouts={workouts} isLoading={isLoading} />
    </div>
  );
}
