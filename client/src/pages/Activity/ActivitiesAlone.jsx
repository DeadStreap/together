import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { apiReq } from "../../utils/apiReq";
import { useUser } from "../../store/UserContext";
import useFilterSort from "../../hooks/useFilterSort";
import FilterSortControls from "../../components/FilterSortControls";
import Pagination from "../../components/Pagination";
import { getApiUrl } from "../../config/apiConfig";
import ActivityCard from "../../components/ActivityCard";
import { usePageTitle } from "../../hooks/usePageTitle";

function ActivitiesAlone() {
    usePageTitle('Одиночные активности');
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

    if (!isAuthenticated || !user) {
        return (
            <div className="tasks-container create-activity-page">
                <div className="content-card content-card--detail activity-form-wrapper">
                    <div className="content-card-link">
                        <div className="item-title">Войдите в Together</div>
                        <p className="form-hint">
                            Чтобы видеть одиночные активности, войдите в аккаунт.
                        </p>
                        <div className="activity-form-actions">
                            <Link
                                to="/authorization"
                                className="primary-button"
                                style={{ textDecoration: "none", textAlign: "center" }}
                            >
                                Перейти к авторизации
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tasks-container">
            <h1>Мои одиночные активности ({totalItemsCount})</h1>

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
                    <div className="empty-state-icon">🌱</div>
                    <div className="empty-state-title">Нет одиночных активностей</div>
                    <p>Добавьте первую!</p>
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

export default ActivitiesAlone;
