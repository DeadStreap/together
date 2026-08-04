import React from 'react';

const StatusIcon = ({ status }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'done':
                return '/done.svg';
            case 'inProgress':
                return '/clock.svg';
            case 'planned':
                return '/dock.svg';
            default:
                return null;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'done':
                return 'status-icon done';
            case 'inProgress':
                return 'status-icon in-progress';
            case 'planned':
                return 'status-icon planned';
            default:
                return 'status-icon';
        }
    };

    const iconSrc = getStatusIcon(status);

    if (!iconSrc) {
        return null;
    }

    const iconElement = iconSrc ? (
        <span className="status-icon-container">
            <img
                src={iconSrc}
                alt={status}
                className={getStatusClass(status)}
            />
        </span>
    ) : null;

    return iconElement;
};

export default StatusIcon;
