import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global guard against unhandled JSON parse exceptions on static hosting
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (reason.includes('is not valid JSON') || reason.includes('Unexpected token')) {
      console.warn('[Global Error Guard] Safely caught unhandled JSON rejection:', reason);
      event.preventDefault(); // Prevent crash or browser error popup
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (msg.includes('is not valid JSON') || msg.includes('Unexpected token')) {
      console.warn('[Global Error Guard] Safely caught global JSON error:', msg);
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
