import { Pie } from '@nivo/pie';
import { useTheme } from '../store/ThemeContext';
import { useChartSize } from '../hooks/useChartSize';
import { getChartTheme } from '../config/chartConfig';

const STATUS_CONFIG = {
    planned: {
        label: 'Запланировано',
        color: '#a78bfa'
    },
    inProgress: {
        label: 'В процессе',
        color: '#fbbf24'
    },
    done: {
        label: 'Завершено',
        color: '#4ade80'
    }
};

const StatusStats = ({ data }) => {
    const { theme } = useTheme();
    const { textColor } = getChartTheme(theme);
    const chartSize = useChartSize('pie');

    if (!data || (data.planned === 0 && data.inProgress === 0 && data.done === 0)) {
        return (
            <div className="stats-empty">
                <p>Нет данных для отображения</p>
            </div>
        );
    }

    const total = data.planned + data.inProgress + data.done;
    
    const chartData = [
        { 
            id: 'planned', 
            label: STATUS_CONFIG.planned.label, 
            value: data.planned,
            color: STATUS_CONFIG.planned.color
        },
        { 
            id: 'inProgress', 
            label: STATUS_CONFIG.inProgress.label, 
            value: data.inProgress,
            color: STATUS_CONFIG.inProgress.color
        },
        { 
            id: 'done', 
            label: STATUS_CONFIG.done.label, 
            value: data.done,
            color: STATUS_CONFIG.done.color
        }
    ].filter(item => item.value > 0);

    const completionRate = total > 0 ? Math.round((data.done / total) * 100) : 0;

    return (
        <div className="stats-card-content">
            <h3 className="stats-card-title">Прогресс по статусам</h3>
            
            <div className="status-stats-overview">
                <div className="status-stat-item">
                    <span className="status-stat-value">{total}</span>
                    <span className="status-stat-label">Всего активностей</span>
                </div>
                <div className="status-stat-item">
                    <span className="status-stat-value">{completionRate}%</span>
                    <span className="status-stat-label">Завершено</span>
                </div>
            </div>

            <div className="chart-container chart-container-donut">
                <Pie
                    data={chartData}
                    width={chartSize.width}
                    height={chartSize.height}
                    margin={chartSize.margin}
                    innerRadius={0.6}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    colors={{ datum: 'data.color' }}
                    enableArcLinkLabels={false}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={textColor}
                    arcLabelsFormat={({ value }) => `${value}`}
                    legends={[]}
                    tooltip={({ datum }) => (
                        <div className="custom-tooltip">
                            <div className="custom-tooltip-title">{datum.label}</div>
                            <div className="custom-tooltip-row">
                                <span>Количество:</span>
                                <strong>{datum.value}</strong>
                            </div>
                            <div className="custom-tooltip-row">
                                <span>Процент:</span>
                                <strong>{total > 0 ? Math.round((datum.value / total) * 100) : 0}%</strong>
                            </div>
                        </div>
                    )}
                />
            </div>

            <div className="status-legend">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <div key={key} className="status-legend-item">
                        <span
                            className="status-legend-color"
                            style={{ backgroundColor: config.color }}
                        />
                        <span className="status-legend-label">{config.label}</span>
                        <span className="status-legend-value">{data[key] || 0}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusStats;
