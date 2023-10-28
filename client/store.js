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
import loginReducer from './reducers/authReducer'

const store = configureStore({
  reducer: {
    login: loginReducer
  },
});

export default store;