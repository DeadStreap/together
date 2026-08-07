const MONTHS_FULL = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_SHORT = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
];

const getMonthIndex = (monthKey) => {
  if (!monthKey) return -1;
  const m = String(monthKey).split('-').pop();
  const index = parseInt(m, 10) - 1;
  return index >= 0 && index < 12 ? index : -1;
};

export const getMonthName = (monthKey) => {
  const i = getMonthIndex(monthKey);
  return i === -1 ? '' : MONTHS_FULL[i];
};

export const getMonthShort = (monthKey) => {
  const i = getMonthIndex(monthKey);
  return i === -1 ? '' : MONTHS_SHORT[i];
};

export const getMonthLabel = (monthKey) => {
  if (!monthKey) return '';
  const parts = monthKey.split('-');
  if (parts.length !== 2) return monthKey;
  return `${getMonthName(monthKey) || parts[1]} ${parts[0]}`;
};
