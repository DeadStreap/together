import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../store/ThemeContext';

const Header = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => location.pathname === path;
    const isProfileActive = location.pathname === '/profile';

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">
                            <img src="/heart.svg" alt="Together" className="sidebar-logo-img" />
                        </div>
                        <div className="sidebar-logo-text">
                            Together
                        </div>
                    </div>
                    <button 
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <img src="/moon.svg" alt="Dark theme" className="theme-icon" />
                        ) : (
                            <img src="/sun.svg" alt="Light theme" className="theme-icon sun-icon" />
                        )}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/"
                        className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Главная
                    </Link>

                    <Link
                        to="/stats"
                        className={`sidebar-link ${isActive('/stats') ? 'active' : ''}`}
                    >
                        Статистика
                    </Link>

                    <Link
                        to="/calendar"
                        className={`sidebar-link ${isActive('/calendar') ? 'active' : ''}`}
                    >
                        Календарь
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
                        to="/suggestions"
                        className={`sidebar-link ${isActive('/suggestions') || isActive('/suggestions/create') ? 'active' : ''}`}
                    >
                        Предложения
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