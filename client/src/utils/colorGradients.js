import { getColorValueByName } from './colorUtils';

export const getColorGradient = (color) => {
    const colorValue = color.startsWith('#') ? color : getColorValueByName(color);

    const flatColors = {
        '#7a55ff': '#7a55ff',
        '#ff3b8a': '#ff3b8a',
        '#3b82f6': '#3b82f6',
        '#06b6d4': '#06b6d4',
        '#10b981': '#10b981',
        '#f59e0b': '#f59e0b',
        '#f97316': '#f97316',
        '#ef4444': '#ef4444',
        '#6366f1': '#6366f1',
        '#a855f7': '#a855f7',
        '#0ea5e9': '#0ea5e9',
        '#059669': '#059669'
    };

    return flatColors[colorValue] || flatColors['#7a55ff'];
};

export const getColorShadow = (color) => {
    const colorValue = color.startsWith('#') ? color : getColorValueByName(color);

    const shadows = {
        '#7a55ff': '0 4px 12px rgba(122, 85, 255, 0.15)',
        '#ff3b8a': '0 4px 12px rgba(255, 59, 138, 0.15)',
        '#3b82f6': '0 4px 12px rgba(59, 130, 246, 0.15)',
        '#06b6d4': '0 4px 12px rgba(6, 182, 212, 0.15)',
        '#10b981': '0 4px 12px rgba(16, 185, 129, 0.15)',
        '#f59e0b': '0 4px 12px rgba(245, 158, 11, 0.15)',
        '#f97316': '0 4px 12px rgba(249, 115, 22, 0.15)',
        '#ef4444': '0 4px 12px rgba(239, 68, 68, 0.15)',
        '#6366f1': '0 4px 12px rgba(99, 102, 241, 0.15)',
        '#a855f7': '0 4px 12px rgba(168, 85, 247, 0.15)',
        '#0ea5e9': '0 4px 12px rgba(14, 165, 233, 0.15)',
        '#059669': '0 4px 12px rgba(5, 150, 105, 0.15)'
    };

    return shadows[colorValue] || shadows['#7a55ff'];
};