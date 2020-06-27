import { PreferredHours } from "./FirstPart";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

/**
 * An ugly date representation
 */
export type DateDef = {
  dateString: string;
  title: string;
  times: PreferredHours[];
};

/**
 * Returns the `selectedTime` if avaliable on the specified date
 * or the first available time on the date
 */
export function getTimeForDate(selectedDate: DateDef, selectedTime: PreferredHours) {
  return selectedDate.times.includes(selectedTime)
    ? selectedTime
    : selectedDate.times[0];
}

/**
 * Get the next relevant days for volunteering
 */
export function getRelevantDays(): DateDef[] {
  const today = getOptionalToday();
  const nextDays = today ? 6 : 7;
  const days: DateDef[] = [];

  if (today) {
    days.push(today);
  }

  for (let i = 0; i < nextDays; i++) {
    const date = addDays(new Date(), i + 1);
    const dayName = dayNames[date.getDay()];
    days.push({
      dateString: formatDate(date),
      times: ["morning", "afternoon", "evening"],
      title: `${date.toLocaleDateString()} (${dayName})`,
    });
  }

  return days;
}

/**
 * Returns today as a `DateDef` if the current date has times
 * available for volunteering:
 *
 * * If the current time is after 6pm this is too late for today
 * * If the current time is before 6pm, show only "evening"
 * * If the current time is before 3pm, also show "afternoon"
 * * If the current time is before 12pm, also show "morning"
 */
function getOptionalToday(): DateDef | null {
  const now = new Date();
  const currentHour = now.getHours();
  if (currentHour > 18) return null;

  const times: PreferredHours[] = ["evening"];

  if (currentHour < 15) {
    times.unshift("afternoon");
  }

  if (currentHour < 12) {
    times.unshift("morning");
  }

  return {
    dateString: formatDate(now),
    title: "היום",
    times,
  };
}

/**
 * Format a date to the server to a string that the server understands
 */
export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Cheap translations
 */
const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
