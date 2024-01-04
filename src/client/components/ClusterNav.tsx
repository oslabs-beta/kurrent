import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setView } from '../reducers/dashReducer';
import { StateStoreType } from '../../types';

const ClusterNav = () => {
  const dispatch = useDispatch();
  const clusterView = useSelector((state: StateStoreType) => state.dashboard.clusterView);
  //Render the different cluster view options
  //Dynamically disable buttons if they are the currently selected clusterView
  return (
    <div id='clusterButtonContainer'>
      <button
        id='clusterButtons'
        onClick={() => dispatch(setView('summary'))}
        disabled={clusterView === 'summary'}
      >
        Cluster Overview
      </button>
      <button
        id='clusterButtons'
        onClick={() => dispatch(setView('producers'))}
        disabled={clusterView === 'producers'}
      >
        Producers
      </button>
      <button
        id='clusterButtons'
        onClick={() => dispatch(setView('consumers'))}
        disabled={clusterView === 'consumers'}
      >
        Consumers
      </button>
    </div>
  );
};

export default ClusterNav;
