import { Bar } from '@nivo/bar';
import { useTheme } from '../store/ThemeContext';
import { useState, useEffect } from 'react';

const MONTH_NAMES = {
    '01': 'Янв',
    '02': 'Фев',
    '03': 'Мар',
    '04': 'Апр',
    '05': 'Май',
    '06': 'Июн',
    '07': 'Июл',
    '08': 'Авг',
    '09': 'Сен',
    '10': 'Окт',
    '11': 'Ноя',
    '12': 'Дек'
};

const MonthlyStats = ({ data }) => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const gridColor = theme === 'dark' ? '#4a5568' : '#e5e7eb';
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isSmallMobile = windowWidth < 480;
    const chartWidth = isSmallMobile ? 400 : isMobile ? 500 : 700;
    const chartHeight = isSmallMobile ? 300 : isMobile ? 340 : 420;
    const chartMargin = isSmallMobile
        ? { top: 20, right: 20, bottom: 90, left: 50 }
        : isMobile
            ? { top: 20, right: 20, bottom: 95, left: 55 }
            : { top: 20, right: 20, bottom: 100, left: 60 };

    if (!data || data.length === 0) {
        return (
            <div className="stats-empty">
                <p>Нет данных для отображения</p>
            </div>
        );
    }

    const chartData = data
        .filter(item => item.month_period)
        .map(item => {
            const [year, month] = item.month_period.split('-');
            const monthName = MONTH_NAMES[month] || month;

            return {
                month: item.month_period,
                monthName: `${monthName} ${year.slice(-2)}`,
                total: Number(item.total) || 0,
                completed: Number(item.completed) || 0
            };
        });

    const maxTotal = Math.max(...chartData.map(d => d.total), 1);

    return (
        <div className="stats-card-content">
            <h3 className="stats-card-title">Активности по месяцам</h3>
            
            <div className="chart-container chart-container-bar" style={{ overflowX: 'auto' }}>
                <div style={{ width: `${chartWidth}px`, minWidth: '100%' }}>
                    <Bar
                        data={chartData}
                        width={chartWidth}
                        height={chartHeight}
                        keys={['total', 'completed']}
                        indexBy="monthName"
                        margin={chartMargin}
                        padding={0.5}
                        valueScale={{ type: 'linear' }}
                        indexScale={{ type: 'band', round: true }}
                        colors={['#7a55ff', '#4ade80']}
                        borderWidth={0}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
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
                            legend: 'Количество',
                            legendPosition: 'middle',
                            legendOffset: -40,
                            tickValues: 5
                        }}
                        enableGridY={true}
                        gridYValues={5}
                        enableLabel={true}
                        labelTextColor={textColor}
                        theme={{
                            axis: {
                                domain: { line: { stroke: gridColor } },
                                ticks: { line: { stroke: gridColor }, text: { fill: textColor } },
                                legend: { text: { fill: textColor } }
                            },
                            grid: { line: { stroke: gridColor } }
                        }}
                        isInteractive={true}
                        animate={true}
                        motionConfig="gentle"
                        tooltip={({ datum }) => {
                            if (!datum || !datum.data) return null;
                            return (
                                <div className="custom-tooltip">
                                    <div className="custom-tooltip-title">{datum.data.monthName}</div>
                                    <div className="custom-tooltip-row">
                                        <span className="tooltip-indicator tooltip-indicator-added">● Добавлено:</span>
                                        <strong>{datum.data.total}</strong>
                                    </div>
                                    <div className="custom-tooltip-row">
                                        <span className="tooltip-indicator tooltip-indicator-completed">● Завершено:</span>
                                        <strong>{datum.data.completed}</strong>
                                    </div>
                                </div>
                            );
                        }}
                        legends={[
                            {
                                data: [
                                    { id: 'total', label: 'Добавлено', color: '#7a55ff' },
                                    { id: 'completed', label: 'Завершено', color: '#4ade80' }
                                ],
                                anchor: 'bottom',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: 60,
                            itemsSpacing: 20,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemTextColor: textColor,
                            itemOpacity: 1,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 0.7
                                    }
                                }
                            ]
                        }
                    ]}
                />
                </div>
            </div>

            <div className="monthly-stats-summary">
                <div className="monthly-stat">
                    <span className="monthly-stat-value">
                        {chartData.reduce((sum, d) => sum + d.total, 0)}
                    </span>
                    <span className="monthly-stat-label">Всего добавлено</span>
                </div>
                <div className="monthly-stat">
                    <span className="monthly-stat-value">
                        {chartData.reduce((sum, d) => sum + d.completed, 0)}
                    </span>
                    <span className="monthly-stat-label">Всего завершено</span>
                </div>
                <div className="monthly-stat">
                    <span className="monthly-stat-value">
                        {chartData.length}
                    </span>
                    <span className="monthly-stat-label">Месяцев активности</span>
                </div>
            </div>
        </div>
    );
};

export default MonthlyStats;
