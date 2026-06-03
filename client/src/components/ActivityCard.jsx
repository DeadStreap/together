import { Link } from 'react-router-dom';
import StatusIcon from './StatusIcon';
import { getCategoryDisplayName } from '../utils/displayMappings';
import { formatDateTime, formatDate } from '../utils/dateFormat';
import { getDaysInStatus, formatDaysWord } from '../utils/daysInStatus';

const getDuration = (start, end) => {
  if (!start || !end) return '';
  const s = new Date(start), e = new Date(end);
  s.setHours(0, 0, 0, 0); e.setHours(0, 0, 0, 0);
  const days = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  if (days < 1) return '';
  return ` (${formatDaysWord(days)})`;
};

const ActivityCard = ({ item, showFullDates = false, hideMeta = false, hideEndDate = false }) => {
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
                {!hideMeta && (
                    <div className="item-details">
                        <span>Добавил</span>: {item.added_by || "N/A"}
                    </div>
                )}
                {item.status === 'inProgress' && daysInStatus !== null && (
                    <div className="item-details item-details-highlight">
                        <span>В процессе</span>: {formatDaysWord(daysInStatus)}
                    </div>
                )}
                <div className="item-dates">
                    {!hideMeta && (
                        <span>
                            <span>Добавлено</span>
                            <span>{formatDateTime(item.added_at)}</span>
                        </span>
                    )}
                    {hasStartDate && (
                        <span>
                            <span>Начато</span>
                            <span>
                                {formatDate(item.start_date)}
                                {hideEndDate && item.start_date && item.end_date && getDuration(item.start_date, item.end_date)}
                            </span>
                        </span>
                    )}
                    {hasEndDate && !hideEndDate && (
                        <span>
                            <span>Завершено</span>
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
