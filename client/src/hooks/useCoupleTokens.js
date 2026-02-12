import { useState } from 'react';
import { getApiUrl } from '../config/apiConfig';

export const useCoupleTokens = (user) => {
    const [partnerTokenInput, setPartnerTokenInput] = useState('');

    const handleGenerateToken = async () => {
        const response = await fetch(getApiUrl('/api/user/generate-token'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
            throw new Error('Не удалось сгенерировать токен');
        }

        const data = await response.json();
        return data;
    };

    const handleTokenRefresh = async () => {
        const response = await fetch(getApiUrl('/api/user/refresh-token'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
            throw new Error('Не удалось обновить токен');
        }

        const data = await response.json();
        return data;
    };

    const handleJoinCouple = async () => {
        if (!partnerTokenInput.trim()) {
            throw new Error('Введите токен партнера');
        }

        const response = await fetch(getApiUrl('/api/user/join-couple'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                partnerToken: partnerTokenInput.trim()
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Не удалось присоединиться к паре');
        }

        const data = await response.json();
        // Возвращаем обновленные данные пользователя
        const userDataResponse = await fetch(getApiUrl(`/api/user/id/${user.id}`));
        if (!userDataResponse.ok) {
            throw new Error('Не удалось получить обновленные данные пользователя');
        }
        const updatedUser = await userDataResponse.json();
        delete updatedUser.password;
        return updatedUser;
    };

    return {
        partnerTokenInput,
        setPartnerTokenInput,
        handleGenerateToken,
        handleTokenRefresh,
        handleJoinCouple
    };
};