import { useState, useEffect } from 'react';

const useFilterSort = (initialItems) => {
    const [filters, setFilters] = useState({
        category: '',
        startDate: '',
        endDate: '',
        status: '',
        search: ''
    });

    const [sortConfig, setSortConfig] = useState({
        key: 'added_at',
        direction: 'desc',
        isUserSelected: false  // указывает, что сортировка выбрана пользователем
    });

    const [filteredContent, setFilteredContent] = useState([]);

    useEffect(() => {
        let result = [...initialItems];

        if (filters.category) {
            result = result.filter(item =>
                item.category && item.category.toLowerCase() === filters.category.toLowerCase()
            );
        }

        if (filters.status) {
            result = result.filter(item =>
                item.status && item.status === filters.status
            );
        }

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            result = result.filter(item => {
                if (!item.start_date) return false;
                return new Date(item.start_date) >= startDate;
            });
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            result = result.filter(item => {
                if (!item.end_date) return false;
                return new Date(item.end_date) <= endDate;
            });
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(item =>
                item.title && item.title.toLowerCase().includes(searchLower)
            );
        }

        // Если есть пользовательская сортировка (выбранная пользователем), применяем её
        if (sortConfig.key && sortConfig.direction && sortConfig.isUserSelected) {
            result.sort((a, b) => {
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
        } else {
            // Если нет пользовательской сортировки или используется дефолтная, сортируем по умолчанию по дате добавления (по убыванию)
            result.sort((a, b) => {
                const dateA = a['added_at'] ? new Date(a['added_at']).getTime() : 0;
                const dateB = b['added_at'] ? new Date(b['added_at']).getTime() : 0;

                if (dateA < dateB) {
                    return 1; // по убыванию
                }
                if (dateA > dateB) {
                    return -1; // по убыванию
                }
                return 0;
            });
        }

        setFilteredContent(result);
    }, [initialItems, filters, sortConfig]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleSortChange = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                if (prev.direction === 'asc') {
                    // При переходе от asc к desc
                    return { key, direction: 'desc', isUserSelected: true };
                } else if (prev.direction === 'desc') {
                    if (prev.isUserSelected) {
                        // Если уже выбран пользователем и направление 'desc', то сбрасываем к дефолтной сортировке
                        return { key: 'added_at', direction: 'desc', isUserSelected: false };
                    } else {
                        // Если это дефолтное состояние и нажали на 'Дата', то делаем активным с направлением 'asc'
                        return { key, direction: 'asc', isUserSelected: true };
                    }
                } else {
                    return { key, direction: 'asc', isUserSelected: true };
                }
            } else {
                return { key, direction: 'asc', isUserSelected: true };
            }
        });
    };

    return {
        filters,
        sortConfig,
        filteredContent,
        handleFilterChange,
        handleSortChange,
        totalItemsCount: initialItems.length
    };
};

export default useFilterSort;