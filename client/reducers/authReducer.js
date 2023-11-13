import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  email: '',
  authType: 'login',
  passMatch: false,
  isLoggedIn: false,
};

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
      state.authType === 'register'
        ? (state.email = action.payload.email)
        : (state.email = state.email);
    },
    setPassMatch: (state, action) => {
      state.passMatch = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    resetLog: () => initialState,
  },
});

export const {
  switchAuth,
  setAuthInfo,
  setPassMatch,
  setIsLoggedIn,
  resetLog,
} = loginSlice.actions;
export default loginSlice.reducer;
