const formatWithZero = (number: number) =>
  number < 10 ? `0${number}` : number;

export const getStringDate = (
  targetDate: Date | string | number,
  format: string = "yyyy-mm-dd"
) => {
  const dateObj =
    targetDate instanceof Date ? targetDate : new Date(targetDate);
  const year = dateObj.getFullYear();
  const month = formatWithZero(dateObj.getMonth() + 1);
  const date = formatWithZero(dateObj.getDate());

  switch (format) {
    case "yyyy.mm.dd":
      return `${year}.${month}.${date}`;
    case "yyyy-mm-dd":
    default:
      return `${year}-${month}-${date}`;
  }
};
