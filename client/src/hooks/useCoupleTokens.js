import { useState } from 'react';
import { getApiUrl } from '../config/apiConfig';
import { apiReq, apiReqWithBody } from '../utils/apiReq';

export const useCoupleTokens = (user) => {
    const [partnerTokenInput, setPartnerTokenInput] = useState('');

    const handleGenerateToken = async () => {
        const data = await apiReqWithBody(getApiUrl('/api/user/generate-token'), 'PUT', { userId: user.id });
        return data;
    };

    const handleTokenRefresh = async () => {
        const data = await apiReqWithBody(getApiUrl('/api/user/refresh-token'), 'PUT', { userId: user.id });
        return data;
    };

    const handleJoinCouple = async () => {
        if (!partnerTokenInput.trim()) {
            throw new Error('Введите токен партнера');
        }

        await apiReqWithBody(getApiUrl('/api/user/join-couple'), 'PUT', {
            userId: user.id,
            partnerToken: partnerTokenInput.trim()
        });

        const updatedUser = await apiReq(getApiUrl(`/api/user/id/${user.id}`));
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
