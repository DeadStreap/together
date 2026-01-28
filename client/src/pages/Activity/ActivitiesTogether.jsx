import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as styles from "../../styles/style";

import { apiReq } from "../../utils/apiReq";
import { useUser } from "../../store/UserContext";

function ActivitiesTogether() {
    const [contentItems, setContentItems] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        startDate: '',
        endDate: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: 'added_at',
        direction: 'desc'
    });

    const { user, isAuthenticated } = useUser();

    const API = "together-alpha-one.vercel.app";
    const API_URL = `https://${API}/api/contents`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await apiReq(API_URL);

                if (!isAuthenticated || !user) {
                    setContentItems([]);
                    setIsLoading(false);
                    return;
                }

                const currentId = user.id;
                const partnerId = user.partner_id || null;

                const filteredData = data.filter((item) => {
                    if (!item.shared_with_partner) return false;
                    if (item.added_by_user_id == currentId) return true;
                    if (partnerId && item.added_by_user_id == partnerId)
                        return true;
                    return false;
                });

                setContentItems(filteredData);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, user]);

    useEffect(() => {
        let result = [...contentItems];

        if (filters.category) {
            result = result.filter(item =>
                item.category && item.category.toLowerCase() === filters.category.toLowerCase()
            );
        }

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            result = result.filter(item => {
                const itemDate = item.start_date ? new Date(item.start_date) : new Date(item.added_at);
                return itemDate >= startDate;
            });
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999); // End of the day
            result = result.filter(item => {
                const itemDate = item.end_date ? new Date(item.end_date) : item.start_date ? new Date(item.start_date) : new Date(item.added_at);
                return itemDate <= endDate;
            });
        }

        // Apply sorting only if sortConfig.key is not null
        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) => {
                // Handle date fields
                if (sortConfig.key.includes('_date')) {
                    const dateA = a[sortConfig.key] ? new Date(a[sortConfig.key]).getTime() : 0;
                    const dateB = b[sortConfig.key] ? new Date(b[sortConfig.key]).getTime() : 0;

                    if (dateA < dateB) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (dateA > dateB) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                } else {
                    // Handle string fields
                    const valueA = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
                    const valueB = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';

                    if (valueA < valueB) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (valueA > valueB) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }

        setFilteredContent(result);
    }, [contentItems, filters, sortConfig]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleSortChange = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                // Если это та же колонка, переключаем направление
                if (prev.direction === 'asc') {
                    return { key, direction: 'desc' };
                } else if (prev.direction === 'desc') {
                    // Если уже был 'desc', возвращаем к исходному состоянию (без сортировки)
                    return { key: null, direction: null };
                } else {
                    return { key, direction: 'asc' };
                }
            } else {
                // Если новая колонка, начинаем с 'asc'
                return { key, direction: 'asc' };
            }
        });
    };


    const getUniqueCategories = () => {
        const categories = new Set();
        contentItems.forEach(item => {
            if (item.category) {
                categories.add(item.category);
            }
        });
        return Array.from(categories);
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
    return (
        <div className="tasks-container">
            <h1>Совместные активности ({filteredContent.length})</h1>

            {/* Filter and Sort Controls */}
            <div className="filters-container" style={{
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                }}>
                    {/* Category Filter */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            fontSize: '13px',
                            color: '#4b5563'
                        }}>Фильтр по категории:</label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 30px 10px 12px',
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb',
                                fontSize: '14px',
                                backgroundColor: '#ffffff',
                                color: '#4b5563',
                                appearance: 'none',
                                '-webkit-appearance': 'none',
                                '-moz-appearance': 'none',
                                backgroundImage: `
                                    linear-gradient(45deg, transparent 50%, #9ca3af 50%),
                                    linear-gradient(135deg, #9ca3af 50%, transparent 50%)
                                `,
                                backgroundPosition: 'calc(100% - 18px) 50%, calc(100% - 13px) 50%',
                                backgroundSize: '6px 6px, 6px 6px',
                                backgroundRepeat: 'no-repeat',
                                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#7a55ff';
                                e.target.style.boxShadow = '0 0 0 1px rgba(122, 85, 255, 0.25)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <option value="">Все категории</option>
                            <option value="game">Game</option>
                            <option value="anime">Anime</option>
                            <option value="film">Film</option>
                            <option value="serial">Serial</option>
                        </select>
                    </div>

                    {/* Start Date Filter */}
                    <div>
                        <label htmlFor="start-date-filter" style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            fontSize: '13px',
                            color: '#4b5563'
                        }}>Дата начала от:</label>
                        <input
                            id="start-date-filter"
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb',
                                fontSize: '14px',
                                backgroundColor: '#ffffff',
                                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#7a55ff';
                                e.target.style.boxShadow = '0 0 0 1px rgba(122, 85, 255, 0.25)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* End Date Filter */}
                    <div>
                        <label htmlFor="end-date-filter" style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            fontSize: '13px',
                            color: '#4b5563'
                        }}>Дата окончания до:</label>
                        <input
                            id="end-date-filter"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb',
                                fontSize: '14px',
                                backgroundColor: '#ffffff',
                                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#7a55ff';
                                e.target.style.boxShadow = '0 0 0 1px rgba(122, 85, 255, 0.25)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Sort Buttons */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                        <button
                            onClick={() => handleSortChange('added_at')}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: sortConfig.key === 'added_at' ? '#f4f4ff' : '#ffffff',
                                color: sortConfig.key === 'added_at' ? '#7a55ff' : '#4b5563',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: sortConfig.key === 'added_at' ? '600' : 'normal'
                            }}
                            onMouseEnter={(e) => {
                                if (sortConfig.key !== 'added_at') {
                                    e.target.style.backgroundColor = '#f4f4ff';
                                    e.target.style.borderColor = '#c7d2fe';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sortConfig.key !== 'added_at') {
                                    e.target.style.backgroundColor = '#ffffff';
                                    e.target.style.borderColor = '#e5e7eb';
                                }
                            }}
                        >
                            Дата {sortConfig.key === 'added_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSortChange('title')}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: sortConfig.key === 'title' ? '#f4f4ff' : '#ffffff',
                                color: sortConfig.key === 'title' ? '#7a55ff' : '#4b5563',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: sortConfig.key === 'title' ? '600' : 'normal'
                            }}
                            onMouseEnter={(e) => {
                                if (sortConfig.key !== 'title') {
                                    e.target.style.backgroundColor = '#f4f4ff';
                                    e.target.style.borderColor = '#c7d2fe';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sortConfig.key !== 'title') {
                                    e.target.style.backgroundColor = '#ffffff';
                                    e.target.style.borderColor = '#e5e7eb';
                                }
                            }}
                        >
                            Название {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
                </div>
            </div>

            {!isAuthenticated || !user ? (
                <p>
                    Чтобы увидеть совместные активности, нужно авторизоваться и
                    быть в паре.
                </p>
            ) : null}

            {filteredContent.length > 0 ? (
                <ul className="content-list">
                    {filteredContent.map((item) => (
                        <li key={item.id} className="content-card">
                            <Link to={`/activity/${item.id}`} className="content-card-link">
                                <div className="item-title">
                                    {item.title || "Без названия"}
                                </div>
                                <div className="item-details">
                                    <span>Категория</span>: {item.category || "N/A"}
                                </div>
                                <div className="item-details">
                                    <span>Создал</span>: {item.added_by_user_id || "N/A"}
                                </div>
                                <div className="item-dates">
                                    <span>
                                        <span>Добавлено</span>
                                        <span>
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
                                    </span>
                                    <span>
                                        <span>Начало</span>
                                        <span>
                                            {item.start_date
                                                ? new Date(item.start_date).toLocaleDateString()
                                                : "не указано"}
                                        </span>
                                    </span>
                                    <span>
                                        <span>Конец</span>
                                        <span>
                                            {item.end_date
                                                ? new Date(item.end_date).toLocaleDateString()
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
                <p>Не добавленно ни одной активности или нет совпадений по фильтрам</p>
                <p>Добавить?</p>
                </>
            )}
        </div>
    );
}

export default ActivitiesTogether;
