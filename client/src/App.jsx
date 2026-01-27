import { Routes, Route, Link } from 'react-router-dom';

import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

import Activities from './pages/Activity/Activities';
import ActivityById from './pages/Activity/ActivityById';

import { Header } from './components/Header'


function App() {

  return (
    <div className="app-container">
      <Header />

      <Routes>
        <Route path="/" element={<Activities />} />
        <Route path="/profile" element={<Activities />} />
        <Route path="/authorization" element={<Activities />} />
        <Route path="/register" element={<Activities />} />


        <Route path="/together_activity" element={<Activities />} />
        <Route path="/activity/:ActivityId" element={<ActivityById />} />
        <Route path="/activity" element={<Activities />} />

        <Route path="/activity/create" element={<Activities />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;

