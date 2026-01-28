export async function apiReq(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();

    if (!data) {
        throw new Error("Некорректный формат данных от API");
    }

    return data;
}
