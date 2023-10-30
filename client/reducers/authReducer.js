/*
 * *************************************
 *
 * @module  authReducer
 * @author MichaelNewbold, jensenrs
 * @date 10/28/2023
 * @description reducer for login/signup
 *
 * ************************************
 */

import * as types from '../constants/actionTypes';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  password: '',
  email: '',
  authType: 'login',
  passMatch: false,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    switchAuth: (state) => {
      state.authType === 'login' ? state.authType = 'signup' : state.authType = 'login';
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassMatch: (state, action) => {
      state.password === action.payload ? state.passMatch = true : state.passMatch = false;
    },
  },
});

export const { switchAuth, setUsername, setPassword, setEmail, setPassMatch } = loginSlice.actions;
export default loginSlice.reducer;