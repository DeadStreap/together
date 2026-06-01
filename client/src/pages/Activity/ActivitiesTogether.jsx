import { useState, useEffect } from "react";

import { apiReq } from "../../utils/apiReq";
import { useUser } from "../../store/UserContext";
import useFilterSort from "../../hooks/useFilterSort";
import FilterSortControls from "../../components/FilterSortControls";
import Pagination from "../../components/Pagination";
import { getApiUrl } from "../../config/apiConfig";
import ActivityCard from "../../components/ActivityCard";

function ActivitiesTogether() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

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

    const totalPages = Math.ceil(filteredContent.length / pageSize);
    const paginatedItems = filteredContent.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChangeWithReset = (name, value) => {
        setCurrentPage(1);
        handleFilterChange(name, value);
    };

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
                onFilterChange={handleFilterChangeWithReset}
                onSortChange={handleSortChange}
                sortConfig={sortConfig}
            />

            {paginatedItems.length > 0 ? (
                <ul className="content-list">
                    {paginatedItems.map((item) => (
                        <ActivityCard key={item.id} item={item} />
                    ))}
                </ul>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-title">Нет активностей</div>
                    <p>Не добавлено ни одной активности или нет совпадений по фильтрам</p>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default ActivitiesTogether;
