import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/UserContext";
import { getApiUrl } from "../../config/apiConfig";
import ColorPicker from "../../components/ColorPicker";
import AvatarPreview from "../../components/AvatarPreview";
import { getColorValueByName, isValidColorName } from "../../utils/colorUtils";

function ProfileEdit() {
    const { user, login, updateProfileColor, getProfileColor } = useUser();
    const [formData, setFormData] = useState({
        username: "",
    });
    const [profileColor, setProfileColor] = useState(user?.color || 'Purple');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
            });
            // Initialize profile color from user object
            setProfileColor(user?.color || 'Purple');
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
            // Validate that the color is a valid color name before sending to server
            const validatedColor = isValidColorName(profileColor) ? profileColor : 'Purple';

            const updateData = {
                id: user.id,
                username: formData.username,
                color: validatedColor,
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
                <div className="activity-form-wrapper">
                    <div className="profile-card">
                        <div className="item-title">Редактирование профиля</div>
                        <p>Для редактирования профиля необходимо войти в систему.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-edit-page">
            <div className="activity-form-wrapper">
                <div className="profile-card">
                <div className="item-title">Редактировать профиль</div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="success-message">
                        Профиль успешно обновлён!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="activity-form">
                    <div className="activity-form-field">
                        <label htmlFor="username">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <ColorPicker
                        selectedColor={profileColor}
                        onColorChange={(color) => {
                            setProfileColor(color);
                        }}
                        label="Цвет профиля"
                    />
                    
                    <AvatarPreview color={profileColor} />

                    <div className="activity-form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="secondary-button"
                            disabled={isLoading}
                        >
                            Отмена
                        </button>
                        
                        <button
                            type="submit"
                            className="primary-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default ProfileEdit;