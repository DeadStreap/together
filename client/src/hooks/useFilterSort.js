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

        if (sortConfig.key && sortConfig.direction && sortConfig.isUserSelected) {
            const dir = sortConfig.direction === 'asc' ? 1 : -1;
            result.sort((a, b) => {
                const va = a[sortConfig.key], vb = b[sortConfig.key];
                if (sortConfig.key.includes('_date')) {
                    const da = va ? new Date(va).getTime() : 0;
                    const db = vb ? new Date(vb).getTime() : 0;
                    return (da - db) * dir;
                }
                const sa = va ? String(va).toLowerCase() : '';
                const sb = vb ? String(vb).toLowerCase() : '';
                return sa < sb ? -dir : sa > sb ? dir : 0;
            });
        } else {
            result.sort((a, b) =>
                (b['added_at'] ? new Date(b['added_at']).getTime() : 0) -
                (a['added_at'] ? new Date(a['added_at']).getTime() : 0)
            );
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