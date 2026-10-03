import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { BAProvider } from './context/BAContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <BAProvider>
          <App />
        </BAProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
