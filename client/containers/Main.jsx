import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import User from '../components/User.jsx';
import Metrics from '../components/Metrics.jsx';
import ClusterNav from '../components/ClusterNav.jsx';
import '../scss/main.scss';

const Main = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const resonse = await fetch('/api/users/logout');
      if (response.status === 200) {
        navigate('/');
      }
    } catch (err) {
      console.log('error: ', err);
    }
  };

  return (
    <>
      <nav>
        <h1>Kurrent</h1>
        <button onClick={handleLogout}>Sign Out</button>
      </nav>
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
