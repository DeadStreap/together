import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/reset.css';
import './index.css';
import App from './App';
import { UserProvider } from './store/UserContext';
import { ThemeProvider } from './store/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);

