export const getDateString = (date?: undefined | Date): string => {
  return date
    ? `${String(date.getFullYear()).padStart(4, "0")}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";
};
