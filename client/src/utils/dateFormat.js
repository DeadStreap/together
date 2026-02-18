export const formatDateTime = (dateString) => {
    if (!dateString) return "не указано";

    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${formattedDate} ${formattedTime}`;
};

export const formatDate = (dateString) => {
    if (!dateString) return "не указано";
    return new Date(dateString).toLocaleDateString('ru-RU');
};

export const formatFullDate = (dateString) => {
    if (!dateString) return "не указано";

    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

export const formatTime = (dateString) => {
    if (!dateString) return "не указано";

    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });
};
