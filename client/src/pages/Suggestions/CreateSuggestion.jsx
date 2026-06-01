import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../store/UserContext';
import { apiReqWithBody } from '../../utils/apiReq';
import { getApiUrl } from '../../config/apiConfig';

function CreateSuggestion() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('anime');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            await apiReqWithBody(getApiUrl('/api/create/suggestion'), 'POST', {
                title: title.trim(),
                category,
                suggested_by: user.id,
                suggested_to: user.partner_id,
            });

            navigate('/suggestions');
        } catch (err) {
            setError(err.message || 'Ошибка при создании предложения');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="tasks-container create-activity-page">
            <div className="content-card content-card--detail activity-form-wrapper">
                <div className="content-card-link">
                    <div className="item-title">Предложить активность</div>

                    <form onSubmit={handleSubmit} className="activity-form">
                        <div className="activity-form-field">
                            <label htmlFor="title">Название</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                disabled={isSaving}
                            />
                        </div>

                        <div className="activity-form-field">
                            <label htmlFor="category">Категория</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={isSaving}
                            >
                                <option value="anime">Аниме</option>
                                <option value="game">Игра</option>
                                <option value="film">Фильм</option>
                                <option value="serial">Сериал</option>
                            </select>
                        </div>

                        {error && (
                            <div className="error-message" style={{ fontSize: 13, marginTop: 4 }}>
                                {error}
                            </div>
                        )}

                        <div className="activity-form-actions">
                            <Link
                                to="/suggestions"
                                className="secondary-button"
                                style={{ textDecoration: 'none' }}
                            >
                                Отмена
                            </Link>
                            <button type="submit" className="primary-button" disabled={isSaving}>
                                {isSaving ? 'Отправка...' : 'Предложить'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateSuggestion;
