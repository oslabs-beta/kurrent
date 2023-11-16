import React, { useEffect, useState } from 'react';
import User from '../components/User.jsx';
import Metrics from '../components/Metrics.jsx';
import ClusterNav from '../components/ClusterNav.jsx';
import '../scss/main.scss';

const Main = () => {
  return (
    <>
      <div className='main-grid'>
        <div className='user-info'>
          <User />
        </div>
        <div className='cluster-nav'>
          <ClusterNav />
        </div>
        <div className='metricsCont'>
          <h3>Metrics</h3>
          <div className='metrics'>
            <Metrics />
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
