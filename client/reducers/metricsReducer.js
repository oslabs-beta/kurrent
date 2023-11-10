/*
 * *************************************
 *
 * @module  authReducer
 * @author MichaelNewbold, jensenrs
 * @date 10/31/2023
 * @description reducer for login/signup
 *
 * ************************************
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    setClusters: (state, action) => {
      state.clusters = action.payload;
    },
    setCurrentCluster: (state, action) => {
      state.currentCluster = action.payload;
    },
    setView: (state, action) => {
      state.clusterView = action.payload;
    },
    setAddCluster: (state, action) => {
      state.addingCluster = action.payload;
    },
    resetMetrics: () => initialState,
  },
});

export const {
  setCurrentCluster,
  setView,
  setAddCluster,
  setClusters,
  resetMetrics,
} = metricsSlice.actions;
export default metricsSlice.reducer;
