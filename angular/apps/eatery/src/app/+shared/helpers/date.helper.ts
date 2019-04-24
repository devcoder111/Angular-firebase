export const getDateSortableString = (date: Date) => {
  const year = date.getFullYear();
  const monthNumber = date.getMonth() + 1;
  const monthStr = monthNumber < 10 ? '0' + monthNumber : monthNumber + '';
  const day = date.getDate();
  const dayStr = day < 10 ? '0' + day : day + '';
  return `${year}-${monthStr}-${dayStr}`;
};
