import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as styles from "../../styles/style";

import { apiReq } from "../../utils/apiReq";

function ActivitiesParnter() {
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userId } = useParams();

    const API = "together-alpha-one.vercel.app";
    const API_URL = `https://${API}/api/contents`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await apiReq(API_URL);

                const partnerId = Number(userId);

                const filteredData = data.filter(
                    (item) =>
                        item.shared_with_partner == false &&
                        item.added_by_user_id == partnerId
                );
                setContentItems(filteredData);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [userId]);

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
            <h1>Одиночные активности партнёра ({contentItems.length})</h1>

            {contentItems.length > 0 ? (
                <ul className="content-list">
                    {contentItems.map((item) => (
                        <li key={item.id} className="content-card">
                            <Link
                                to={`/activity/${item.id}`}
                                className="content-card-link"
                            >
                                <div className="item-title">
                                    {item.title || "Без названия"}
                                </div>
                                <div className="item-details">
                                    <span>Категория</span>:{" "}
                                    {item.category || "N/A"}
                                </div>
                                <div className="item-details">
                                    <span>Создал</span>:{" "}
                                    {item.added_by_user_id || "N/A"}
                                </div>
                                <div className="item-dates">
                                    <span>
                                        <span>Добавлено</span>
                                        <span>
                                            {item.added_at
                                                ? (() => {
                                                      const date = new Date(
                                                          item.added_at
                                                      );
                                                      const formattedDate =
                                                          date.toLocaleDateString(
                                                              "ru-RU",
                                                              {
                                                                  day: "2-digit",
                                                                  month: "long",
                                                                  year: "numeric",
                                                              }
                                                          );
                                                      const formattedTime =
                                                          date.toLocaleTimeString(
                                                              "ru-RU",
                                                              {
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                              }
                                                          );
                                                      return `${formattedDate} ${formattedTime}`;
                                                  })()
                                                : "не указано"}
                                        </span>
                                    </span>
                                    <span>
                                        <span>Начало</span>
                                        <span>
                                            {item.start_date
                                                ? new Date(
                                                      item.start_date
                                                  ).toLocaleDateString()
                                                : "не указано"}
                                        </span>
                                    </span>
                                    <span>
                                        <span>Конец</span>
                                        <span>
                                            {item.end_date
                                                ? new Date(
                                                      item.end_date
                                                  ).toLocaleDateString()
                                                : "не указано"}
                                        </span>
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <p>У партнёра пока нет одиночных активностей.</p>
                </>
            )}
        </div>
    );
}

export default ActivitiesParnter;

