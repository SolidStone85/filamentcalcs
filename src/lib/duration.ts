// Hours-and-minutes views of a duration stored as decimal hours.
// Pure helpers; the stored value is never rounded by viewing it.

type Blank = "";

/** 7.75 -> { hours: 7, minutes: 45 }. Minutes keep one decimal only when needed (11.33 -> 19.8). */
export function splitHours(total: number | Blank): { hours: number | Blank; minutes: number | Blank } {
  if (total === "" || !Number.isFinite(total) || total < 0) return { hours: "", minutes: "" };
  let hours = Math.floor(total + 1e-9);
  let minutes = Math.round((total - hours) * 600) / 10;
  if (minutes >= 60) {
    hours += 1;
    minutes = 0;
  }
  return { hours, minutes: Math.max(0, minutes) };
}

/** One empty box counts as 0 when the other is filled. Both empty means unanswered. */
export function joinHours(hours: number | Blank, minutes: number | Blank): number | Blank {
  if (hours === "" && minutes === "") return "";
  return (hours === "" ? 0 : hours) + (minutes === "" ? 0 : minutes) / 60;
}

/** 0.25 -> 15. Rounded to two decimals for display only. */
export function hoursToMinutes(hours: number | Blank): number | Blank {
  if (hours === "" || !Number.isFinite(hours)) return "";
  return Math.round(hours * 6000) / 100;
}

export function minutesToHours(minutes: number | Blank): number | Blank {
  if (minutes === "" || !Number.isFinite(minutes)) return "";
  return minutes / 60;
}

/** "7 h 45 min", "38 min", "6 h". */
export function formatDuration(totalHours: number): string {
  const { hours, minutes } = splitHours(totalHours);
  if (hours === "" || minutes === "") return "";
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}
