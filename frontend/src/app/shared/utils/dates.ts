export const getUNIXTimestamp = (date: Date) =>
  Math.ceil(date.getTime() / 1000);
