import { getCategoryDisplayName } from '../utils/displayMappings';

const STATUS_LABELS = {
    pending: 'Ожидает ответа',
    accepted: 'Принято',
    declined: 'Отклонено',
};

const SuggestionCard = ({ suggestion, mode, onAccept, onDecline, isPending = false }) => {
    return (
        <div className="suggestion-card">
            <div className="suggestion-card-body">
                <div className="suggestion-card-category">{getCategoryDisplayName(suggestion.category)}</div>
                <div className="suggestion-card-title">{suggestion.title}</div>

                {mode === 'incoming' && (
                    <div className="suggestion-card-username">
                        От: {suggestion.suggested_by_username || 'Партнёр'}
                    </div>
                )}

                {mode === 'outgoing' && (
                    <div className={`suggestion-card-status suggestion-card-status--${suggestion.status}`}>
                        {STATUS_LABELS[suggestion.status] || suggestion.status}
                    </div>
                )}
            </div>

            {mode === 'incoming' && suggestion.status === 'pending' && (
                <div className="suggestion-card-actions">
                    <button
                        className="suggestion-card-btn suggestion-card-btn--accept"
                        onClick={() => onAccept?.(suggestion.id)}
                        disabled={isPending}
                    >
                        {isPending ? 'Ожидание...' : 'Принять'}
                    </button>
                    <button
                        className="suggestion-card-btn suggestion-card-btn--decline"
                        onClick={() => onDecline?.(suggestion.id)}
                        disabled={isPending}
                    >
                        Отклонить
                    </button>
                </div>
            )}
        </div>
    );
};

export default SuggestionCard;
