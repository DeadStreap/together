import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../store/ThemeContext';

const Header = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => location.pathname === path;
    const isProfileActive = location.pathname === '/profile' || location.pathname.startsWith('/profile/');

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

                <nav className="sidebar-nav" aria-label="Основная навигация">
                    <Link
                        to="/"
                        className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
                        aria-current={isActive('/') ? 'page' : undefined}
                    >
                        Главная
                    </Link>

                    <Link
                        to="/stats"
                        className={`sidebar-link ${isActive('/stats') ? 'active' : ''}`}
                        aria-current={isActive('/stats') ? 'page' : undefined}
                    >
                        Статистика
                    </Link>

                    <Link
                        to="/calendar"
                        className={`sidebar-link ${isActive('/calendar') ? 'active' : ''}`}
                        aria-current={isActive('/calendar') ? 'page' : undefined}
                    >
                        Календарь
                    </Link>

                    <Link
                        to="/activity/together"
                        className={`sidebar-link ${isActive('/activity/together') ? 'active' : ''}`}
                        aria-current={isActive('/activity/together') ? 'page' : undefined}
                    >
                        Вместе
                    </Link>

                    <Link
                        to="/activity/alone"
                        className={`sidebar-link ${isActive('/activity/alone') ? 'active' : ''}`}
                        aria-current={isActive('/activity/alone') ? 'page' : undefined}
                    >
                        Одиночные
                    </Link>

                    <Link
                        to="/activity/create"
                        className={`sidebar-link ${isActive('/activity/create') ? 'active' : ''}`}
                        aria-current={isActive('/activity/create') ? 'page' : undefined}
                    >
                        Добавить
                    </Link>

                    <Link
                        to="/suggestions"
                        className={`sidebar-link ${isActive('/suggestions') || isActive('/suggestions/create') ? 'active' : ''}`}
                        aria-current={isActive('/suggestions') || isActive('/suggestions/create') ? 'page' : undefined}
                    >
                        Предложения
                    </Link>

                    <Link
                        to="/about"
                        className={`sidebar-link ${isActive('/about') ? 'active' : ''}`}
                        aria-current={isActive('/about') ? 'page' : undefined}
                    >
                        О проекте
                    </Link>


                </nav>
            </div>

            <div className="sidebar-bottom">
                <Link
                    to="/profile"
                    className={`sidebar-link sidebar-link-profile ${isProfileActive ? 'active' : ''}`}
                    aria-current={isProfileActive ? 'page' : undefined}
                >
                    Мой профиль
                </Link>
            </div>
        </aside>
    );
};

export { Header };