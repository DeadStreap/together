import { useState, useEffect } from "react";

import { apiReq } from '../../utils/apiReq';
import { getApiUrl } from '../../config/apiConfig';
import StatisticsBlock from '../../components/StatisticsBlock';
import { useUser } from '../../store/UserContext';
import ActivityCard from '../../components/ActivityCard';

function Activities() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, isInitializing, isAuthenticated } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                if (isInitializing) {
                    return;
                }

                if (!isAuthenticated || !user) {
                    setContentItems([]);
                    setIsLoading(false);
                    return;
                }

                const userId = user.id;
                const partnerId = user.partner_id || null;

                if (!partnerId) {
                    setContentItems([]);
                    setIsLoading(false);
                    return;
                }

                const API_URL = getApiUrl(`/api/contents/together/${userId}/${partnerId}`);
                const data = await apiReq(API_URL);

                setContentItems(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, user, isInitializing]);

    if (isLoading) {
        return <div className="loading">Загрузка контента...</div>;
    }

    if (error) {
        return (
            <div className="error">
                Ошибка: {error.message || "Неизвестная ошибка"}
            </div>
        );
    }

    const inProgressItems = contentItems.filter(item => item.status === 'inProgress');

    const completedItems = contentItems
        .filter(item => item.status === 'done')
        .slice()
        .sort((a, b) => new Date(b.end_date || b.added_at) - new Date(a.end_date || a.added_at))
        .slice(0, 5);

    const recentItems = contentItems
        .slice()
        .sort((a, b) => new Date(b.added_at) - new Date(a.added_at))
        .slice(0, 5);

    return (
        <div className="tasks-container">
            <StatisticsBlock />

            {inProgressItems.length > 0 ? (
                <div className="in-progress-section">
                    <h1>Активности сейчас</h1>
                    <ul className="content-list">
                        {inProgressItems.map((item) => (
                            <ActivityCard key={`inprogress-${item.id}`} item={item} />
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="no-in-progress-items">
                    <h1>Сейчас у вас нет активностей в процессе</h1>
                </div>
            )}

            {completedItems.length > 0 ? (
                <div className="recently-completed-section">
                    <h1>Завершено недавно</h1>
                    <ul className="content-list">
                        {completedItems.map((item) => (
                            <ActivityCard key={`completed-${item.id}`} item={item} />
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="no-completed-items">
                    <h1>Пока ничего не завершено</h1>
                </div>
            )}

            {recentItems.length > 0 ? (
                <div className="recently-added-section">
                    <h1>Добавлено недавно</h1>
                    <ul className="content-list">
                        {recentItems.map((item) => (
                            <ActivityCard key={`recent-${item.id}`} item={item} />
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="no-recent-items">
                    <h1>Пока ничего не добавлено</h1>
                </div>
            )}
        </div>
    );
}

export default Activities;
