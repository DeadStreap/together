import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;
    const isProfileActive = location.pathname === '/profile';

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <img src="/heart.svg" alt="Together" className="sidebar-logo-img" />
                    </div>
                    <div className="sidebar-logo-text">
                        Together
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/"
                        className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Главная
                    </Link>

                    <Link
                        to="/activity/together"
                        className={`sidebar-link ${isActive('/activity/together') ? 'active' : ''}`}
                    >
                        Вместе
                    </Link>

                    <Link
                        to="/activity/alone"
                        className={`sidebar-link ${isActive('/activity/alone') ? 'active' : ''}`}
                    >
                        Одиночные
                    </Link>

                    <Link
                        to="/activity/create"
                        className={`sidebar-link ${isActive('/activity/create') ? 'active' : ''}`}
                    >
                        Добавить
                    </Link>

                    <Link
                        to="/about"
                        className={`sidebar-link ${isActive('/about') ? 'active' : ''}`}
                    >
                        О проекте
                    </Link>
                </nav>
            </div>

            <div className="sidebar-bottom">
                <Link
                    to="/profile"
                    className={`sidebar-link sidebar-link-profile ${isProfileActive ? 'active' : ''}`}
                >
                    Мой профиль
                </Link>
            </div>
        </aside>
    );
};

export { Header };