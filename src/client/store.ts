import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/authReducer';
import dashReducer from './reducers/dashReducer';
import lineReducer from './reducers/lineReducer';
//Creating our store
const store = configureStore({
  reducer: {
    login: loginReducer,
    dashboard: dashReducer,
    line: lineReducer,
  },
});

export default store;
