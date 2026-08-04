import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiReq } from "../../utils/apiReq";
import { getDaysTogether } from "../../utils/daysTogether";
import { useUser } from "../../store/UserContext";
import { getApiUrl } from "../../config/apiConfig";
import { getColorGradient, getColorShadow } from "../../utils/colorGradients";
import { getColorValueByName } from "../../utils/colorUtils";
import { useCoupleTokens } from "../../hooks/useCoupleTokens";
import { usePageTitle } from "../../hooks/usePageTitle";

function Profile() {
    usePageTitle('Профиль');
    const { user, isInitializing, isAuthenticated, logout, getProfileColor, login } = useUser();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [partner, setPartner] = useState(null);
    const [daysFormat, setDaysFormat] = useState('str')
    const navigate = useNavigate();
    const params = useParams();
    const [profileColor, setProfileColor] = useState(getProfileColor());
    const [profileIcon, setProfileIcon] = useState(user?.icon || '');

    const {
        partnerTokenInput,
        setPartnerTokenInput,
        handleGenerateToken,
        handleTokenRefresh,
        handleJoinCouple
    } = useCoupleTokens(user);

    const API_BASE_URL = getApiUrl('');
    const requestedId = params.userId ? Number(params.userId) : null;

    useEffect(() => {
        const fetchPartner = async () => {
            if (isInitializing) {
                return;
            }
            if (!user || !user.partner_id) return;
            try {
                setIsLoading(true);
                const data = await apiReq(
                    getApiUrl(`/api/user/id/${user.partner_id}`)
                );
                setPartner(data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartner();
    }, [user, isInitializing]);

    useEffect(() => {
        const viewedUser = !requestedId || requestedId === user.id ? user : partner;
        setProfileColor(viewedUser?.color || 'Purple');
        setProfileIcon(viewedUser?.icon || '');
    }, [user, partner, requestedId]);

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        if (!requestedId) return;

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
                        <div className="auth-options-container">
                            <Link to="/authorization" className="profile-link-back">
                                Войти
                            </Link>
                            <span className="auth-option-separator">или</span>
                            <Link to="/register" className="profile-link-back">
                                Зарегистрироваться
                            </Link>
                        </div>
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

    const handleDaysTogetherClick = () => {
        daysFormat == 'str' ? setDaysFormat('days') : setDaysFormat('str')
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-main">
                        <div
                            className="profile-avatar"
                            style={{
                                background: getColorGradient(getColorValueByName(profileColor)),
                                boxShadow: getColorShadow(getColorValueByName(profileColor))
                            }}
                        >
                            {profileIcon ? (
                                <img
                                    src={`/profileIcons/${profileIcon}.png`}
                                    alt={profileIcon}
                                    className="avatar-icon"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <div className="profile-name-block">
                            <div className="profile-name-section">
                                <div className="profile-name">
                                    {viewedUser.username || "Без имени"}
                                </div>
                                {!isViewingPartner && (
                                    <Link
                                        to="/profile/edit"
                                        className="icon-button-edit"
                                        aria-label="Редактировать профиль"
                                    >
                                        <img src="/edit.svg" alt="Редактировать" />
                                    </Link>
                                )}
                            </div>
                            <div className="profile-tagline">
                                Личная страничка для совместных активностей
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-badges">
                    <button
                        type="button"
                        className="profile-badge"
                        disabled={!partner}
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
                    </button>

                    {!partner && (
                        <div className="profile-badge">
                            <div className="profile-badge-label">
                                <span className="profile-badge-dot" />
                                <span>Токен пары</span>
                            </div>
                            <div className="profile-badge-value">
                                {user.token ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "12px" }}>{user.token}</span>
                                        <button 
                                            className="secondary-button token-refresh-button"
                                            onClick={async () => {
                                                try {
                                                    const updatedUser = await handleTokenRefresh();
                                                    login(updatedUser);
                                                } catch (err) {
                                                    setError(err);
                                                }
                                            }}
                                            title="Обновить токен"
                                        >
                                            <img 
                                                src="/update.svg" 
                                                alt="Обновить" 
                                            />
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        className="profile-badge-link"
                                        onClick={async () => {
                                            try {
                                                const updatedUser = await handleGenerateToken();
                                                login(updatedUser);
                                            } catch (err) {
                                                setError(err);
                                            }
                                        }}
                                    >
                                        Сгенерировать токен пары
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {!partner && (
                        <div className="profile-badge">
                            <div className="profile-badge-label">
                                <span className="profile-badge-dot" />
                                <span>Присоединиться к паре</span>
                            </div>
                            <div className="profile-badge-value">
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <input
                                        type="text"
                                        placeholder="Введите токен партнера"
                                        value={partnerTokenInput}
                                        onChange={(e) => setPartnerTokenInput(e.target.value)}
                                        className="activity-form-field couple-token-input"
                                    />
                                    <button
                                        className="couple-join-button"
                                        onClick={async () => {
                                            try {
                                                const updatedUser = await handleJoinCouple();
                                                login(updatedUser);
                                            } catch (err) {
                                                setError(err);
                                            }
                                        }}
                                        title="Присоединиться"
                                    >
                                        <img
                                            src="/done.svg"
                                            alt="Присоединиться"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {partner && (
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
                    )}

                    {user.couple_start_date && partner && (
                    <button
                        type="button"
                        className="profile-badge"
                        onClick={handleDaysTogetherClick}
                        title="Переключить формат счётчика"
                        aria-label={`Уже вместе ${getDaysTogether(user, daysFormat)}. Нажмите, чтобы переключить формат`}
                    >
                        <div className="profile-badge-label">
                            <span className="profile-badge-dot" />
                            <span>Уже вместе</span>
                        </div>
                        <div className="profile-badge-value">
                            {getDaysTogether(user, daysFormat)}
                        </div>
                    </button>
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
