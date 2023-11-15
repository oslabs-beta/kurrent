import { createSlice } from '@reduxjs/toolkit';
//creating the initial state for our dashboard reducer
const initialState = {
  currentCluster: '',
  clusterView: 'summary',
  addingCluster: false,
  clusters: [],
};

//creating our slice for the dashboard, allowing the user to switch between cluster views
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
//exporting out cluster view slice
export const {
  setCurrentCluster,
  setView,
  setAddCluster,
  setClusters,
  resetDash,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
