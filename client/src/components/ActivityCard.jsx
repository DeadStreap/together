import { Link } from 'react-router-dom';
import StatusIcon from './StatusIcon';
import { getCategoryDisplayName } from '../utils/displayMappings';
import { formatDateTime, formatDate } from '../utils/dateFormat';
import { getDaysInStatus, formatDaysWord } from '../utils/daysInStatus';

const ActivityCard = ({ item, showFullDates = false }) => {
    const hasStartDate = item.start_date || showFullDates;
    const hasEndDate = item.end_date || showFullDates;
    const daysInStatus = getDaysInStatus(item.start_date, item.status);
    const commentCount = item.comment_count || 0;

    return (
        <li className="content-card" data-status={item.status}>
            <Link to={`/activity/${item.id}`} className="content-card-link">
                <div className="item-title-card">
                    <StatusIcon status={item.status} />
                    <div className="item-title-content">
                        {item.title || "Без названия"}
                    </div>
                </div>
                <div className="item-details">
                    <span>Категория</span>: {getCategoryDisplayName(item.category) || "N/A"}
                </div>
                <div className="item-details">
                    <span>Добавил</span>: {item.added_by || "N/A"}
                </div>
                {item.status === 'inProgress' && daysInStatus !== null && (
                    <div className="item-details item-details-highlight">
                        <span>В процессе</span>: {formatDaysWord(daysInStatus)}
                    </div>
                )}
                <div className="item-dates">
                    <span>
                        <span>Добавлено</span>
                        <span>{formatDateTime(item.added_at)}</span>
                    </span>
                    {hasStartDate && (
                        <span>
                            <span>{showFullDates ? 'Начато' : 'Начато'}</span>
                            <span>{formatDate(item.start_date)}</span>
                        </span>
                    )}
                    {hasEndDate && (
                        <span>
                            <span>{showFullDates ? 'Завершено' : 'Завершено'}</span>
                            <span>{formatDate(item.end_date)}</span>
                        </span>
                    )}
                    {commentCount > 0 && (
                        <span>
                            <span>Комментариев</span>
                            <span>{commentCount}</span>
                        </span>
                    )}
                </div>
            </Link>
        </li>
    );
};

export default ActivityCard;
