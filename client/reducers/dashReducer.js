/*
 * *************************************
 *
 * @module  authReducer
 * @author MichaelNewbold, jensenrs
 * @date 10/30/2023
 * @description reducer for login/signup
 *
 * ************************************
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentCluster: '',
  clusterView: 'summary',
  addingCluster: false,
  clusters: [],
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setClusters: (state, action) => {
      state.clusters = action.payload
    },
    setCurrentCluster: (state, action) => {
      state.currentCluster = action.payload
    },
    setView: (state, action) => {
      state.clusterView = action.payload;
    },
    setAddCluster: (state, action) => {
      action.payload === 'open' ? addingCluster = true : addingCluster = false;
    },
  },
});

export const { setCurrentCluster, setView, setAddCluster, setClusters } = dashboardSlice.actions;
export default dashboardSlice.reducer;