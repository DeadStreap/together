const MONTH_NAMES = {
  '01': 'Январь', '02': 'Февраль', '03': 'Март', '04': 'Апрель',
  '05': 'Май', '06': 'Июнь', '07': 'Июль', '08': 'Август',
  '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь', '12': 'Декабрь'
};

export const getMonthLabel = (monthKey) => {
  if (!monthKey) return '';
  const parts = monthKey.split('-');
  if (parts.length !== 2) return monthKey;
  return `${MONTH_NAMES[parts[1]] || parts[1]} ${parts[0]}`;
};
