import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/authReducer.js';
import dashReducer from './reducers/dashReducer.js';
import lineReducer from './reducers/lineReducer.js';

const store = configureStore({
  reducer: {
    login: loginReducer,
    dashboard: dashReducer,
    line: lineReducer
  },
});

export default store;