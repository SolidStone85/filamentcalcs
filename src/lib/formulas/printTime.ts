// Print time estimate from weight and printer throughput.
// Deliberately simple. Real print time depends heavily on layer height,
// geometry, infill, and print speed. Slicer output is authoritative.
// This is for "ballpark how long" answers, not "what time will it finish."
//
// time_hours = grams / throughput_grams_per_hour

export type PrintTimeInput = {
  gramsUsed: number;
  throughputGramsPerHour: number;
};

export type PrintTimeResult = {
  hours: number; // decimal hours
  hoursInt: number;
  minutes: number;
  formatted: string; // "4h 35m"
};

export function calculatePrintTime({
  gramsUsed,
  throughputGramsPerHour,
}: PrintTimeInput): PrintTimeResult {
  if (throughputGramsPerHour <= 0) {
    return { hours: 0, hoursInt: 0, minutes: 0, formatted: "0h 0m" };
  }
  const hours = gramsUsed / throughputGramsPerHour;
  const hoursInt = Math.floor(hours);
  const minutes = Math.round((hours - hoursInt) * 60);
  return {
    hours,
    hoursInt,
    minutes,
    formatted: `${hoursInt}h ${minutes}m`,
  };
}
