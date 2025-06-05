import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { validateEnvironment } from './config/env';

// Validate environment variables before starting the app
try {
  validateEnvironment();
} catch (error) {
  console.error('Application startup failed due to environment configuration:', error);
  // In production, you might want to show a user-friendly error page
  // For now, we'll let the error bubble up
  throw error;
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);