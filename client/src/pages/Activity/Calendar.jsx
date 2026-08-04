import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../store/UserContext';
import { apiReq } from '../../utils/apiReq';
import { getApiUrl } from '../../config/apiConfig';
import Timeline from '../../components/Timeline';
import { MonthNavigation } from '../../components/MonthNavigation';
import { usePageTitle } from '../../hooks/usePageTitle';

const PAGE_SIZE = 20;

function Calendar() {
  usePageTitle('Календарь');
  const { user, isInitializing, isAuthenticated } = useUser();
  const [allActivities, setAllActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const initialMonth = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  })();
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  useEffect(() => {
    const fetchData = async () => {
      if (isInitializing) return;

      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      const partnerId = user.partner_id;
      if (!partnerId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await apiReq(getApiUrl(`/api/contents/together/${user.id}/${partnerId}`));
        const doneSorted = (Array.isArray(data) ? data : [])
          .filter((item) => item.status === 'done' && item.end_date)
          .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

        setAllActivities(doneSorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, isInitializing]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allActivities.length));
  }, [allActivities.length]);

  const availableMonths = [...new Set(allActivities.map((a) => a.end_date.slice(0, 7)))].sort();

  const scrollToMonth = (monthKey) => {
    const targetIndex = allActivities.findIndex(
      (a) => a.end_date && a.end_date.slice(0, 7) === monthKey
    );
    if (targetIndex === -1) return;

    setCurrentMonth(monthKey);
    setVisibleCount((prev) => Math.max(prev, targetIndex + 1));

    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-month="${monthKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  if (isInitializing || isLoading) {
    return <div className="loading">Загрузка активностей...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="calendar-auth-required">
        <p>Войдите в систему, чтобы увидеть календарь</p>
        <Link to="/authorization" className="primary-button">Войти</Link>
      </div>
    );
  }

  if (!user.partner_id) {
    return (
      <div className="calendar-no-partner">
        <p>Календарь доступен только для пар</p>
        <p className="stats-hint">Объединитесь с партнёром, чтобы отслеживать прогресс вместе</p>
      </div>
    );
  }

  if (allActivities.length === 0) {
    return (
      <div className="calendar-empty">
        <h2>Нет завершённых активностей</h2>
        <p>Как только активность будет выполнена, она появится в календаре</p>
        <Link to="/activity/create" className="primary-button">Добавить активность</Link>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <MonthNavigation
        currentMonth={currentMonth}
        availableMonths={availableMonths}
        onPick={scrollToMonth}
      />
      <div>
        <Timeline
          activities={allActivities}
          visibleCount={visibleCount}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
}

export default Calendar;
