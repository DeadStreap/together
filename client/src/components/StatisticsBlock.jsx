import { useState, useEffect, useMemo } from "react";
import { useUser } from "../store/UserContext";
import { apiReq } from '../utils/apiReq';
import { getApiUrl } from '../config/apiConfig';

const EMPTY_STATS = {
    gamesCompletedTogether: 0,
    watchedTogether: 0,
    activitiesInProgress: 0,
    activitiesPlanned: 0,
    totalCompleted: 0,
    completionRate: 0,
    completedThisMonth: 0
};

const STAT_LABELS = {
    gamesCompletedTogether: "Игр пройдено вместе",
    watchedTogether: "Просмотрено вместе",
    activitiesInProgress: "В процессе",
    activitiesPlanned: "Запланировано",
    totalCompleted: "Всего завершено",
    completionRate: "% завершённых"
};

const countCompletedThisMonth = (data) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return data.filter(item => {
        if (item.status !== 'done') return false;
        if (!item.end_date) return false;
        
        const endDate = new Date(item.end_date);
        return endDate.getFullYear() === currentYear &&
               endDate.getMonth() === currentMonth;
    }).length;
};

const StatisticsBlock = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(EMPTY_STATS);

    const { user, isInitializing, isAuthenticated } = useUser();

    const API_URL = useMemo(() => {
        if (!isAuthenticated || !user) return null;
        const userId = user.id;
        const partnerId = user.partner_id;
        if (!partnerId) return null;
        return getApiUrl(`/api/contents/together/${userId}/${partnerId}`);
    }, [isAuthenticated, user, isInitializing]);

    const monthLabel = useMemo(() => {
        return new Date().toLocaleDateString('ru-RU', { month: 'long' });
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);

                if (isInitializing) {
                    return;
                }

                if (!API_URL) {
                    setStats(EMPTY_STATS);
                    return;
                }

                const data = await apiReq(API_URL);

                const totalCompleted = data.filter(
                    item => item.status === 'done'
                ).length;

                const totalCount = data.length;
                const completionRate = totalCount > 0
                    ? Math.round((totalCompleted / totalCount) * 100)
                    : 0;

                setStats({
                    gamesCompletedTogether: data.filter(
                        item => item.category === 'game' && item.status === 'done'
                    ).length,
                    watchedTogether: data.filter(
                        item => ['anime', 'film', 'serial'].includes(item.category) && item.status === 'done'
                    ).length,
                    activitiesInProgress: data.filter(
                        item => item.status === 'inProgress'
                    ).length,
                    activitiesPlanned: data.filter(
                        item => item.status === 'planned'
                    ).length,
                    totalCompleted,
                    completionRate,
                    completedThisMonth: countCompletedThisMonth(data)
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats(EMPTY_STATS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [API_URL, isInitializing]);

    const renderStatItem = (value, label) => (
        <div className="stat-item">
            <div className="stat-value">{isLoading ? "—" : value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );

    return (
        <div className="statistics-block">
            {renderStatItem(stats.gamesCompletedTogether, STAT_LABELS.gamesCompletedTogether)}
            {renderStatItem(stats.watchedTogether, STAT_LABELS.watchedTogether)}
            {renderStatItem(stats.totalCompleted, STAT_LABELS.totalCompleted)}
            {renderStatItem(`${stats.completionRate}%`, STAT_LABELS.completionRate)}
            {renderStatItem(stats.completedThisMonth, `Завершено за ${monthLabel}`)}
            {renderStatItem(stats.activitiesInProgress, STAT_LABELS.activitiesInProgress)}
            {renderStatItem(stats.activitiesPlanned, STAT_LABELS.activitiesPlanned)}
        </div>
    );
};

export default StatisticsBlock;
