import { useState, useEffect } from "react";
import {  Link } from 'react-router-dom';

function Profile() {
    // const URL = "localhost:3001";
    // const API = "together-alpha-one.vercel.app";
    // const API_URL = `https://${API}/api/content/id/${ActivityId}`;
    const user = {
        name: 'аххаахах',
        couple: false,

    }
    return (
        <div>
            <h1>Профиль</h1>
            <p>Name:{user.name}</p>
            <p>{user.couple ? `В паре с ${user.couple}` : `У вас пока нет пары`}</p>
            <Link to='/'>Вернуться на главную </Link>
        </div>
    );
}

export default Profile;
