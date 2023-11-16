import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import User from '../components/User.jsx';
import Metrics from '../components/Metrics.jsx';
import ClusterNav from '../components/ClusterNav.jsx';
import '../scss/main.scss';
import { resetLog, setIsLoggedIn } from '../reducers/authReducer.js';
import { resetDash } from '../reducers/dashReducer.js';
import kurrentLogo from '../assets/kurrentBG2.png';
const Main = () => {

  return (
    <>
      <nav id='mainNav'>
        <img src={kurrentLogo} alt='Kurrent Logo' className='nav-logo' />
        {/* <button id='signOut' onClick={handleLogout}>
          Sign Out
        </button> */}
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
