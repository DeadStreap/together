import { Routes, Route } from 'react-router-dom';

import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

import Profile from './pages/Profile/Profile';
import ProfileEdit from './pages/Profile/ProfileEdit';
import Authorization from './pages/Authorization';
import Registration from './pages/Registration';

import Activities from './pages/Activity/Activities';
import ActivityById from './pages/Activity/ActivityById';
import ActivitiesTogether from './pages/Activity/ActivitiesTogether';
import ActivitiesAlone from './pages/Activity/ActivitiesAlone';
import ActivitiesPartner from './pages/Activity/ActivitiesPartner';
import CreateActivity from './pages/Activity/CreateActivity';
import ActivityEdit from './pages/Activity/ActivityEdit';


import { Header } from './components/Header'


function App() {

  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Activities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/authorization" element={<Authorization />} />
          <Route path="/register" element={<Registration />} />

          <Route path="/activity/:ActivityId" element={<ActivityById />} />
          <Route path="/activity/:ActivityId/edit" element={<ActivityEdit />} />
          <Route path="/activity" element={<Activities />} />
          <Route path="/activity/alone" element={<ActivitiesAlone />} />
          <Route path="/activity/together" element={<ActivitiesTogether />} />
          <Route path="/activity/partner/:userId" element={<ActivitiesPartner />} />
          <Route path="/activity/create" element={<CreateActivity />} />

          <Route path="/about" element={<AboutPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

