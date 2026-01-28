import { useState, useEffect } from "react";
import {  Link } from 'react-router-dom';

import { apiReq } from '../../utils/apiReq'

function Profile() {
    const URL = "localhost:3001";
    const API = "together-alpha-one.vercel.app";
    const API_URL = `https://${API}/api/user/id/1`;
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [partner, setPartner] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await apiReq(API_URL);
                setUser(data);
                console.log(data.partner_id)
                data.partner_id ? getPartner(data.partner_id) : null
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getPartner = async (partner_id) => {
            try {
                setIsLoading(true);
                const data = await apiReq(`https://${API}/api/user/id/${partner_id}`);
                console.log(data)
                setPartner(data)
                console.log(partner)
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

    
    if (isLoading) {
        return <div className="loading">Загрузка контента...</div>;
    }

    if (error) {
        return (
            <div className="error">
                Ошибка: {error.message || "Неизвестная ошибка"}
            </div>
        );
    }

    return (
        <div>
            <h1>Профиль</h1>
            <p>Name: {user.username}</p>
            <p>{partner ? `В паре с ${partner.username} 🖤` : `У вас пока нет пары`}</p>
            <Link to='/'>Вернуться на главную </Link>
        </div>
    );
}

export default Profile;
