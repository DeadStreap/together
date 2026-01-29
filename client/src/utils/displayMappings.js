// Маппинги для отображения категорий и статусов
const categoryDisplayMap = {
    'game': 'Игра',
    'anime': 'Аниме',
    'film': 'Фильм',
    'serial': 'Сериал'
};

const statusDisplayMap = {
    'inProgress': 'В процессе',
    'done': 'Завершено',
    'planned': 'Запланировано'
};

// Функции для получения отображаемого текста
const getCategoryDisplayName = (category) => {
    return categoryDisplayMap[category] || category;
};

const getStatusDisplayName = (status) => {
    return statusDisplayMap[status] || status;
};

export { categoryDisplayMap, statusDisplayMap, getCategoryDisplayName, getStatusDisplayName };