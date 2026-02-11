import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/UserContext";
import { getApiUrl } from "../config/apiConfig";

function Authorization() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const API_URL = getApiUrl('/auth/login');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmedUsername = username.trim();
        if (!trimmedUsername || !password) {
            setError(new Error("Введите логин и пароль"));
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(getApiUrl('/api/auth/user'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: trimmedUsername,
                    password,
                }),
            });

            let data = null;
            try {
                data = await response.json();
            } catch (err) {
                // ignore parse error
            }

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Неверный пароль");
                }
                if (response.status === 404) {
                    throw new Error("Пользователь не найден");
                }
                throw new Error(
                    (data && data.error) || "Ошибка авторизации"
                );
            }

            login(data);
            navigate("/");
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tasks-container create-activity-page auth-page">
            <div className="content-card content-card--detail activity-form-wrapper auth-card">
                <div className="content-card-link">
                    <div className="item-title">Вход в Together</div>
                    <p
                        style={{
                            fontSize: 13,
                            color: "#6b7280",
                            marginBottom: 10,
                        }}
                    >
                        Введите логин и пароль, чтобы продолжить.
                    </p>

                    <form onSubmit={handleSubmit} className="activity-form">
                        <div className="activity-form-field">
                            <label htmlFor="username">Логин</label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="username"
                            />
                        </div>

                        <div className="activity-form-field">
                            <label htmlFor="password">Пароль</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#b91c1c",
                                    marginTop: 4,
                                }}
                            >
                                {error.message || "Ошибка авторизации"}
                            </div>
                        )}

                        <div className="activity-form-actions">
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={isLoading}
                            >
                                {isLoading ? "Входим..." : "Войти"}
                            </button>
                        </div>
                    </form>
                    
                    <div className="auth-link-container">
                        Нет аккаунта?{" "}
                        <a href="/register" className="auth-link">
                            Зарегистрироваться
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Authorization;

