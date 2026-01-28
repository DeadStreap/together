import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiReq } from "../../utils/apiReq";
import { useUser } from "../../store/UserContext";

function Profile() {
    const { user, isAuthenticated, logout } = useUser();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [partner, setPartner] = useState(null);
    const navigate = useNavigate();
    const params = useParams();

    const API = "together-alpha-one.vercel.app";
    const requestedId = params.userId ? Number(params.userId) : null;

    useEffect(() => {
        const fetchPartner = async () => {
            if (!user || !user.partner_id) return;
            try {
                setIsLoading(true);
                const data = await apiReq(
                    `https://${API}/api/user/id/${user.partner_id}`
                );
                setPartner(data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartner();
    }, [user]);

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        if (!requestedId) return; // /profile без id всегда ок

        if (requestedId === user.id) return;

        if (!user.partner_id) {
            navigate("/profile", { replace: true });
            return;
        }

        if (partner && requestedId !== partner.id) {
            navigate("/profile", { replace: true });
        }
    }, [requestedId, user, partner, isAuthenticated, navigate]);

    if (!isAuthenticated || !user) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <div className="item-title">Профиль</div>
                    <p
                        style={{
                            fontSize: 13,
                            color: "#6b7280",
                            marginBottom: 12,
                        }}
                    >
                        Чтобы увидеть информацию о профиле, войдите в аккаунт.
                    </p>
                    <div className="profile-footer">
                        <Link to="/authorization" className="profile-link-back">
                            Войти
                        </Link>
                        <div className="profile-meta">Гость</div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="loading">Загрузка профиля...</div>;
    }

    if (error) {
        return (
            <div className="error">
                Ошибка: {error.message || "Неизвестная ошибка"}
            </div>
        );
    }

    const viewedUser =
        !requestedId || requestedId === user.id
            ? user
            : partner && requestedId === partner.id
            ? partner
            : user;

    const initials = viewedUser.username
        ? viewedUser.username
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
        : "?";

    const handleLogout = () => {
        logout();
        navigate("/authorization");
    };

    const hasCoupleStart = !!user.couple_start_date;
    let daysTogether = null;
    if (hasCoupleStart) {
        const start = new Date(user.couple_start_date);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        daysTogether = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    }

    const isViewingPartner =
        !!requestedId && partner && requestedId === partner.id;

    let pairStatusText = "Партнёр пока не привязан";
    if (partner) {
        pairStatusText = isViewingPartner
            ? `В паре с ${user.username} 🖤`
            : `В паре с ${partner.username} 🖤`;
    }

    const statusTargetId = partner
        ? isViewingPartner
            ? user.id
            : partner.id
        : null;

    const handleStatusClick = () => {
        if (!statusTargetId) return;
        if (statusTargetId === user.id) {
            navigate("/profile");
        } else {
            navigate(`/profile/${statusTargetId}`);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-main">
                        <div className="profile-avatar">{initials}</div>
                        <div className="profile-name-block">
                            <div className="profile-name">
                                {viewedUser.username || "Без имени"}
                            </div>
                            <div className="profile-tagline">
                                Личная страничка для совместных активностей
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-badges">
                    <div
                        className="profile-badge"
                        style={{
                            cursor: partner ? "pointer" : "default",
                        }}
                        onClick={partner ? handleStatusClick : undefined}
                    >
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
                            {pairStatusText}
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

                    {daysTogether !== null && (
                        <div className="profile-badge">
                            <div className="profile-badge-label">
                                <span className="profile-badge-dot" />
                                <span>Уже вместе</span>
                            </div>
                            <div className="profile-badge-value">
                                {daysTogether} дней
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-footer">
                    <Link to="/" className="profile-link-back">
                        ← Вернуться к активностям
                    </Link>
                    <div
                        style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                        {isViewingPartner && (
                            <Link
                                to={`/activity/partner/${viewedUser.id}`}
                                className="profile-link-back"
                                style={{ marginRight: 8 }}
                            >
                                Активности партнёра
                            </Link>
                        )}
                        <div className="profile-meta">
                            ID пользователя: {viewedUser.id}
                        </div>
                        <button
                            type="button"
                            className="primary-button"
                            style={{ paddingInline: 14, fontSize: 12 }}
                            onClick={handleLogout}
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
