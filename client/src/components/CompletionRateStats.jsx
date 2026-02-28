import { Bar } from '@nivo/bar';
import { useTheme } from '../store/ThemeContext';
import { useState, useEffect } from 'react';

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
    const chartWidth = isSmallMobile ? 340 : isMobile ? 400 : 500;
    const chartHeight = isSmallMobile ? 250 : isMobile ? 280 : 300;
    const chartMargin = isSmallMobile 
        ? { top: 20, right: 90, bottom: 20, left: 90 }
        : isMobile 
            ? { top: 20, right: 95, bottom: 20, left: 95 }
            : { top: 20, right: 100, bottom: 20, left: 100 };

    if (!data || data.length === 0) {
        return (
            <div className="stats-empty">
                <p>Нет данных для отображения</p>
            </div>
        );
    }

    const chartData = data.map(item => {
        const rate = parseFloat(item.completion_rate);
        return {
            category: CATEGORY_NAMES[item.category] || item.category,
            completion_rate: rate,
            completed: item.completed,
            total: item.total,
            color: CATEGORY_COLORS[item.category] || '#999'
        };
    });

    return (
        <div className="stats-card-content">
            <h3 className="stats-card-title">% завершённых по категориям</h3>
            
            <div className="chart-container chart-container-bar-horizontal">
                <Bar
                    data={chartData}
                    width={chartWidth}
                    height={chartHeight}
                    indexBy="category"
                    keys={['completion_rate']}
                    margin={chartMargin}
                    padding={0.3}
                    valueScale={{ type: 'linear', max: 100 }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ datum: 'data.color' }}
                    borderWidth={0}
                    axisTop={null}
                    axisRight={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: (v) => `${v}%`
                    }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Процент завершения',
                        legendPosition: 'middle',
                        legendOffset: 40
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0
                    }}
                    enableGridX={true}
                    gridXValues={5}
                    enableGridY={false}
                    enableLabel={true}
                    labelFormat={(v) => `${v}%`}
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
                                <div className="custom-tooltip-title">{datum.data.category}</div>
                                <div className="custom-tooltip-row">
                                    <span>Завершено:</span>
                                    <strong>{datum.data.completed}</strong>
                                </div>
                                <div className="custom-tooltip-row">
                                    <span>Всего:</span>
                                    <strong>{datum.data.total}</strong>
                                </div>
                                <div className="custom-tooltip-row">
                                    <span>Процент:</span>
                                    <strong>{datum.data.completion_rate}%</strong>
                                </div>
                            </div>
                        );
                    }}
                    legends={[]}
                />
            </div>

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
