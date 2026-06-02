import { useRef, useEffect } from 'react';
import ActivityCard from './ActivityCard';

const MONTH_NAMES = {
  '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр',
  '05': 'Май', '06': 'Июн', '07': 'Июл', '08': 'Авг',
  '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек'
};

const getMonthYearLabel = (monthKey) => {
  const [year, month] = monthKey.split('-');
  return `${MONTH_NAMES[month] || month} ${year}`;
};

const formatDayMonth = (dateStr) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
};

const Timeline = ({ activities, visibleCount, onLoadMore }) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore]);

  const visibleActivities = activities.slice(0, visibleCount);
  const hasMore = visibleCount < activities.length;

  const groupedByMonth = {};
  visibleActivities.forEach((item) => {
    if (!item.end_date) return;
    const key = item.end_date.slice(0, 7);
    if (!groupedByMonth[key]) groupedByMonth[key] = [];
    groupedByMonth[key].push(item);
  });

  const monthKeys = Object.keys(groupedByMonth);

  return (
    <div className="timeline">
      {monthKeys.map((monthKey) => {
        const items = groupedByMonth[monthKey];
        const days = {};
        items.forEach((item) => {
          const dayKey = item.end_date;
          if (!days[dayKey]) days[dayKey] = [];
          days[dayKey].push(item);
        });
        const dayKeys = Object.keys(days).sort((a, b) => new Date(b) - new Date(a));

        return (
          <div key={monthKey} className="timeline-month-group" data-month={monthKey}>
            <div className="timeline-month-marker">
              <span className="timeline-month-label">{getMonthYearLabel(monthKey)}</span>
            </div>
            {dayKeys.map((dayKey) => (
              <div key={dayKey} className="timeline-day-group">
                <div className="timeline-day-marker">
                  <span className="timeline-date">{formatDayMonth(dayKey)}</span>
                </div>
                <div className="timeline-cards">
                  {days[dayKey].map((item) => (
                    <ActivityCard key={item.id} item={item} showFullDates hideMeta />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {hasMore && (
        <div ref={sentinelRef} className="timeline-sentinel">
          <div className="timeline-loading-spinner" />
        </div>
      )}

      {!hasMore && activities.length > 0 && (
        <div className="timeline-end">
          Все активности загружены
        </div>
      )}
    </div>
  );
};

export default Timeline;
