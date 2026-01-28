import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    return(
    <header>
        <nav>
            <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
                Главная
            </Link>

            <Link
                to="/activity/together"
                className={`nav-link ${location.pathname === '/activity/together' ? 'active' : ''}`}
            >
                Вместе
            </Link>

            <Link
                to="/activity/alone"
                className={`nav-link ${location.pathname === '/activity/alone' ? 'active' : ''}`}
            >
                Одиночные
            </Link>

            <Link
                to="/activity/create"
                className={`nav-link ${location.pathname === '/activity/addContent' ? 'active' : ''}`}
            >
                + Добавить
            </Link>

            <Link
                to="/profile"
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
                Профиль
            </Link>

            <Link
                to="/about"
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
                О проекте
            </Link>
        </nav>
    </header>
    )
}

export { Header }