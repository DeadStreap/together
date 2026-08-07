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
        let message = `Ошибка сети: ${response.statusText} (${response.status})`;
        let data = null;
        try {
            data = await response.json();
        } catch {
            data = null;
        }
        if (data && data.error) message = data.error;
        throw new Error(message);
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
