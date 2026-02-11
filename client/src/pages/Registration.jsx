import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/UserContext";
import { getApiUrl } from "../config/apiConfig";

function Registration() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmedUsername = username.trim();
        
        if (!trimmedUsername || !password || !confirmPassword) {
            setError(new Error("Заполните все поля"));
            return;
        }

        if (password !== confirmPassword) {
            setError(new Error("Пароли не совпадают"));
            return;
        }

        if (password.length < 6) {
            setError(new Error("Пароль должен содержать не менее 6 символов"));
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(getApiUrl('/api/create/user'), {
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
                if (response.status === 409) {
                    throw new Error("Пользователь с таким логином уже существует");
                }
                throw new Error(
                    (data && data.error) || "Ошибка регистрации"
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
                    <div className="item-title">Регистрация в Together</div>
                    <p
                        style={{
                            fontSize: 13,
                            color: "#6b7280",
                            marginBottom: 10,
                        }}
                    >
                        Создайте аккаунт, чтобы начать использовать приложение.
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

                        <div className="activity-form-field">
                            <label htmlFor="confirmPassword">Подтверждение пароля</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {error.message || "Ошибка регистрации"}
                            </div>
                        )}

                        <div className="activity-form-actions">
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={isLoading}
                            >
                                {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
                            </button>
                        </div>
                    </form>
                    
                    <div className="auth-link-container">
                        Уже есть аккаунт?{" "}
                        <a href="/authorization" className="auth-link">
                            Войти
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;