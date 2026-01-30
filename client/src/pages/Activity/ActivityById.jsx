import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getApiUrl } from '../../config/apiConfig';
import { useUser } from "../../store/UserContext";
import { getCategoryDisplayName, getStatusDisplayName } from '../../utils/displayMappings';
import StatusIcon from '../../components/StatusIcon';


function ActivityById() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useUser();

    const params = useParams();
    const navigate = useNavigate();
    const ActivityId = params.ActivityId;

    const API_URL = getApiUrl(`/api/content/id/${ActivityId}`);

    useEffect(() => {
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Ошибка сети: ${response.statusText} (${response.status})`
                    );
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setContentItems(data);
                } else {
                    throw new Error("Некорректный формат данных от API");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка при получении данных:", error);
                setError(error);
                setIsLoading(false);
            });
    }, []);

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                getApiUrl('/api/delete/content'),
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: ActivityId }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Ошибка при удалении: ${response.statusText} (${response.status})`
                );
            }

            navigate("/");
        } catch (err) {
            console.error("Ошибка при удалении активности:", err);
            setError(err);
            setIsLoading(false);
        }
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

    const item = contentItems[0];

    if (!item) {
        return (
            <div className="tasks-container">
                <p>На данный момент контент отсутствует.</p>
            </div>
        );
    }

    return (
        <div className="tasks-container">
            <div className="content-card content-card--detail">
                <div className="content-card-link" style={{ paddingBottom: 12 }}>
                    <div className="content-detail-header">
                        <button onClick={() => navigate(-1)} className="content-detail-back">
                            ← Назад к списку
                        </button>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            {user.id == item.added_by_user_id &&
                                <>
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <Link
                                            to={`/activity/${ActivityId}/edit`}
                                            className="icon-button-edit"
                                        >
                                            <img src="/edit.svg" alt="Edit" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={isLoading}
                                            className="icon-button-delete"
                                        >
                                            <img src="/trash.svg" alt="Delete" />
                                        </button>
                                    </div>
                                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                                        ID: {ActivityId}
                                    </span>
                                </>
                            }
                        </div>
                    </div>

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
                    <div className="item-details">
                        <span>Статус</span>: {getStatusDisplayName(item.status) || "не указан"}
                    </div>

                    <div className="item-dates">
                        <span>
                            <span>Добавлено</span>
                            <span>
                                {item.added_at
                                    ? (() => {
                                        const date = new Date(item.added_at);
                                        const formattedDate = date.toLocaleDateString(
                                            "ru-RU",
                                            {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        );
                                        const formattedTime = date.toLocaleTimeString(
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
                    
                </div>
            </div>
        </div>
    );
}

export default ActivityById;
