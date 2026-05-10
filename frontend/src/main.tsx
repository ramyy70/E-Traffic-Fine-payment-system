import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const originalConsoleError = console.error;
console.error = (...args) => {
  originalConsoleError(...args);
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 9999; width: 100%; background: #ff0000; color: white; padding: 20px; font-family: monospace; white-space: pre-wrap; overflow-y: auto; max-height: 50vh;';
  errDiv.textContent = 'CONSOLE.ERROR:\n\n' + args.map(a => (a && a.stack) ? a.stack : (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ');
  document.body.appendChild(errDiv);
};

window.addEventListener('error', (e) => {
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position: fixed; bottom: 0; left: 0; z-index: 9999; width: 100%; background: #990000; color: white; padding: 20px; font-family: monospace; white-space: pre-wrap; overflow-y: auto; max-height: 50vh;';
  errDiv.textContent = 'UNCAUGHT EXCEPTION:\n\n' + (e.error?.stack || e.message);
  document.body.appendChild(errDiv);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
