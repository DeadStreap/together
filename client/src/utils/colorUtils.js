// Цветовая палитра
const colorPalette = [
    { name: 'Purple', value: '#7a55ff' },
    { name: 'Pink', value: '#ff3b8a' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Turquoise', value: '#06b6d4' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purpure', value: '#a855f7' },
    { name: 'LightBlue', value: '#0ea5e9' },
    { name: 'Emerald', value: '#059669' }
];

/**
 * Преобразует название цвета в его HEX-значение
 * @param {string} colorName - Название цвета (например, 'Purple', 'Pink')
 * @returns {string} HEX-значение цвета или значение по умолчанию (#7a55ff), если цвет не найден
 */
export const getColorValueByName = (colorName) => {
    const color = colorPalette.find(c => c.name === colorName);
    return color ? color.value : '#7a55ff'; // Значение по умолчанию - Purple
};

/**
 * Возвращает всю цветовую палитру
 * @returns {Array} Массив объектов с полями name и value
 */
export const getColorPalette = () => {
    return colorPalette;
};

/**
 * Проверяет, является ли название цвета допустимым
 * @param {string} colorName - Название цвета для проверки
 * @returns {boolean} true, если цвет допустим, иначе false
 */
export const isValidColorName = (colorName) => {
    return colorPalette.some(c => c.name === colorName);
};