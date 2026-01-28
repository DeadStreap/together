import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "../../styles/style";

function CreateActivity() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        category: "anime",
        status: "planned",
        start_date: null,
        shared_with_partner: true, 
    });

    const API = "together-alpha-one.vercel.app";
    const API_URL = `https://${API}/api/create/content`;

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
            const payload = {
                title: formData.title,
                category: formData.category,
                status: formData.status,
                added_by_user_id: 1,
            };

            if (formData.start_date) {
                payload.start_date = formData.start_date;
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

    if (error) {
        return (
            <div className="error">
                Ошибка: {error.message || "Неизвестная ошибка"}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 50 }}>
            <label>
                Название:
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Категория:
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="anime">Аниме</option>
                    <option value="game">Игра</option>
                    <option value="film">Фильм</option>
                    <option value="serial">Сериал</option>
                </select>
            </label>

            <label>
                Совместно:
                <input
                    type="checkbox"
                    name="shared_with_partner"
                    checked={formData.shared_with_partner}
                    onChange={handleChange}
                />
            </label>

            <label>
                Статус:
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="planned">Запланировано</option>
                    <option value="inProgress">В процессе</option>
                    <option value="done">Завершено</option>
                </select>
            </label>

            <label>
                Дата начала:
                <input
                    type="date"
                    name="start_date"
                    value={formData.start_date || ""}
                    onChange={handleChange}
                />
            </label>

            <button type="submit" style={styles.buttonStyles('primary')}>Отправить</button>
        </form>
    );
}

export default CreateActivity;
