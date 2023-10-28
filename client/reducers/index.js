/*
 * *************************************
 *
 * @module  index.js
 * @author MichaelNewbold, jensenrs
 * @date 10/28/2023
 * @description simply a place to combine reducers
 *
 * ************************************
 */

import { combineReducers } from "@reduxjs/toolkit";

// import all reducers here
import authReducer from './authReducer';

const reducers = combineReducers({
  auth: authReducer,
});

export default reducers;