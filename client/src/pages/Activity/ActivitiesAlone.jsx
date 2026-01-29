import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { apiReq } from "../../utils/apiReq";
import { useUser } from "../../store/UserContext";
import useFilterSort from "../../hooks/useFilterSort";
import FilterSortControls from "../../components/FilterSortControls";
import { getApiUrl } from "../../config/apiConfig";
import { getCategoryDisplayName } from "../../utils/displayMappings";
import StatusIcon from "../../components/StatusIcon";

function ActivitiesAlone() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, isAuthenticated } = useUser();

    const API_URL = getApiUrl('/api/contents');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await apiReq(API_URL);

                if (!isAuthenticated || !user) {
                    setContentItems([]);
                    setIsLoading(false);
                    return;
                }

                const currentId = user.id;

                const filteredData = data.filter(
                    (item) =>
                        item.shared_with_partner == false &&
                        item.added_by_user_id == currentId
                );
                setContentItems(filteredData);
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
            <h1>Мои одиночные активности ({totalItemsCount})</h1>

            <FilterSortControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                sortConfig={sortConfig}
            />

            {!isAuthenticated || !user ? (
                <p>
                    Чтобы увидеть одиночные активности, нужно авторизоваться.
                </p>
            ) : null}

            {filteredContent.length > 0 ? (
                <ul className="content-list">
                    {filteredContent.map((item) => (
                        <li key={item.id} className="content-card" data-status={item.status}>
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
                                    {item.start_date ?
                                        <span>
                                            <span>Начато</span>
                                            <span>
                                                {new Date(item.start_date).toLocaleDateString()}
                                            </span>
                                        </span>
                                        : <></>}
                                    {item.end_date ?
                                        <span>
                                            <span>Завершено</span>
                                            <span>
                                                {new Date(item.end_date).toLocaleDateString()}
                                            </span>
                                        </span>
                                        : <></>}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                <p>Не добавленно ни одной активности</p>
                <p>Добавить?</p>
                </>
            )}
        </div>
    );
}

export default ActivitiesAlone;
