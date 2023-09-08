export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function years(startYear, endYear) {
  const currentYear = endYear || 2090;
  const years = [];
  startYear = startYear || 1960;
  while (startYear <= currentYear) {
    years.push(startYear++);
  }
  return years;
}
