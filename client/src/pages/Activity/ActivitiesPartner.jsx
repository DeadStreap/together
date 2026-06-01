import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { apiReq } from "../../utils/apiReq";
import { getApiUrl } from "../../config/apiConfig";
import Pagination from "../../components/Pagination";
import ActivityCard from "../../components/ActivityCard";

function ActivitiesPartner() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    const { userId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const API_URL = getApiUrl(`/api/contents/user/${userId}`);
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
    }, [userId]);

    const totalPages = Math.ceil(contentItems.length / pageSize);
    const paginatedItems = contentItems.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <h1>Одиночные активности партнёра ({contentItems.length})</h1>

            {paginatedItems.length > 0 ? (
                <ul className="content-list">
                    {paginatedItems.map((item) => (
                        <ActivityCard key={item.id} item={item} />
                    ))}
                </ul>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-title">Нет активностей</div>
                    <p>У партнёра пока нет одиночных активностей</p>
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

export default ActivitiesPartner;

