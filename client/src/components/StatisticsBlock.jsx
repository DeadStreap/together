import { useState, useEffect } from "react";
import { useUser } from "../store/UserContext";
import { apiReq } from '../utils/apiReq';
import { getApiUrl } from '../config/apiConfig';

const StatisticsBlock = () => {
    const [stats, setStats] = useState({
        gamesCompletedTogether: 0,
        watchedTogether: 0,
        activitiesInProgress: 0,
        activitiesPlanned : 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const { user, isAuthenticated } = useUser();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);

                if (!isAuthenticated || !user) {
                    setStats({
                        gamesCompletedTogether: 0,
                        watchedTogether: 0,
                        activitiesInProgress: 0,
                        activitiesPlanned : 0
                    });
                    setIsLoading(false);
                    return;
                }

                const userId = user.id;
                const partnerId = user.partner_id || null;

                if (!partnerId) {
                    setStats({
                        gamesCompletedTogether: 0,
                        watchedTogether: 0,
                        activitiesInProgress: 0,
                        activitiesPlanned : 0
                    });
                    setIsLoading(false);
                    return;
                }

                const API_URL = getApiUrl(`/api/contents/together/${userId}/${partnerId}`);
                const data = await apiReq(API_URL);

                const gamesCompletedTogether = data.filter(
                    item => item.category === 'game' && item.status === 'done'
                ).length;

                const watchedTogether = data.filter(
                    item => (item.category === 'anime' || item.category === 'film' || item.category === 'serial') && item.status === 'done'
                ).length;

                const activitiesInProgress = data.filter(
                    item => item.status === 'inProgress'
                ).length;

                const activitiesPlanned = data.filter(
                    item => item.status === 'planned'
                ).length;

                setStats({
                    gamesCompletedTogether,
                    watchedTogether,
                    activitiesInProgress,
                    activitiesPlanned
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats({
                    gamesCompletedTogether: 0,
                    watchedTogether: 0,
                    activitiesInProgress: 0,
                    activitiesPlanned: 0
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [isAuthenticated, user]);

    if (isLoading) {
        return (
            <div className="statistics-block">
                <div className="stat-item">
                    <div className="stat-value">—</div>
                    <div className="stat-label">Игр пройдено вместе</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">—</div>
                    <div className="stat-label">Просмотренно вместе</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">—</div>
                    <div className="stat-label">В процессе</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">—</div>
                    <div className="stat-label">Запланировано</div>
                </div>
            </div>
        );
    }

    return (
        <div className="statistics-block">
            <div className="stat-item">
                <div className="stat-value">{stats.gamesCompletedTogether}</div>
                <div className="stat-label">Игр пройдено вместе</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{stats.watchedTogether}</div>
                <div className="stat-label">Просмотренно вместе</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{stats.activitiesInProgress}</div>
                <div className="stat-label">В процессе</div>
            </div>
            <div className="stat-item">
                <div className="stat-value">{stats.activitiesPlanned}</div>
                <div className="stat-label">Запланировано</div>
            </div>
        </div>
    );
};

export default StatisticsBlock;