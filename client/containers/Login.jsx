import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../scss/login.scss';

import {
  switchAuth,
  setAuthInfo,
  setPassMatch,
  setIsLoggedIn,
} from '../reducers/authReducer.js';

import { setClusters } from '../reducers/dashReducer.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);

  const confirmPass = (e) => {
    let password = document.getElementById('password').value;
    if (e.target.value === password) dispatch(setPassMatch(true));
  };
  let userExists = false;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    userExists = false;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    const loginEndpoint = `/users/${login.authType}`;
    const postBody = { username, password };
    if (login.authType === 'register') {
      let email = document.getElementById('email').value;
      let confPass = document.getElementById('confPass').value;
      postBody.email = email;
      if (login.username === '') {
        postBody.username = email.split('@')[0];
      }
    }
    dispatch(setAuthInfo(postBody));
    if (login.passMatch || login.authType === 'login') {
      try {
        const response = await fetch(loginEndpoint, {
          method: 'POST',
          body: JSON.stringify(postBody),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const loginData = await response.json();
        if (response.status === 200) {
          if (login.authType === 'login') {
            console.log('setting cluster to ', loginData.service_addresses);
            dispatch(setClusters(loginData.service_addresses));
          }
          dispatch(setIsLoggedIn(true));
          navigate('/');
        } else if (response.status === 400) {
          userExists = true;
        }
      } catch (error) {
        return `Error in login attempt. Check usename or password. ${error}`;
      }
    }
  };
  //login page
  if (login.authType === 'login') {
    return (
      <div className='loginPageContainer'>
        <div className='login-container'>
          <h1 className='kurrentTitle'>Kurrent</h1>
          <form action='' className='submit-form'>
            <input
              type='text'
              id='username'
              className='username'
              placeholder='username / email'
              autoComplete='off'
            />
            <br />
            <input
              type='password'
              id='password'
              className='password'
              placeholder='password'
              autoComplete='off'
            />
            <button
              id='login'
              className='loginBtns'
              type='submit'
              onClick={handleFormSubmit}
            >
              Login
            </button>
            <a
              id='signup'
              className='loginBtns'
              type='submit'
              onClick={() => dispatch(switchAuth())}
            >
              Don't have an Account?
            </a>
          </form>
        </div>
      </div>
    );
  }
  //signup page
  else {
    return (
      <div className='loginPageContainer'>
        <div className='signUp-container'>
          <h1 className='signUpTitle'>Sign Up</h1>
          <form action='' className='submit-form' id='signUpForm'>
            <input
              type='text'
              id='email'
              className='username'
              placeholder='email'
              autoComplete='off'
            />
            <br />
            <input
              type='text'
              id='username'
              className='username'
              placeholder='username (optional)'
              autoComplete='off'
            />
            {userExists && <p>User already exists</p>}
            <br />
            <input
              type='password'
              id='password'
              className='password'
              placeholder='password'
              autoComplete='off'
            />
            <input
              type='password'
              id='confPass'
              className='password'
              placeholder='confirm password'
              autoComplete='off'
              onChange={(e) => confirmPass(e)}
            />
            <button
              id='login'
              className='loginBtns'
              type='submit'
              onClick={handleFormSubmit}
              disabled={!login.passMatch}
            >
              Create Account
            </button>
            <a
              id='routeLogin'
              className='loginBtns'
              type='submit'
              onClick={() => dispatch(switchAuth())}
            >
              Back to Login
            </a>
          </form>
        </div>
      </div>
    );
  }
};

export default Login;
