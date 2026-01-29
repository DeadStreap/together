import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { apiReq } from '../../utils/apiReq';
import { getApiUrl } from '../../config/apiConfig';
import { getCategoryDisplayName } from '../../utils/displayMappings';
import StatusIcon from '../../components/StatusIcon';
import StatisticsBlock from '../../components/StatisticsBlock';
import { useUser } from '../../store/UserContext';

function Activities() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, isAuthenticated } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

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
    }, [isAuthenticated, user]);
    
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
    // Get in-progress activities
    const inProgressItems = contentItems.filter(item => item.status === 'inProgress');

    // Get 5 most recently added items
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
                            <li key={`inprogress-${item.id}`} className="content-card" data-status={item.status}>
                                <Link to={`/activity/${item.id}`} className="content-card-link">
                                    <div className="item-title-card">
                                        <StatusIcon status={item.status} />
                                        <div className="item-title-content">
                                            {item.title || "Без названия"}
                                        </div>
                                    </div>
                                    <div className="item-details">
                                        <span>Категория</span>: {getCategoryDisplayName(item.category) || "N/A"}
                                    </div>
                                    <div className="item-details">
                                        <span>Добавил</span>: {item.added_by || "N/A"}
                                    </div>
                                    <div className="item-dates">
                                        <span>
                                            <span>Добавлено</span>
                                            <span>
                                                {item.added_at
                                                    ? (() => {
                                                        const date = new Date(item.added_at);
                                                        const formattedDate = date.toLocaleDateString('ru-RU', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        });
                                                        const formattedTime = date.toLocaleTimeString('ru-RU', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        });
                                                        return `${formattedDate} ${formattedTime}`;
                                                    })()
                                                    : "не указано"}
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="no-in-progress-items">
                    <h1>Сейчас у вас нет активностей в процессе</h1>
                </div>
            )}

            {recentItems.length > 0 ? (
                <div className="recently-added-section">
                    <h1>Добавленно недавно</h1>
                    <ul className="content-list">
                        {recentItems.map((item) => (
                            <li key={`recent-${item.id}`} className="content-card" data-status={item.status}>
                                <Link to={`/activity/${item.id}`} className="content-card-link">
                                    <div className="item-title-card">
                                        <StatusIcon status={item.status} />
                                        <div className="item-title-content">
                                            {item.title || "Без названия"}
                                        </div>
                                    </div>
                                    <div className="item-details">
                                        <span>Категория</span>: {getCategoryDisplayName(item.category) || "N/A"}
                                    </div>
                                    <div className="item-details">
                                        <span>Добавил</span>: {item.added_by || "N/A"}
                                    </div>
                                    <div className="item-dates">
                                        <span>
                                            <span>Добавлено</span>
                                            <span>
                                                {item.added_at
                                                    ? (() => {
                                                        const date = new Date(item.added_at);
                                                        const formattedDate = date.toLocaleDateString('ru-RU', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        });
                                                        const formattedTime = date.toLocaleTimeString('ru-RU', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        });
                                                        return `${formattedDate} ${formattedTime}`;
                                                    })()
                                                    : "не указано"}
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="no-recent-items">
                    <h1>Пока ничего не добавленно</h1>
                </div>
            )}
        </div>
    );
}

export default Activities;
