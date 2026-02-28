import { Pie } from '@nivo/pie';
import { useTheme } from '../store/ThemeContext';
import { useState, useEffect } from 'react';

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
    const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const isMobile = windowWidth < 768;
    const isSmallMobile = windowWidth < 480;
    const chartWidth = isSmallMobile ? 280 : isMobile ? 320 : 450;
    const chartHeight = isSmallMobile ? 230 : isMobile ? 260 : 320;
    const chartMargin = isSmallMobile 
        ? { top: 30, right: 50, bottom: 30, left: 50 }
        : isMobile 
            ? { top: 35, right: 60, bottom: 35, left: 60 }
            : { top: 40, right: 60, bottom: 40, left: 60 };

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
                    width={chartWidth}
                    height={chartHeight}
                    margin={chartMargin}
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

            <div className="stats-details">
                {data.map(item => (
                    <div key={item.category} className="stat-detail-row">
                        <div className="stat-detail-left">
                            <span
                                className="stat-color-dot"
                                style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#999' }}
                            />
                            <span className="stat-category">
                                {CATEGORY_NAMES[item.category] || item.category}
                            </span>
                        </div>
                        <div className="stat-detail-values">
                            <span className="stat-completed">{item.completed}</span>
                            <span className="stat-total">/{item.total}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryStats;
