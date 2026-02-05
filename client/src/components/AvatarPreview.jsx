import { useUser } from '../store/UserContext';
import { getColorGradient, getColorShadow } from '../utils/colorGradients';
import { getColorValueByName } from '../utils/colorUtils';

const AvatarPreview = ({ color, icon }) => {
    const { user } = useUser();

    const initials = user?.username
        ? user.username
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
        : "?";

    // Convert color name to hex value if needed
    const colorValue = color && color.startsWith('#') ? color : getColorValueByName(color || 'Purple');

    return (
        <div className="avatar-preview">
            <div className="avatar-preview-label">Как будет выглядеть ваш аватар:</div>
            <div className="avatar-preview-container">
                <div
                    className="profile-avatar avatar-preview-avatar"
                    style={{
                        background: getColorGradient(colorValue),
                        boxShadow: getColorShadow(colorValue)
                    }}
                >
                    {icon ? (
                        <img 
                            src={icon === '' ? `/cancel.svg` : `/profileIcons/${icon}.png`} 
                            alt={icon === '' ? "Стандартный вид" : icon} 
                            className="avatar-icon"
                        />
                    ) : (
                        initials
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvatarPreview;