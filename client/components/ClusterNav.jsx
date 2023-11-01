import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  setView
} from '../reducers/dashReducer.js';

const ClusterNav = () => {
  const dispatch = useDispatch();

  return (
    <div id='clusterButtonContainer'>
      <button id='clusterButtons' onClick={() => dispatch(setView('summary'))}>Cluster Overview</button>
      <button id='clusterButtons' onClick={() => dispatch(setView('producers'))}>Producers</button>
      <button id='clusterButtons' onClick={() => dispatch(setView('consumers'))}>Consumers</button>
    </div>
  );
};

export default ClusterNav;