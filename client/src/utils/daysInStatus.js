export const getDaysInStatus = (startDate, status) => {
    if (!startDate || status !== 'inProgress') return null;
    
    const start = new Date(startDate);
    const now = new Date();
    
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = now.getTime() - start.getTime();
    const days = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    
    return days;
};

export const formatDaysWord = (days) => {
    if (days === null || days === undefined) return '';
    
    let word;
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        word = 'дней';
    } else if (lastDigit === 1) {
        word = 'день';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        word = 'дня';
    } else {
        word = 'дней';
    }
    
    return `${days} ${word}`;
};
