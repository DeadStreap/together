import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../store/UserContext';
import { apiReq, apiReqWithBody } from '../../utils/apiReq';
import { getApiUrl } from '../../config/apiConfig';
import SuggestionCard from '../../components/SuggestionCard';
import { usePageTitle } from '../../hooks/usePageTitle';

function Suggestions() {
    usePageTitle('Предложения');
    const { user, isInitializing, isAuthenticated } = useUser();
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingId, setPendingId] = useState(null);

    useEffect(() => {
        if (isInitializing) return;

        if (!isAuthenticated || !user) {
            setIsLoading(false);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await apiReq(getApiUrl(`/api/suggestions/${user.id}`));
                setSuggestions(data);
            } catch (err) {
                setError(err.message || 'Ошибка при загрузке предложений');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [isAuthenticated, user, isInitializing]);

    const handleAccept = async (id) => {
        try {
            setPendingId(id);
            setError(null);
            await apiReqWithBody(getApiUrl(`/api/accept/suggestion/${id}`), 'PUT', { user_id: user.id });
            setSuggestions((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            setError(err.message || 'Ошибка при принятии предложения');
        } finally {
            setPendingId(null);
        }
    };

    const handleDecline = async (id) => {
        try {
            setPendingId(id);
            setError(null);
            await apiReqWithBody(getApiUrl(`/api/decline/suggestion/${id}`), 'DELETE', { user_id: user.id });
            setSuggestions((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            setError(err.message || 'Ошибка при отклонении предложения');
        } finally {
            setPendingId(null);
        }
    };

    const incoming = suggestions.filter((s) => parseInt(s.suggested_to) === user?.id);
    const outgoing = suggestions.filter((s) => parseInt(s.suggested_by) === user?.id);

    if (isLoading) {
        return <div className="loading">Загрузка предложений...</div>;
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="tasks-container">
                <div className="empty-state">
                    <div className="empty-state-title">Авторизуйтесь</div>
                    <p>Чтобы видеть предложения, войдите в аккаунт</p>
                    <Link to="/authorization" className="primary-button" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 12 }}>
                        Войти
                    </Link>
                </div>
            </div>
        );
    }

    if (!user.partner_id) {
        return (
            <div className="tasks-container">
                <div className="empty-state">
                    <div className="empty-state-title">Нужно быть в паре</div>
                    <p>Чтобы предлагать активности, объединитесь с партнёром</p>
                    <Link to="/profile" className="primary-button" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 12 }}>
                        Перейти к профилю
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="tasks-container">
            {error && (
                <div className="error-message" style={{ marginBottom: 12 }}>
                    {error}
                </div>
            )}
            <div className="suggestions-header">
                <h1>Предложения</h1>
                <Link to="/suggestions/create" className="primary-button" style={{ textDecoration: 'none' }}>
                    + Предложить
                </Link>
            </div>

            {incoming.length === 0 && outgoing.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-title">Нет предложений</div>
                    <p>Предложите партнёру активность!</p>
                </div>
            ) : (
                <>
                    {incoming.length > 0 && (
                        <div className="suggestions-section">
                            <div className="suggestions-section-title">Входящие предложения</div>
                            <div className="suggestions-list">
                                {incoming.map((s) => (
                                    <SuggestionCard
                                        key={s.id}
                                        suggestion={s}
                                        mode="incoming"
                                        isPending={pendingId === s.id}
                                        onAccept={handleAccept}
                                        onDecline={handleDecline}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {outgoing.length > 0 && (
                        <div className="suggestions-section">
                            <div className="suggestions-section-title">Мои предложения</div>
                            <div className="suggestions-list">
                                {outgoing.map((s) => (
                                    <SuggestionCard
                                        key={s.id}
                                        suggestion={s}
                                        mode="outgoing"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Suggestions;
