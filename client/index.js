import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.jsx';
import Dashboard from './Dashboard.jsx';
import store from './store.js';
import Main from './containers/Main.jsx';
//Creating the router componenet to switch between the app


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Dashboard />
  </Provider>
);
