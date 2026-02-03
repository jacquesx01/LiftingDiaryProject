"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DatePickerCardProps {
  selectedDate: Date;
}

export function DatePickerCard({ selectedDate }: DatePickerCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;

    const params = new URLSearchParams(searchParams.toString());
    // Use format to get local date string (avoids UTC conversion issues)
    params.set("date", format(date, "yyyy-MM-dd"));
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Date</CardTitle>
        <CardDescription>Choose a date to view your workouts</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
        />
      </CardContent>
    </Card>
  );
}
