const CATEGORY_NAMES = {
    anime: 'Аниме',
    game: 'Игры',
    film: 'Фильмы',
    serial: 'Сериалы'
};

const CATEGORY_COLORS = {
    anime: '#7a55ff',
    game: '#4ade80',
    film: '#f97316',
    serial: '#3b82f6'
};

const CompletionRateStats = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="stats-empty">
                <p>Нет данных для отображения</p>
            </div>
        );
    }

    return (
        <div className="stats-card-content">
            <h3 className="stats-card-title">% завершённых по категориям</h3>

            <div className="completion-stats-details">
                {data.map(item => {
                    const rate = parseFloat(item.completion_rate);
                    return (
                        <div key={item.category} className="completion-stat-row">
                            <div className="completion-stat-left">
                                <span className="completion-stat-category">
                                    {CATEGORY_NAMES[item.category] || item.category}
                                </span>
                            </div>
                            <div className="completion-stat-progress">
                                <div className="completion-stat-bar">
                                    <div
                                        className="completion-stat-fill"
                                        style={{
                                            width: `${rate}%`,
                                            backgroundColor: CATEGORY_COLORS[item.category] || '#999'
                                        }}
                                    />
                                </div>
                                <span className="completion-stat-percent">
                                    {rate}%
                                </span>
                            </div>
                            <div className="completion-stat-values">
                                <span className="completion-stat-completed">{item.completed}</span>
                                <span className="completion-stat-total">/{item.total}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CompletionRateStats;
