import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import Main from './containers/Main.jsx';
import store from './store.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/main',
    element: <Main />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
