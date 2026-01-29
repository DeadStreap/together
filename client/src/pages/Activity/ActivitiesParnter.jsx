import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { apiReq } from "../../utils/apiReq";
import { getApiUrl } from "../../config/apiConfig";
import { getCategoryDisplayName } from "../../utils/displayMappings";
import StatusIcon from "../../components/StatusIcon";

function ActivitiesParnter() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userId } = useParams();

    const API_URL = getApiUrl('/api/contents');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await apiReq(API_URL);

                const partnerId = Number(userId);

                const filteredData = data.filter(
                    (item) =>
                        item.shared_with_partner == false &&
                        item.added_by_user_id == partnerId
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
                        <li key={item.id} className="content-card" data-status={item.status}>
                            <Link
                                to={`/activity/${item.id}`}
                                className="content-card-link"
                            >
                                <div className="item-title-card">
                                    <StatusIcon status={item.status} />
                                    <div className="item-title-content">
                                        {item.title || "Без названия"}
                                    </div>
                                </div>
                                <div className="item-details">
                                    <span>Категория</span>:{" "}
                                    {getCategoryDisplayName(item.category) || "N/A"}
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
                                                    const date = new Date(
                                                        item.added_at
                                                    );
                                                    const formattedDate =
                                                        date.toLocaleDateString(
                                                            "ru-RU",
                                                            {
                                                                day: "2-digit",
                                                                month: "long",
                                                                year: "numeric",
                                                            }
                                                        );
                                                    const formattedTime =
                                                        date.toLocaleTimeString(
                                                            "ru-RU",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        );
                                                    return `${formattedDate} ${formattedTime}`;
                                                })()
                                                : "не указано"}
                                        </span>
                                    </span>
                                    <span>
                                        <span>Начало</span>
                                        <span>
                                            {item.start_date
                                                ? new Date(
                                                    item.start_date
                                                ).toLocaleDateString()
                                                : "не указано"}
                                        </span>
                                    </span>
                                    <span>
                                        <span>Конец</span>
                                        <span>
                                            {item.end_date
                                                ? new Date(
                                                    item.end_date
                                                ).toLocaleDateString()
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
                    <p>У партнёра пока нет одиночных активностей.</p>
                </>
            )}
        </div>
    );
}

export default ActivitiesParnter;

