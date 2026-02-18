import { useState, useEffect, useMemo } from "react";
import { useUser } from "../store/UserContext";
import { apiReq } from '../utils/apiReq';
import { getApiUrl } from '../config/apiConfig';

const EMPTY_STATS = {
    gamesCompletedTogether: 0,
    watchedTogether: 0,
    activitiesInProgress: 0,
    activitiesPlanned: 0
};

const STAT_LABELS = {
    gamesCompletedTogether: "Игр пройдено вместе",
    watchedTogether: "Просмотрено вместе",
    activitiesInProgress: "В процессе",
    activitiesPlanned: "Запланировано"
};

const StatisticsBlock = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(EMPTY_STATS);

    const { user, isAuthenticated } = useUser();

    const API_URL = useMemo(() => {
        if (!isAuthenticated || !user) return null;
        const userId = user.id;
        const partnerId = user.partner_id;
        if (!partnerId) return null;
        return getApiUrl(`/api/contents/together/${userId}/${partnerId}`);
    }, [isAuthenticated, user]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);

                if (!API_URL) {
                    setStats(EMPTY_STATS);
                    return;
                }

                const data = await apiReq(API_URL);

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
                    ).length
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats(EMPTY_STATS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [API_URL]);

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
            {renderStatItem(stats.activitiesInProgress, STAT_LABELS.activitiesInProgress)}
            {renderStatItem(stats.activitiesPlanned, STAT_LABELS.activitiesPlanned)}
        </div>
    );
};

export default StatisticsBlock;
