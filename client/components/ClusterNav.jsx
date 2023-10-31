import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  setView
} from '../reducers/dashReducer.js';

const ClusterNav = () => {
  const dispatch = useDispatch();

  return (
    <>
      <button onClick={() => dispatch(setView('summary'))}>Cluster Overview</button>
      <button onClick={() => dispatch(setView('producers'))}>Producers</button>
      <button onClick={() => dispatch(setView('consumers'))}>Consumers</button>
    </>
  );
};

export default ClusterNav;