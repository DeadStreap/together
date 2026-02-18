import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiReq, apiReqWithBody } from "../../utils/apiReq";
import { getApiUrl } from "../../config/apiConfig";

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
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const GET_API_URL = getApiUrl(`/api/content/id/${ActivityId}`);
    const UPDATE_API_URL = getApiUrl('/api/update/content');

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await apiReq(GET_API_URL);

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
        setIsSaving(true);
        setError(null);

        try {
            const payload = {
                id: ActivityId,
                title: formData.title,
                category: formData.category,
                status: formData.status,
                shared_with_partner: formData.shared_with_partner,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
            };

            await apiReqWithBody(UPDATE_API_URL, 'PUT', payload);

            navigate(`/activity/${ActivityId}`);
        } catch (err) {
            console.error("Ошибка при обновлении активности:", err);
            setError(err);
        } finally {
            setIsSaving(false);
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
                                disabled={isSaving}
                            />
                        </div>

                        <div className="activity-form-field">
                            <label htmlFor="category">Категория</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                disabled={isSaving}
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
                                disabled={isSaving}
                            >
                                <option value="planned">Запланировано</option>
                                <option value="inProgress">В процессе</option>
                                <option value="done">Завершено</option>
                            </select>
                        </div>

                        <div className="activity-form-field">
                            <label htmlFor="start_date">Дата начала</label>
                            <div className="date-input-wrapper">
                                <input
                                    id="start_date"
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date || ""}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <div className="activity-form-field">
                            <label htmlFor="end_date">Дата окончания</label>
                            <div className="date-input-wrapper">
                                <input
                                    id="end_date"
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date || ""}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <div className="activity-form-checkbox">
                            <input
                                id="shared_with_partner"
                                type="checkbox"
                                name="shared_with_partner"
                                checked={formData.shared_with_partner}
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                            <label htmlFor="shared_with_partner">
                                Совместно с партнёром
                            </label>
                        </div>

                        <div className="activity-form-actions">
                            <button type="submit" className="primary-button" disabled={isSaving}>
                                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ActivityEdit;
