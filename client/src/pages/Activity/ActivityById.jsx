import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getApiUrl } from '../../config/apiConfig';
import { useUser } from "../../store/UserContext";
import { getCategoryDisplayName, getStatusDisplayName } from '../../utils/displayMappings';
import StatusIcon from '../../components/StatusIcon';
import { apiReq, apiReqWithBody } from '../../utils/apiReq';
import { formatDateTime, formatDate } from '../../utils/dateFormat';
import { getDaysInStatus, formatDaysWord } from '../../utils/daysInStatus';

function ActivityById() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { user } = useUser();

    const params = useParams();
    const navigate = useNavigate();
    const ActivityId = params.ActivityId;

    const API_URL = getApiUrl(`/api/content/id/${ActivityId}`);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const data = await apiReq(API_URL);
                if (!Array.isArray(data)) {
                    throw new Error("Некорректный формат данных от API");
                }
                setContentItems(data);
            } catch (err) {
                console.error("Ошибка при получении данных:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivity();
    }, []);

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            setError(null);

            await apiReqWithBody(getApiUrl('/api/delete/content'), 'DELETE', { id: ActivityId });

            navigate("/");
        } catch (err) {
            console.error("Ошибка при удалении активности:", err);
            setError(err);
            setIsLoading(false);
        }
    };

    const handleComplete = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const today = new Date().toISOString().split('T')[0];

            await apiReqWithBody(getApiUrl('/api/update/content'), 'PUT', {
                id: ActivityId,
                status: 'done',
                end_date: today
            });

            setContentItems(prev => prev.map(item => ({
                ...item,
                status: 'done',
                end_date: today
            })));
        } catch (err) {
            console.error("Ошибка при завершении активности:", err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartProgress = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const today = new Date().toISOString().split('T')[0];

            await apiReqWithBody(getApiUrl('/api/update/content'), 'PUT', {
                id: ActivityId,
                status: 'inProgress',
                start_date: today
            });

            setContentItems(prev => prev.map(item => ({
                ...item,
                status: 'inProgress',
                start_date: today
            })));
        } catch (err) {
            console.error("Ошибка при начале активности:", err);
            setError(err);
        } finally {
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
                            {(user.id == item.added_by_user_id || user.partner_id == item.added_by_user_id) && (
                                <>
                                    <div style={{ display: "flex", gap: 4 }}>
                                        {item.status === 'inProgress' && (
                                            <button
                                                type="button"
                                                onClick={handleComplete}
                                                disabled={isLoading}
                                                className="icon-button-complete"
                                                title="Завершить активность"
                                            >
                                                <img src="/done.svg" alt="Завершить" />
                                            </button>
                                        )}
                                        {item.status === 'planned' && (
                                            <button
                                                type="button"
                                                onClick={handleStartProgress}
                                                disabled={isLoading}
                                                className="icon-button-progress"
                                                title="Начать активность"
                                            >
                                                <img src="/clock.svg" alt="В процессе" />
                                            </button>
                                        )}
                                        <Link
                                            to={`/activity/${ActivityId}/edit`}
                                            className="icon-button-edit"
                                        >
                                            <img src="/edit.svg" alt="Edit" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
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
                            )}
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
                        {item.status === 'inProgress' && (<>
                                {' '}({formatDaysWord(getDaysInStatus(item.start_date, item.status))})
                            </>
                        )}
                    </div>

                    <div className="item-dates">
                        <span>
                            <span>Добавлено</span>
                            <span>{formatDateTime(item.added_at)}</span>
                        </span>
                        <span>
                            <span>Начало</span>
                            <span>{formatDate(item.start_date)}</span>
                        </span>
                        <span>
                            <span>Конец</span>
                            <span>{formatDate(item.end_date)}</span>
                        </span>
                    </div>

                </div>
            </div>

            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">Удалить активность?</div>
                        </div>
                        <div className="modal-body">
                            <p className="modal-text">
                                {item.title}
                            </p>
                            <p className="modal-subtext">
                                Это действие нельзя отменить
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="secondary-button"
                                disabled={isLoading}
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="primary-button danger-button"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ActivityById;
