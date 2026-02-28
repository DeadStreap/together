import { useState, useEffect } from "react";

import { apiReq } from "../../utils/apiReq";
import { useUser } from "../../store/UserContext";
import useFilterSort from "../../hooks/useFilterSort";
import FilterSortControls from "../../components/FilterSortControls";
import { getApiUrl } from "../../config/apiConfig";
import ActivityCard from "../../components/ActivityCard";

function ActivitiesAlone() {
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

                const API_URL = getApiUrl(`/api/contents/user/${user.id}`);
                const data = await apiReq(API_URL);

                const filteredData = data.filter(
                    (item) => item.shared_with_partner == false
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
                        <ActivityCard key={item.id} item={item} />
                    ))}
                </ul>
            ) : (
                <>
                    <p>Не добавлено ни одной активности</p>
                    <p>Добавить?</p>
                </>
            )}
        </div>
    );
}

export default ActivitiesAlone;
