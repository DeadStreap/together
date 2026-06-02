import { useState, useRef, useEffect } from 'react';

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель',
  'Май', 'Июнь', 'Июль', 'Август',
  'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MonthNavigation = ({ currentMonth, availableMonths = [], onPick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState(() => {
    const [y] = currentMonth.split('-');
    return parseInt(y, 10);
  });
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getMonthLabel = (monthKey) => {
    const [, m] = monthKey.split('-');
    return MONTH_NAMES[parseInt(m, 10) - 1];
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0');
    return `${year}-${m}`;
  });

  return (
    <div className="month-navigation" ref={panelRef}>
      <button
        className="month-nav-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {getMonthLabel(currentMonth)}
      </button>

      {isOpen && (
        <div className="month-grid-panel">
          <div className="month-grid-header">
            <button className="month-grid-year-btn" onClick={() => setYear(y => y - 1)}>
              ←
            </button>
            <span className="month-grid-year">{year}</span>
            <button className="month-grid-year-btn" onClick={() => setYear(y => y + 1)}>
              →
            </button>
          </div>
          <div className="month-grid">
            {months.map((m) => (
              <button
                key={m}
                className={`month-grid-month ${m === currentMonth ? 'month-grid-month--active' : ''} ${!availableMonths.includes(m) ? 'month-grid-month--inactive' : ''}`}
                disabled={!availableMonths.includes(m)}
                onClick={() => {
                  if (availableMonths.includes(m)) {
                    onPick(m);
                    setIsOpen(false);
                  }
                }}
              >
                {getMonthLabel(m)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { MonthNavigation };
