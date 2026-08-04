import StatusIcon from './StatusIcon';

const FilterSortControls = ({ filters, onFilterChange, onSortChange, sortConfig }) => {
    const statusButtons = [
        { status: 'done', label: 'Завершено' },
        { status: 'inProgress', label: 'В процессе' },
        { status: 'planned', label: 'Запланировано' },
    ];

    return (
        <div className="filters-container">
            <div className="filter-grid">
                <div>
                    <label htmlFor="category-filter" className="filter-label">Фильтр по категории:</label>
                    <select
                        id="category-filter"
                        value={filters.category}
                        onChange={(e) => onFilterChange('category', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Все категории</option>
                        <option value="game">Игры</option>
                        <option value="anime">Аниме</option>
                        <option value="film">Фильмы</option>
                        <option value="serial">Сериалы</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="start-date-filter" className="filter-label">Дата начала от:</label>
                    <div className="date-input-wrapper">
                        <input
                            id="start-date-filter"
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => onFilterChange('startDate', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="end-date-filter" className="filter-label">Дата окончания до:</label>
                    <div className="date-input-wrapper">
                        <input
                            id="end-date-filter"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => onFilterChange('endDate', e.target.value)}
                        />
                    </div>
                </div>

                <div className="sort-buttons-container">
                    <button
                        onClick={() => onSortChange('added_at')}
                        className={`sort-button ${(sortConfig.key === 'added_at' && sortConfig.isUserSelected) ? 'sort-button-active' : ''}`}
                        aria-pressed={sortConfig.key === 'added_at' && sortConfig.isUserSelected}
                    >
                        Дата {(sortConfig.key === 'added_at' && sortConfig.isUserSelected) && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                        onClick={() => onSortChange('title')}
                        className={`sort-button ${(sortConfig.key === 'title' && sortConfig.isUserSelected) ? 'sort-button-active' : ''}`}
                        aria-pressed={sortConfig.key === 'title' && sortConfig.isUserSelected}
                    >
                        Название {(sortConfig.key === 'title' && sortConfig.isUserSelected) && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </button>
                </div>

                <div className="status-filter-buttons-container" role="group" aria-label="Фильтр по статусу">
                    {statusButtons.map(({ status, label }) => (
                        <button
                            key={status}
                            onClick={() => onFilterChange('status', filters.status === status ? '' : status)}
                            className={`sort-button ${filters.status === status ? 'sort-button-active' : ''}`}
                            aria-label={`Фильтр: ${label}`}
                            aria-pressed={filters.status === status}
                        >
                            <StatusIcon status={status} />
                        </button>
                    ))}
                </div>

                <div className="search-container">
                    <label htmlFor="search-input" className="filter-search-label">Поиск по названию</label>
                    <input
                        id="search-input"
                        type="text"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                        placeholder="Поиск"
                        className="filter-search-input"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterSortControls;
