import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

const root = createRoot(document.getElementById('root'));

const AppComponent = (
  <App />
);

const DevAppComponent = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

root.render(
  process.env.NODE_ENV === 'development' ? DevAppComponent : AppComponent
);

