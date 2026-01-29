const FilterSortControls = ({ filters, onFilterChange, onSortChange, sortConfig }) => {
    return (
        <div className="filters-container">
            <div className="filter-grid">
                <div>
                    <label className="filter-label">Фильтр по категории:</label>
                    <select
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
                    <input
                        id="start-date-filter"
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => onFilterChange('startDate', e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div>
                    <label htmlFor="end-date-filter" className="filter-label">Дата окончания до:</label>
                    <input
                        id="end-date-filter"
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => onFilterChange('endDate', e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div className="sort-buttons-container">
                    <button
                        onClick={() => onSortChange('added_at')}
                        className={`sort-button ${(sortConfig.key === 'added_at' && sortConfig.isUserSelected) ? 'sort-button-active' : ''}`}
                    >
                        Дата {(sortConfig.key === 'added_at' && sortConfig.isUserSelected) && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                        onClick={() => onSortChange('title')}
                        className={`sort-button ${(sortConfig.key === 'title' && sortConfig.isUserSelected) ? 'sort-button-active' : ''}`}
                    >
                        Название {(sortConfig.key === 'title' && sortConfig.isUserSelected) && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </button>
                </div>

                <div className="status-filter-buttons-container">
                    <button
                        onClick={() => onFilterChange('status', filters.status === 'done' ? '' : 'done')}
                        className={`sort-button ${filters.status === 'done' ? 'sort-button-active' : ''}`}
                        title="Завершено"
                    >
                        <img
                            src="/done.svg"
                            alt="Завершено"
                            className="status-icon done"
                            style={{ width: '16px', height: '16px' }}
                        />
                    </button>
                    <button
                        onClick={() => onFilterChange('status', filters.status === 'inProgress' ? '' : 'inProgress')}
                        className={`sort-button ${filters.status === 'inProgress' ? 'sort-button-active' : ''}`}
                        title="В процессе"
                    >
                        <img
                            src="/clock.svg"
                            alt="В процессе"
                            className="status-icon in-progress"
                            style={{ width: '16px', height: '16px' }}
                        />
                    </button>
                    <button
                        onClick={() => onFilterChange('status', filters.status === 'planned' ? '' : 'planned')}
                        className={`sort-button ${filters.status === 'planned' ? 'sort-button-active' : ''}`}
                        title="Запланировано"
                    >
                        <img
                            src="/dock.svg"
                            alt="Запланировано"
                            className="status-icon planned"
                            style={{ width: '16px', height: '16px' }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSortControls;