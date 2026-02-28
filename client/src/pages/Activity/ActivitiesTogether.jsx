import { useState, useEffect } from "react";

import { apiReq } from "../../utils/apiReq";
import { useUser } from "../../store/UserContext";
import useFilterSort from "../../hooks/useFilterSort";
import FilterSortControls from "../../components/FilterSortControls";
import { getApiUrl } from "../../config/apiConfig";
import ActivityCard from "../../components/ActivityCard";

function ActivitiesTogether() {
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
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, user, isInitializing]);

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
                        <ActivityCard key={item.id} item={item} />
                    ))}
                </ul>
            ) : (
                <>
                    <p>Не добавлено ни одной активности или нет совпадений по фильтрам</p>
                    <p>Добавить?</p>
                </>
            )}
        </div>
    );
}

export default ActivitiesTogether;
