import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import User from '../components/User';
import Metrics from '../components/Metrics';
import ClusterNav from '../components/ClusterNav';
import '../scss/main.scss';
import { resetLog, setIsLoggedIn } from '../reducers/authReducer';
import { resetDash } from '../reducers/dashReducer';
import kurrentLogo from '../assets/kurrentBG2.png';
const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //logout function that will clear the users session and cookies and redirect to the landing page
  const handleLogout = async () => {
    try {
      const response = await fetch('/users/logout');
      if (response.status === 200) {
        dispatch(resetDash());
        dispatch(resetLog());
        return navigate('/');
      }
    } catch (err) {
      console.log('error: ', err);
    }
  };

  return (
    <>
      <nav id='mainNav'>
        <img src={kurrentLogo} alt='Kurrent Logo' className='nav-logo' />
        <button id='signOut' onClick={handleLogout}>
          Sign Out
        </button>
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
