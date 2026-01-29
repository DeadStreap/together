import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../store/UserContext";
import { getApiUrl } from "../../config/apiConfig";

function CreateActivity() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const [formData, setFormData] = useState({
        title: "",
        category: "anime",
        status: "planned",
        start_date: null,
        shared_with_partner: true, 
    });

    const API_URL = getApiUrl('/api/create/content');

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
            if (!isAuthenticated || !user) {
                throw new Error(
                    "Чтобы добавить активность, необходимо авторизоваться"
                );
            }

            const payload = {
                title: formData.title,
                category: formData.category,
                status: formData.status,
                added_by_user_id: user.id,
            };

            if (formData.start_date) {
                payload.start_date = formData.start_date;
            }

            if (formData.end_date) {
                payload.end_date = formData.end_date;
            }

            if (formData.shared_with_partner) {
                payload.shared_with_partner = true;
            }

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            navigate("/");
        } catch (err) {
            setError(err);
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="tasks-container create-activity-page">
                <div className="content-card content-card--detail activity-form-wrapper">
                    <div className="content-card-link">
                        <div className="item-title">Новая активность</div>
                        <p
                            style={{
                                fontSize: 13,
                                color: "#6b7280",
                                marginTop: 8,
                                marginBottom: 12,
                            }}
                        >
                            Чтобы добавить активность, необходимо авторизоваться.
                        </p>
                        <div className="activity-form-actions">
                            <Link
                                to="/authorization"
                                className="primary-button"
                                style={{
                                    textDecoration: "none",
                                    textAlign: "center",
                                }}
                            >
                                Перейти к авторизации
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                    <div className="item-title">Новая активность</div>

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

                        {formData.status == 'done' ?
                            <div className="activity-form-field">
                                <label htmlFor="end_date">Дата конца</label>
                                <input
                                    id="end_date"
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            :
                            <></>
                        }

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
                                Сохранить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateActivity;
