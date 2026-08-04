import { Line } from '@nivo/line';
import { useTheme } from '../store/ThemeContext';
import { useChartSize } from '../hooks/useChartSize';
import { getChartTheme } from '../config/chartConfig';

const CompletionCurve = ({ data }) => {
    const { theme } = useTheme();
    const { textColor, gridColor } = getChartTheme(theme);
    const chartSize = useChartSize('line');

    if (!data || data.length === 0) {
        return (
            <div className="stats-card-content">
                <h3 className="stats-card-title">Кривая выполненных активностей</h3>
                <div className="stats-empty">
                    <p>Нет завершённых активностей для отображения</p>
                </div>
            </div>
        );
    }

    const chartData = data.map((item) => ({
        x: new Date(item.completion_date),
        y: Number(item.cumulative_count),
        date: item.completion_date,
        completed: Number(item.completed_count),
        cumulative: Number(item.cumulative_count),
        formattedDate: new Date(item.completion_date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        }),
        fullDate: new Date(item.completion_date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }));

    const totalCompleted = chartData.length > 0 ? chartData[chartData.length - 1].cumulative : 0;
    const firstCompletion = chartData.length > 0 ? chartData[0].date : null;
    const lastCompletion = chartData.length > 0 ? chartData[chartData.length - 1].date : null;

    const daysSpan = firstCompletion && lastCompletion
        ? Math.max(1, Math.ceil((new Date(lastCompletion) - new Date(firstCompletion)) / (1000 * 60 * 60 * 24)))
        : 1;

    const avgPerDay = totalCompleted > 0 ? (totalCompleted / daysSpan).toFixed(2) : 0;

    return (
        <div className="stats-card-content">
            <h3 className="stats-card-title">Кривая выполненных активностей</h3>

            <div className="completion-curve-stats">
                <div className="completion-curve-stat">
                    <span className="completion-curve-stat-value">{totalCompleted}</span>
                    <span className="completion-curve-stat-label">Всего завершено</span>
                </div>
                <div className="completion-curve-stat">
                    <span className="completion-curve-stat-value">{avgPerDay}</span>
                    <span className="completion-curve-stat-label">В среднем в день</span>
                </div>
                <div className="completion-curve-stat">
                    <span className="completion-curve-stat-value">{chartData.length}</span>
                    <span className="completion-curve-stat-label">Дней с завершением</span>
                </div>
            </div>

            <div className="chart-container chart-container-line" style={{ overflowX: 'auto' }}>
                <div style={{ width: `${chartSize.width}px`, minWidth: '100%' }}>
                    <Line
                        data={[{
                            id: 'completed',
                            data: chartData
                        }]}
                        width={chartSize.width}
                        height={chartSize.height}
                        margin={chartSize.margin}
                        xScale={{
                            type: 'time',
                            format: 'native',
                            precision: 'day'
                        }}
                        yScale={{ type: 'linear', min: 0, stacked: false }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            format: '%d.%m.%y',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: -45,
                            legendPosition: 'middle',
                            legendOffset: 50
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Завершено',
                            legendPosition: 'middle',
                            legendOffset: -50,
                            tickValues: 5
                        }}
                        enableGridX={false}
                        enableGridY={true}
                        gridYValues={5}
                        lineWidth={3}
                        colors={['#4ade80']}
                        pointSize={8}
                        pointColor="#4ade80"
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        enablePointLabel={false}
                        enableSlices="x"
                        sliceTooltip={({ slice }) => (
                            <div className="custom-tooltip">
                                {slice.points.length > 0 && (
                                    <>
                                        <div className="custom-tooltip-title">
                                            {slice.points[0].data.fullDate}
                                        </div>
                                        <div className="custom-tooltip-row">
                                            <span>Завершено активностей:</span>
                                            <strong>{slice.points[0].data.completed}</strong>
                                        </div>
                                        <div className="custom-tooltip-row">
                                            <span>Всего завершено:</span>
                                            <strong>{slice.points[0].data.cumulative}</strong>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        areaOpacity={0.2}
                        areaBlendMode="multiply"
                        theme={{
                            axis: {
                                domain: { line: { stroke: gridColor } },
                                ticks: { line: { stroke: gridColor }, text: { fill: textColor } },
                                legend: { text: { fill: textColor } }
                            },
                            grid: { line: { stroke: gridColor, strokeWidth: 1 } },
                            crosshair: { line: { stroke: gridColor, strokeWidth: 2 } }
                        }}
                        isInteractive={true}
                        animate={true}
                        motionConfig="gentle"
                        legends={[]}
                    />
                </div>
            </div>

            {chartData.length > 1 && (
                <div className="completion-curve-insights">
                    <div className="completion-curve-insight-item">
                        <span className="completion-curve-insight-text">
                            Первая активность завершена{' '}
                            {new Date(firstCompletion).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="completion-curve-insight-item">
                        <span className="completion-curve-insight-text">
                            Последняя активность завершена{' '}
                            {new Date(lastCompletion).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletionCurve;
