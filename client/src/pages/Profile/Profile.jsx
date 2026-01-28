import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { apiReq } from "../../utils/apiReq";

function Profile() {
    const API = "together-alpha-one.vercel.app";
    const API_URL = `https://${API}/api/user/id/1`;
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [partner, setPartner] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await apiReq(API_URL);
                setUser(data);
                if (data.partner_id) {
                    getPartner(data.partner_id);
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getPartner = async (partner_id) => {
        try {
            setIsLoading(true);
            const data = await apiReq(
                `https://${API}/api/user/id/${partner_id}`
            );
            setPartner(data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !user) {
        return <div className="loading">Загрузка контента...</div>;
    }

    if (error) {
        return (
            <div className="error">
                Ошибка: {error.message || "Неизвестная ошибка"}
            </div>
        );
    }

    const initials = user.username
        ? user.username
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
        : "?";

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-main">
                        <div className="profile-avatar">{initials}</div>
                        <div className="profile-name-block">
                            <div className="profile-name">
                                {user.username || "Без имени"}
                            </div>
                            <div className="profile-tagline">
                                Личная страничка для совместных активностей
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-badges">
                    <div className="profile-badge">
                        <div className="profile-badge-label">
                            <span className="profile-badge-dot" />
                            <span>Статус пары</span>
                        </div>
                        <div
                            className={
                                "profile-badge-value" +
                                (!partner ? " muted" : "")
                            }
                        >
                            {partner
                                ? `В паре с ${partner.username} 🖤`
                                : "Партнёр пока не привязан"}
                        </div>
                    </div>

                    <div className="profile-badge">
                        <div className="profile-badge-label">
                            <span className="profile-badge-dot" />
                            <span>Дата начала отношений</span>
                        </div>
                        <div
                            className={
                                "profile-badge-value" +
                                (!user.couple_start_date ? " muted" : "")
                            }
                        >
                            {user.couple_start_date
                                ? new Date(
                                      user.couple_start_date
                                  ).toLocaleDateString("ru-RU", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                  })
                                : "Не указана"}
                        </div>
                    </div>
                </div>

                <div className="profile-footer">
                    <Link to="/" className="profile-link-back">
                        ← Вернуться к активностям
                    </Link>
                    <div className="profile-meta">
                        ID пользователя: {user.id}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
