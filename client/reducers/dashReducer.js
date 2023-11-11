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
    resetDash: () => initialState,
  },
});

export const {
  setCurrentCluster,
  setView,
  setAddCluster,
  setClusters,
  resetDash,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
