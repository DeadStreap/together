import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import * as styles from '../../styles/style';

import { apiReq } from '../../utils/apiReq'

function ActivitiesAlone() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const URL = "localhost:3001";
    const API = "together-alpha-one.vercel.app";
    const API_URL = `https://${API}/api/contents`;

    useEffect(() => {
        const fetchData = async () => {
                    try {
                        setIsLoading(true);
                        const data = await apiReq(API_URL);
                        const filteredData = data.filter(item => item.shared_with_partner == false);
                        setContentItems(filteredData);
                    } catch (error) {
                        setError(error.message);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchData();
    }, []);

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
    return (
        <div className="tasks-container">
            <h1>Доступный контент ({contentItems.length})</h1>

            {contentItems.length > 0 ? (
                <ul className="content-list">
                    {contentItems.map((item) => (
                        <div key={item.id} style={styles.contentItem}>
                            <Link to={`/activity/${item.id}`} style={{color: '#fff'}}>
                            <div className="item-title">
                                <strong>{item.title || "Без названия"}</strong>
                            </div>
                            <div className="item-details">
                                Категория: {item.category || "N/A"}
                            </div>
                            <div className="item-details">
                                Created by: {item.added_by_user_id || "N/A"}
                            </div>
                            <div className="item-dates">
                                <span>
                                Добавлено:{" "}
                                    {item.added_at
                                        ? (() => {
                                            const date = new Date(item.added_at);
                                            const formattedDate = date.toLocaleDateString('ru-RU', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            });
                                            const formattedTime = date.toLocaleTimeString('ru-RU', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            });
                                            return `${formattedDate} ${formattedTime}`;
                                        })()
                                        : "не указано"}
                                </span>
                                <br></br>
                                <span>
                                    Начало:{" "}
                                    {item.start_date
                                        ? new Date(item.start_date).toLocaleDateString()
                                        : "не указанно"}
                                </span>
                                <br></br>
                                <span>
                                    Конец:{" "}
                                    {item.end_date
                                        ? new Date(item.end_date).toLocaleDateString()
                                        : "не указанно"}
                                </span>
                            </div>
                            </Link>
                        </div>
                    ))}
                </ul>
            ) : (
                <>
                <p>Не добавленно ни одной активности</p>
                <p>Добавить?</p>
                </>
            )}
        </div>
    );
}

export default ActivitiesAlone;
