import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/UserContext";
import { getApiUrl } from "../../config/apiConfig";

function ProfileEdit() {
    const { user, login } = useUser();
    const [formData, setFormData] = useState({
        username: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const updateData = {
                id: user.id,
                username: formData.username,
            };

            const response = await fetch(getApiUrl(`/api/update/user`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка обновления профиля: ${response.statusText}`);
            }

            const updatedUser = await response.json();
            console.log(updatedUser)
            login(updatedUser);

            setSuccess(true);
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="profile-edit-page">
                <div className="profile-card">
                    <div className="item-title">Редактирование профиля</div>
                    <p>Для редактирования профиля необходимо войти в систему.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-edit-page">
            <div className="profile-card">
                <div className="item-title">Редактировать профиль</div>
                
                {error && (
                    <div className="error-message" style={{ 
                        backgroundColor: '#fee', 
                        border: '1px solid #fcc', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        color: '#c33',
                        marginBottom: '15px'
                    }}>
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="success-message" style={{ 
                        backgroundColor: '#efe', 
                        border: '1px solid #cfc', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        color: '#363',
                        marginBottom: '15px'
                    }}>
                        Профиль успешно обновлён!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="profile-edit-form">
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label htmlFor="username" style={{ 
                            display: 'block', 
                            marginBottom: '5px', 
                            fontWeight: 'bold' 
                        }}>
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                            required
                        />
                    </div>

                    <div className="form-actions" style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginTop: '20px' 
                    }}>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="secondary-button"
                            style={{
                                padding: '10px 20px',
                                fontSize: '14px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: '#f0f0f0'
                            }}
                            disabled={isLoading}
                        >
                            Отмена
                        </button>
                        
                        <button
                            type="submit"
                            className="primary-button"
                            style={{
                                padding: '10px 20px',
                                fontSize: '14px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfileEdit;