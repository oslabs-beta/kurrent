/**
 * ************************************
 *
 * @module  store.js
 * @author MichaelNewbold, jensenrs
 * @date 10/28/2023
 * @description Redux 'single source of truth'
 *
 * ************************************
 */

import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/authReducer.js';
import dashReducer from './reducers/dashReducer.js';
import metricsReducer from './reducers/metricsReducer.js';
import lineReducer from './reducers/lineReducer.js';

const store = configureStore({
  reducer: {
    login: loginReducer,
    dashboard: dashReducer,
    metrics: metricsReducer,
    line: lineReducer
  },
});

export default store;