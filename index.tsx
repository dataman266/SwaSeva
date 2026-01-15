
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ensure process.env is shimmed for browser environments
if (typeof window !== 'undefined' && !window.process) {
  window.process = { env: {} } as any;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
