import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import User from '../components/User.jsx';
import Metrics from '../components/Metrics.jsx';
import ClusterNav from '../components/ClusterNav.jsx';
import '../scss/main.scss';

import { setIsLoggedIn } from '../reducers/authReducer.js';

const Main = () => {
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const response = await fetch('/users/logout');
      if (response.status === 200) {
        dispatch(setIsLoggedIn(false));
        return navigate('/login');
      }
    } catch (err) {
      console.log('error: ', err);
    }
  };
  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, []);

  return (
    <>
      <nav>
        <h1 className='kurrentTitle2'>Kurrent</h1>
        <button id='signOut' onClick={handleLogout}>Sign Out</button>
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
