
export function getDaysTogether(user, method){
    const startDate = new Date(user.couple_start_date);
    const today = new Date();

    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - startDate.getTime();
    const daysTogether= Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    if(method == 'days'){
        return daysTogether + ' дней'
    }

    let years = 0;
    let months = 0;
    let days = daysTogether;

    while (days >= 365) {
        const yearToCheck = startDate.getFullYear() + years;
        const isLeap = (yearToCheck % 4 === 0 && yearToCheck % 100 !== 0) || (yearToCheck % 400 === 0);
        const daysInYear = isLeap ? 366 : 365;

        if (days >= daysInYear) {
            days -= daysInYear;
            years++;
        } else {
            break;
        }
    }

    months = Math.floor(days / 30.44);
    days = Math.floor(days % 30.44);

    const parts = [];

    if (years > 0) {
        const suffix = years === 1 ? '' :
            years >= 2 && years <= 4 ? 'а' : 'ов';
        parts.push(`${years} год${suffix}`);
    }

    if (months > 0) {
        const suffix = months === 1 ? '' :
            months >= 2 && months <= 4 ? 'а' : 'ев';
        parts.push(`${months} месяц${suffix}`);
    }

    if (days > 0 || parts.length === 0) {
        let dayWord;
        const lastDigit = days % 10;
        const lastTwoDigits = days % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            dayWord = 'дней';
        } else if (lastDigit === 1) {
            dayWord = 'день';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            dayWord = 'дня';
        } else {
            dayWord = 'дней';
        }

        parts.push(`${days} ${dayWord}`);
    }

    const together = parts.join(' ');
    if(method == 'str'){
        return together
    }
}