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
                Задачи
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