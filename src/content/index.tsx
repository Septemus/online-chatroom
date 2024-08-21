import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './index.css';
import App from '@/content/App';
import reportWebVitals from '@/content/reportWebVitals';

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
