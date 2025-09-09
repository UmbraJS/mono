import type { Workday } from "../types";

export function getDay(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatDay(day: Workday) {
  const date = new Date(day.date);
  const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
  const dayNumber = date.getDate();
  return `${dayName} ${dayNumber}`;
}

export function getPlaceEmoji(place: string) {
  switch (place) {
    case "Home":
      return "🏠";
    case "Office":
      return "🏢";
    default:
      return "❓";
  }
}

export function getMoodEmoji(moodValue: number) {
  if (moodValue >= 8) return "😄";
  if (moodValue >= 5) return "😐";
  return "😞";
}

export function getMoodColor(moodValue: number) {
  if (moodValue >= 8) return "var(--success-50)";
  if (moodValue >= 5) return "var(--yellow-50)";
  return "var(--warning-50)";
}

export function formatHours(day: Workday) {
  const deficit = getDeficit(day);
  const overtime = getOvertime(day);
  const isExact = deficit === 0 && overtime === 0;
  if (!isExact) {
    return `${day.hours.value} / ${day.hours.expected}`;
  }
  return `${day.hours.value}`;
}

export function getDeficit(day: Workday) {
  return day.hours.expected - day.hours.value;
}

export function getOvertime(day: Workday) {
  return day.hours.value - day.hours.expected;
}

export function shortenName(name: string) {
  return name.slice(0, 3);
}
