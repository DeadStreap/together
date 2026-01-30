import { useState, useEffect } from 'react';

const ColorPicker = ({ selectedColor, onColorChange, label = "Цвет профиля" }) => {
    const [currentColor, setCurrentColor] = useState(selectedColor || '#7a55ff');

    // Цветовая палитра с хорошо подобранными цветами
    const colorPalette = [
        { name: 'Фиолетовый', value: '#7a55ff' },
        { name: 'Розовый', value: '#ff3b8a' },
        { name: 'Синий', value: '#3b82f6' },
        { name: 'Бирюзовый', value: '#06b6d4' },
        { name: 'Зеленый', value: '#10b981' },
        { name: 'Желтый', value: '#f59e0b' },
        { name: 'Оранжевый', value: '#f97316' },
        { name: 'Красный', value: '#ef4444' },
        { name: 'Индиго', value: '#6366f1' },
        { name: 'Пурпурный', value: '#a855f7' },
        { name: 'Голубой', value: '#0ea5e9' },
        { name: 'Изумрудный', value: '#059669' }
    ];

    useEffect(() => {
        if (selectedColor) {
            setCurrentColor(selectedColor);
        }
    }, [selectedColor]);

    const handleColorSelect = (color) => {
        setCurrentColor(color);
        onColorChange(color);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('profile_color', color);
            window.dispatchEvent(new Event('storage'));
        }
    };

    return (
        <div className="color-picker">
            <label className="color-picker-label">{label}</label>
            <div className="color-palette">
                {colorPalette.map((color) => (
                    <button
                        key={color.value}
                        type="button"
                        className={`color-option ${currentColor === color.value ? 'selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => handleColorSelect(color.value)}
                        title={color.name}
                        aria-label={`Выбрать цвет ${color.name}`}
                    />
                ))}
            </div>

        </div>
    );
};

export default ColorPicker;