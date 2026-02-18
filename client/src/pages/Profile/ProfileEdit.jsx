import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/UserContext";
import { getApiUrl } from "../../config/apiConfig";
import { apiReqWithBody } from "../../utils/apiReq";
import ColorPicker from "../../components/ColorPicker";
import IconPicker from "../../components/IconPicker";
import AvatarPreview from "../../components/AvatarPreview";
import { getColorValueByName, isValidColorName } from "../../utils/colorUtils";

function ProfileEdit() {
    const { user, login, updateProfileColor, getProfileColor } = useUser();
    const [formData, setFormData] = useState({
        username: "",
    });
    const [profileColor, setProfileColor] = useState(user?.color || 'Purple');
    const [profileIcon, setProfileIcon] = useState(user?.icon || '');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
            });
            setProfileColor(user?.color || 'Purple');
            setProfileIcon(user?.icon || '');
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
            const validatedColor = isValidColorName(profileColor) ? profileColor : 'Purple';

            const updateData = {
                id: user.id,
                username: formData.username,
                color: validatedColor,
                icon: profileIcon || null,
            };

            const updatedUser = await apiReqWithBody(getApiUrl(`/api/update/user`), 'PUT', updateData);

            login(updatedUser);

            setSuccess(true);
            setIsRedirecting(true);
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
                            disabled={isLoading || isRedirecting}
                        />
                    </div>

                    <ColorPicker
                        selectedColor={profileColor}
                        onColorChange={(color) => {
                            if (!(isLoading || isRedirecting)) {
                                setProfileColor(color);
                            }
                        }}
                        label="Цвет профиля"
                        disabled={isLoading || isRedirecting}
                    />

                    <IconPicker
                        selectedIcon={profileIcon}
                        onIconChange={(icon) => {
                            if (!(isLoading || isRedirecting)) {
                                setProfileIcon(icon);
                            }
                        }}
                        label="Иконка профиля"
                        disabled={isLoading || isRedirecting}
                    />

                    <AvatarPreview color={profileColor} icon={profileIcon} />

                    <div className="activity-form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="secondary-button"
                            disabled={isLoading || isRedirecting}
                        >
                            Отмена
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={isLoading || isRedirecting}
                        >
                            {(isLoading || isRedirecting) ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default ProfileEdit;
