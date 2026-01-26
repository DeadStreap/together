import { Routes, Route, Link, useLocation } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import AboutPage from './pages/AboutPage';

function App() {
  const location = useLocation(); // Теперь работает!

  return (
    <div className="app-container">
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

      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}

export default App;

