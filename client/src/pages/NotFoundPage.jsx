import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

const NotFoundPage = () => {
    usePageTitle('Страница не найдена');
    return (
        <div className="tasks-container">
            <div className="content-card content-card--detail activity-form-wrapper">
                <div className="content-card-link">
                    <div className="item-title" style={{ textAlign: 'center', marginBottom: 16 }}>
                        Страница не найдена
                    </div>
                    <p
                        style={{
                            fontSize: 14,
                            color: "#6b7280",
                            marginBottom: 20,
                            textAlign: 'center',
                        }}
                    >
                        К сожалению, такой страницы не существует.
                    </p>
                    <div className="activity-form-actions" style={{ justifyContent: 'center' }}>
                        <Link to="/" className="primary-button">
                            Вернуться на главную
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
