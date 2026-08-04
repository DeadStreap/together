import { useState } from 'react';
import { formatDate } from '../utils/dateFormat';
import { getColorGradient, getColorShadow } from '../utils/colorGradients';
import { getColorValueByName } from '../utils/colorUtils';
import { apiReqWithBody } from '../utils/apiReq';
import { getApiUrl } from '../config/apiConfig';
import ConfirmDialog from './ConfirmDialog';

const CommentItem = ({ comment, currentUserId, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.comment_text);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isOwner = comment.user_id === currentUserId;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditText(comment.comment_text);
        setIsEditing(false);
        setError(null);
    };

    const handleSave = async () => {
        const trimmedText = editText.trim();

        if (trimmedText.length === 0) {
            setError('Комментарий не может быть пустым');
            return;
        }

        if (trimmedText.length > 400) {
            setError('Комментарий не должен превышать 400 символов');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            const updatedComment = await apiReqWithBody(
                getApiUrl('/api/update/comment'),
                'PUT',
                {
                    id: comment.id,
                    user_id: currentUserId,
                    comment_text: trimmedText
                }
            );

            onEdit(updatedComment);
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Ошибка при сохранении');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isSaving) {
                handleSave();
            }
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            setError(null);
            await apiReqWithBody(
                getApiUrl('/api/delete/comment'),
                'DELETE',
                {
                    id: comment.id,
                    user_id: currentUserId
                }
            );

            onDelete(comment.id);
            setShowDeleteConfirm(false);
        } catch (err) {
            setError(err.message || 'Ошибка при удалении');
            setIsDeleting(false);
        }
    };

    const avatarInitials = comment.username
        ? comment.username
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
        : '?';

    const colorValue = getColorValueByName(comment.color || 'Purple');

    return (
        <>
            <div className="comment-item">
                <div
                    className="comment-avatar"
                    style={{
                        background: getColorGradient(colorValue),
                        boxShadow: getColorShadow(colorValue)
                    }}
                >
                    {comment.icon ? (
                        <img
                            src={`/profileIcons/${comment.icon}.png`}
                            alt={comment.icon}
                            className="comment-avatar-icon"
                        />
                    ) : (
                        avatarInitials
                    )}
                </div>

                <div className="comment-content">
                    <div className="comment-header">
                        <span className="comment-author">{comment.username || 'Аноним'}</span>
                        <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>

                    {isEditing ? (
                        <div className="comment-edit-form">
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={handleEditKeyDown}
                                className="comment-edit-input"
                                maxLength={400}
                                disabled={isSaving}
                                autoFocus
                            />
                            {error && (
                                <div className="comment-error">{error}</div>
                            )}
                            <div className="comment-edit-actions">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="secondary-button"
                                    disabled={isSaving}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="primary-button"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="comment-text">{comment.comment_text}</div>
                    )}

                    {isOwner && !isEditing && (
                        <div className="comment-actions">
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="comment-action-button"
                                title="Редактировать"
                            >
                                <img src="/edit.svg" alt="Редактировать" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="comment-action-button comment-action-delete"
                                title="Удалить"
                            >
                                <img src="/trash.svg" alt="Удалить" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <ConfirmDialog
                    title="Удалить комментарий?"
                    text={comment.comment_text.length > 100
                        ? comment.comment_text.slice(0, 100) + '...'
                        : comment.comment_text}
                    subtext="Это действие нельзя отменить"
                    confirmLabel="Удалить"
                    pendingLabel="Удаление..."
                    danger
                    isPending={isDeleting}
                    onCancel={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
};

export default CommentItem;
