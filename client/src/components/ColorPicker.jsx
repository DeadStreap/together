import { useState, useEffect } from 'react';

const ColorPicker = ({ selectedColor, onColorChange, label = "Цвет профиля" }) => {
    const [currentColor, setCurrentColor] = useState(selectedColor || 'Purple');

    // Цветовая палитра с хорошо подобранными цветами
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

    useEffect(() => {
        if (selectedColor) {
            // If selectedColor is a hex code, try to find its corresponding name
            if (selectedColor.startsWith('#')) {
                const colorObj = colorPalette.find(c => c.value === selectedColor);
                setCurrentColor(colorObj ? colorObj.name : 'Purple');
            } else {
                setCurrentColor(selectedColor);
            }
        }
    }, [selectedColor]);

    const handleColorSelect = (colorName) => {
        setCurrentColor(colorName);
        onColorChange(colorName);
    };

    return (
        <div className="color-picker">
            <label className="color-picker-label">{label}</label>
            <div className="color-palette">
                {colorPalette.map((color) => (
                    <button
                        key={color.name}
                        type="button"
                        className={`color-option ${currentColor === color.name ? 'selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => handleColorSelect(color.name)}
                        title={color.name}
                        aria-label={`Выбрать цвет ${color.name}`}
                    />
                ))}
            </div>

        </div>
    );
};

export default ColorPicker;