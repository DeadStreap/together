import { Pie } from '@nivo/pie';
import { useTheme } from '../store/ThemeContext';
import { useChartSize } from '../hooks/useChartSize';
import { getChartTheme } from '../config/chartConfig';

const CATEGORY_COLORS = {
    anime: '#7a55ff',
    game: '#4ade80',
    film: '#f97316',
    serial: '#3b82f6'
};

const CATEGORY_NAMES = {
    anime: 'Аниме',
    game: 'Игры',
    film: 'Фильмы',
    serial: 'Сериалы'
};

const CategoryStats = ({ data }) => {
    const { theme } = useTheme();
    const { textColor } = getChartTheme(theme);
    const chartSize = useChartSize('pieLarge');

    if (!data || data.length === 0) {
        return (
            <div className="stats-empty">
                <p>Нет данных для отображения</p>
            </div>
        );
    }

    const chartData = data.map(item => ({
        id: CATEGORY_NAMES[item.category] || item.category,
        label: CATEGORY_NAMES[item.category] || item.category,
        value: Number(item.total),
        completed: Number(item.completed),
        in_progress: Number(item.in_progress),
        planned: Number(item.planned),
        color: CATEGORY_COLORS[item.category] || '#999'
    }));

    return (
        <div className="stats-card-content">
            <h3 className="stats-card-title">Распределение по категориям</h3>

            <div className="chart-container chart-container-pie">
                <Pie
                    data={chartData}
                    width={chartSize.width}
                    height={chartSize.height}
                    margin={chartSize.margin}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    colors={{ datum: 'data.color' }}
                    enableArcLinkLabels={false}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={textColor}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    fill={[
                        {
                            match: {
                                depth: 1
                            },
                            id: 'dots'
                        },
                        {
                            match: {
                                depth: 2
                            },
                            id: 'dots'
                        }
                    ]}
                    legends={[]}
                    tooltip={({ datum }) => (
                        <div className="custom-tooltip">
                            <div className="custom-tooltip-title">{datum.label}</div>
                            <div className="custom-tooltip-row">
                                <span>Всего:</span>
                                <strong>{datum.value}</strong>
                            </div>
                            {datum.completed > 0 && (
                                <div className="custom-tooltip-row">
                                    <span>Завершено:</span>
                                    <strong>{datum.completed}</strong>
                                </div>
                            )}
                            {datum.in_progress > 0 && (
                                <div className="custom-tooltip-row">
                                    <span>В процессе:</span>
                                    <strong>{datum.in_progress}</strong>
                                </div>
                            )}
                            {datum.planned > 0 && (
                                <div className="custom-tooltip-row">
                                    <span>Запланировано:</span>
                                    <strong>{datum.planned}</strong>
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            <div className="completion-stats-details">
                {data.map(item => {
                    const rate = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
                    return (
                        <div key={item.category} className="completion-stat-row">
                            <div className="completion-stat-left">
                                <span
                                    className="completion-stat-color-dot"
                                    style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#999' }}
                                />
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

export default CategoryStats;
