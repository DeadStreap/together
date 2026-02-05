import { useState, useEffect } from 'react';

const IconPicker = ({ selectedIcon, onIconChange, label = "Иконка профиля" }) => {
    const [currentIcon, setCurrentIcon] = useState(selectedIcon || '');

    // Получаем список иконок из папки profileIcons
    const iconList = [
        'angel', 'annoyed', 'blank', 'bored', 'confused', 
        'cool', 'cry', 'dead', 'devil', 'dizzy', 
        'embarassed', 'empathy', 'evil', 'mask', 'nervous', 
        'party', 'pensive', 'persevere', 'punk', 'rage', 
        'rolling_eyes', 'shy', 'sluggish', 'teasing', 'thinking'
    ];

    useEffect(() => {
        if (selectedIcon !== undefined) {
            setCurrentIcon(selectedIcon);
        }
    }, [selectedIcon]);

    const handleIconSelect = (iconName) => {
        setCurrentIcon(iconName);
        onIconChange(iconName);
    };

    return (
        <div className="icon-picker">
            <label className="icon-picker-label">{label}</label>
            <div className="icon-grid">
                {/* Кнопка "cancel" для сброса к стандартному отображению */}
                <button
                    type="button"
                    className={`icon-option ${currentIcon === '' ? 'selected' : ''}`}
                    onClick={() => handleIconSelect('')}
                    title="Стандартный вид (первая буква)"
                    aria-label="Стандартный вид (первая буква)"
                >
                    <img 
                        src="/cancel.svg" 
                        alt="Стандартный вид" 
                        className="icon-image"
                    />
                </button>
                
                {iconList.map((icon) => (
                    <button
                        key={icon}
                        type="button"
                        className={`icon-option ${currentIcon === icon ? 'selected' : ''}`}
                        onClick={() => handleIconSelect(icon)}
                        title={icon}
                        aria-label={`Выбрать иконку ${icon}`}
                    >
                        <img 
                            src={`/profileIcons/${icon}.png`} 
                            alt={icon} 
                            className="icon-image"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default IconPicker;