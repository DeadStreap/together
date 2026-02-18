export async function apiReq(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    };

    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.statusText} (${response.status})`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
    }

    return null;
}

export async function apiReqWithBody(url, method, body) {
    return apiReq(url, {
        method,
        body: JSON.stringify(body),
    });
}
