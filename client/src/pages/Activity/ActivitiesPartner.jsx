import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { apiReq } from "../../utils/apiReq";
import { getApiUrl } from "../../config/apiConfig";
import ActivityCard from "../../components/ActivityCard";

function ActivitiesPartner() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

            {contentItems.length > 0 ? (
                <ul className="content-list">
                    {contentItems.map((item) => (
                        <ActivityCard key={item.id} item={item} />
                    ))}
                </ul>
            ) : (
                <p>У партнёра пока нет одиночных активностей.</p>
            )}
        </div>
    );
}

export default ActivitiesPartner;

