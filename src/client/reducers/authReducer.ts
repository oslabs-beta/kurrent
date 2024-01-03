import { createSlice } from '@reduxjs/toolkit';
import { AuthStateType } from '../../types';
//creating our initial state for authentication
const initialState: AuthStateType = {
  username: '',
  email: '',
  authType: 'login',
  passMatch: false,
  isLoggedIn: false,
  userExists: '',
  isEmailValid: false,
};
//Our login slice logic for login page conditional rendering and authentication
export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    switchAuth: (state) => {
      state.authType === 'login'
        ? (state.authType = 'register')
        : (state.authType = 'login');
    },
    setAuthInfo: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    setPassMatch: (state, action) => {
      state.passMatch = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUserExists: (state, action) => {
      state.userExists = action.payload;
    },
    resetLog: () => initialState,
    setEmailValid: (state, action) => {
      state.isEmailValid = action.payload;
    },
  },
});
//exporting our login slice
export const {
  switchAuth,
  setAuthInfo,
  setPassMatch,
  setIsLoggedIn,
  resetLog,
  setUserExists,
  setEmailValid,
} = loginSlice.actions;
export default loginSlice.reducer;
