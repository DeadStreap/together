import { useState, useEffect } from 'react';
import { useUser } from '../store/UserContext';
import { apiReq, apiReqWithBody } from '../utils/apiReq';
import { getApiUrl } from '../config/apiConfig';
import CommentItem from './CommentItem';

const CommentSection = ({ contentId }) => {
    const { user, isInitializing } = useUser();
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isInitializing) {
            return;
        }
        fetchComments();
    }, [contentId, isInitializing]);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await apiReq(
                getApiUrl(`/api/comments/content/${contentId}?userId=${user.id}`)
            );

            setComments(data || []);
        } catch (err) {
            setError(err.message || 'Ошибка при загрузке комментариев');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddComment = async () => {
        const trimmedText = newCommentText.trim();

        if (trimmedText.length === 0) {
            setError('Комментарий не может быть пустым');
            return;
        }

        if (trimmedText.length > 400) {
            setError('Комментарий не должен превышать 400 символов');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const newComment = await apiReqWithBody(
                getApiUrl('/api/create/comment'),
                'POST',
                {
                    content_item_id: contentId,
                    user_id: user.id,
                    comment_text: trimmedText
                }
            );

            setComments((prev) => [newComment, ...prev]);
            setNewCommentText('');
        } catch (err) {
            setError(err.message || 'Ошибка при добавлении комментария');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditComment = (updatedComment) => {
        setComments((prev) =>
            prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
        );
    };

    const handleDeleteComment = (commentId) => {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    if (isLoading) {
        return <div className="comments-loading">Загрузка комментариев...</div>;
    }

    return (
        <div className="comment-section">
            <div className="comment-section-title">
                Комментарии ({comments.length})
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddComment(); }} className="comment-form">
                <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => {
                        setNewCommentText(e.target.value);
                        if (error) setError(null);
                    }}
                    placeholder="Напишите комментарий..."
                    className="comment-form-input"
                    maxLength={400}
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    className="comment-submit-button"
                    disabled={isSubmitting || !newCommentText.trim()}
                    title="Отправить комментарий"
                >
                    <img src="/send.svg" alt="Отправить" />
                </button>
                {error && <div className="comment-error">{error}</div>}
            </form>

            <div className="comments-list">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={user.id}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                        />
                    ))
                ) : (
                    <div className="comments-empty">
                        Пока нет комментариев
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
