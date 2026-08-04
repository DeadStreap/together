import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../store/UserContext';
import { apiReq } from '../utils/apiReq';
import { getApiUrl } from '../config/apiConfig';
import CategoryStats from '../components/CategoryStats';
import MonthlyStats from '../components/MonthlyStats';
import StatusStats from '../components/StatusStats';
import CompletionCurve from '../components/CompletionCurve';
import { usePageTitle } from '../hooks/usePageTitle';

function StatsPage() {
    usePageTitle('Статистика');
    const { user, isInitializing, isAuthenticated } = useUser();
    const [categoryData, setCategoryData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [completionCurveData, setCompletionCurveData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (isInitializing) {
                return;
            }

            if (!isAuthenticated || !user || !user.partner_id) {
                setIsLoading(false);
                return;
            }

            try {
                setError(null);
                
                // Параллельная загрузка всех данных через Promise.all
                const [categories, monthly, status, completionCurve] = await Promise.all([
                    apiReq(getApiUrl(`/api/stats/categories/${user.id}/${user.partner_id}`)),
                    apiReq(getApiUrl(`/api/stats/monthly/${user.id}/${user.partner_id}?months=12`)),
                    apiReq(getApiUrl(`/api/stats/status/${user.id}/${user.partner_id}`)),
                    apiReq(getApiUrl(`/api/stats/completion-curve/${user.id}/${user.partner_id}`))
                ]);

                setCategoryData(categories);
                setMonthlyData(monthly);
                setStatusData(status);
                setCompletionCurveData(completionCurve);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError(err.message || 'Ошибка при загрузке статистики');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [isAuthenticated, user, isInitializing]);

    const renderContent = () => {
        if (!isAuthenticated || !user) {
            return (
                <div className="stats-auth-required">
                    <p>Войдите в систему, чтобы увидеть статистику вашей пары</p>
                    <Link to="/authorization" className="primary-button">Войти</Link>
                </div>
            );
        }

        if (!user.partner_id) {
            return (
                <div className="stats-no-partner">
                    <p>Статистика доступна только для пар</p>
                    <p className="stats-hint">Объединитесь с партнёром, чтобы отслеживать прогресс вместе</p>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="stats-loading">
                    <div className="loading-spinner"></div>
                    <p>Загрузка статистики...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="stats-error">
                    <p>Ошибка: {error}</p>
                </div>
            );
        }

        const hasAnyData = (categoryData && categoryData.length > 0) || (statusData && (statusData.planned > 0 || statusData.inProgress > 0 || statusData.done > 0));

        if (!hasAnyData) {
            return (
                <div className="stats-empty-main">
                    <div className="stats-empty-icon">📈</div>
                    <h2>Пока нет данных</h2>
                    <p>Добавьте ваши совместные активности, чтобы увидеть красивую статистику</p>
                    <Link to="/activity/create" className="primary-button">Добавить активность</Link>
                </div>
            );
        }

        return (
            <div className="stats-grid">
                <div className="stats-card full-width">
                    <CategoryStats data={categoryData} />
                </div>

                <div className="stats-card full-width">
                    <StatusStats data={statusData} />
                </div>

                <div className="stats-card full-width">
                    <MonthlyStats data={monthlyData} />
                </div>

                <div className="stats-card full-width">
                    <CompletionCurve data={completionCurveData} />
                </div>
            </div>
        );
    };

    return (
        <div className="stats-page">
            <h1>Статистика</h1>
            {renderContent()}
        </div>
    );
}

export default StatsPage;
