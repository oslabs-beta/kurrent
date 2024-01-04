import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import App from './App';
import store from './store';

// using BrowserRouter to manage the history stack
const routes: RouteObject[] = [
  {
    path: '/*',
    element: App(),
  },
];

const router = createBrowserRouter(routes);
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
