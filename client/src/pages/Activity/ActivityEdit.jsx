import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as styles from "../../styles/style";

function ActivityEdit() {
    const { ActivityId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "anime",
        status: "planned",
        start_date: "",
        end_date: "",
        shared_with_partner: true,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API = "together-alpha-one.vercel.app";
    const GET_API_URL = `https://${API}/api/content/id/${ActivityId}`;
    const UPDATE_API_URL = `https://${API}/api/update/content`;

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(GET_API_URL);

                if (!response.ok) {
                    throw new Error(
                        `Ошибка сети: ${response.statusText} (${response.status})`
                    );
                }

                const data = await response.json();

                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error("Активность не найдена");
                }

                const item = data[0];

                setFormData({
                    title: item.title || "",
                    category: item.category || "anime",
                    status: item.status || "planned",
                    start_date: item.start_date
                        ? new Date(item.start_date).toISOString().slice(0, 10)
                        : "",
                    end_date: item.end_date
                        ? new Date(item.end_date).toISOString().slice(0, 10)
                        : "",
                    shared_with_partner:
                        typeof item.shared_with_partner === "boolean"
                            ? item.shared_with_partner
                            : true,
                });

                setIsLoading(false);
            } catch (err) {
                console.error("Ошибка при загрузке активности:", err);
                setError(err);
                setIsLoading(false);
            }
        };

        fetchActivity();
    }, [GET_API_URL]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError(null);

            const payload = {
                id: ActivityId,
                title: formData.title,
                category: formData.category,
                status: formData.status,
                shared_with_partner: formData.shared_with_partner,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
            };

            const response = await fetch(UPDATE_API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            navigate(`/activity/${ActivityId}`);
        } catch (err) {
            console.error("Ошибка при обновлении активности:", err);
            setError(err);
        }
    };

    if (isLoading) {
        return <div className="loading">Загрузка активности...</div>;
    }

    if (error) {
        return (
            <div className="error">
                Ошибка: {error.message || "Неизвестная ошибка"}
            </div>
        );
    }

    return (
        <div className="tasks-container create-activity-page">
            <div className="content-card content-card--detail activity-form-wrapper">
                <div className="content-card-link">
                    <div className="item-title">Редактировать активность</div>

                    <form onSubmit={handleSubmit} className="activity-form">
                        <div className="activity-form-field">
                            <label htmlFor="title">Название</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="activity-form-field">
                            <label htmlFor="category">Категория</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="anime">Аниме</option>
                                <option value="game">Игра</option>
                                <option value="film">Фильм</option>
                                <option value="serial">Сериал</option>
                            </select>
                        </div>

                        <div className="activity-form-field">
                            <span>Статус</span>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="planned">Запланировано</option>
                                <option value="inProgress">В процессе</option>
                                <option value="done">Завершено</option>
                            </select>
                        </div>

                        <div className="activity-form-field">
                            <label htmlFor="start_date">Дата начала</label>
                            <input
                                id="start_date"
                                type="date"
                                name="start_date"
                                value={formData.start_date || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="activity-form-field">
                            <label htmlFor="end_date">Дата окончания</label>
                            <input
                                id="end_date"
                                type="date"
                                name="end_date"
                                value={formData.end_date || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="activity-form-checkbox">
                            <input
                                id="shared_with_partner"
                                type="checkbox"
                                name="shared_with_partner"
                                checked={formData.shared_with_partner}
                                onChange={handleChange}
                            />
                            <label htmlFor="shared_with_partner">
                                Совместно с партнёром
                            </label>
                        </div>

                        <div className="activity-form-actions">
                            <button type="submit" className="primary-button">
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ActivityEdit;

