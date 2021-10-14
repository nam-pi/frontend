const REGEX =
  /^(?<y>(-|\+)?\d{4,6})-(?<m>\d{2})-(?<d>\d{2})T(?<h>\d{2}):(?<min>\d{2}):(?<sec>\d{2})?\.?(?<ms>\d+)?$/;

export const parseDate = (dateString: string): Date => {
  const match = REGEX.exec(dateString);
  if (match) {
    const year = match.groups?.y;
    const month = match.groups?.m;
    const day = match.groups?.d;
    const hour = match.groups?.h;
    const minutes = match.groups?.min;
    const seconds = match.groups?.sec || "0";
    const milliSeconds = match.groups?.ms || "0";
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minutes),
      Number(seconds),
      Number(milliSeconds)
    );
  }
  throw new Error("Illegal date: '" + dateString + "'");
};
