import { parse } from "date-fns";
import { getWorkoutsForDate } from "@/data/workouts";
import { DatePickerCard } from "@/components/dashboard/date-picker-card";
import { WorkoutsCard } from "@/components/dashboard/workouts-card";

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

function parseLocalDate(dateString: string): Date {
  // Parse as local date to avoid UTC conversion issues
  return parse(dateString, "yyyy-MM-dd", new Date());
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const selectedDate = params.date ? parseLocalDate(params.date) : new Date();

  const workouts = await getWorkoutsForDate(selectedDate);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Workout Dashboard</h1>

      <div className="grid gap-8 md:grid-cols-[auto_1fr]">
        <DatePickerCard selectedDate={selectedDate} />
        <WorkoutsCard selectedDate={selectedDate} workouts={workouts} />
      </div>
    </div>
  );
}
