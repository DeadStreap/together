import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { apiReq } from "../../utils/apiReq";
import { useUser } from "../../store/UserContext";
import useFilterSort from "../../hooks/useFilterSort";
import FilterSortControls from "../../components/FilterSortControls";
import { getApiUrl } from "../../config/apiConfig";
import { getCategoryDisplayName } from "../../utils/displayMappings";
import StatusIcon from "../../components/StatusIcon";

function ActivitiesTogether() {
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
                console.log(API_URL)
                const data = await apiReq(API_URL);

                setContentItems(data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, user]);

    const { filters, sortConfig, filteredContent, handleFilterChange, handleSortChange, totalItemsCount } = useFilterSort(contentItems);

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
    return (
        <div className="tasks-container">
            <h1>Совместные активности ({totalItemsCount})</h1>

            <FilterSortControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                sortConfig={sortConfig}
            />

            {!isAuthenticated || !user ? (
                <p>
                    Чтобы увидеть совместные активности, нужно авторизоваться и
                    быть в паре.
                </p>
            ) : null}

            {filteredContent.length > 0 ? (
                <ul className="content-list">
                    {filteredContent.map((item) => (
                        <li key={item.id} className="content-card">
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
                                    <span>
                                        <span>Начало</span>
                                        <span>
                                            {item.start_date
                                                ? new Date(item.start_date).toLocaleDateString()
                                                : "не указано"}
                                        </span>
                                    </span>
                                    <span>
                                        <span>Конец</span>
                                        <span>
                                            {item.end_date
                                                ? new Date(item.end_date).toLocaleDateString()
                                                : "не указано"}
                                        </span>
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                <p>Не добавленно ни одной активности или нет совпадений по фильтрам</p>
                <p>Добавить?</p>
                </>
            )}
        </div>
    );
}

export default ActivitiesTogether;
