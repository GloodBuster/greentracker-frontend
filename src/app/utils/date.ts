export const convertDateFormat = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const adjustDateForTimezone = (date: Date) => {
  const offset = date.getTimezoneOffset();
  if (offset > 0) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

export const convertToUTCDate = (timestamp: string): Date => {
  const [year, month, day] = timestamp.split('T')[0].split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};
