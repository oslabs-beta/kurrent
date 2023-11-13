import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../scss/login.scss';

import {
  switchAuth,
  setEmail,
  setPassword,
  setUsername,
  setPassMatch,
  setIsLoggedIn,
} from '../reducers/authReducer.js';

import { setClusters } from '../reducers/dashReducer.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);

  // useEffect(() => {
  //   async function verifySession() {
  //     const response = await fetch('/users');
  //     if (response.status === 200 || response.status === 201) {
  //       const username = await response.json()
  //       dispatch(setIsLoggedIn(true));
  //       dispatch(setUsername(username))
  //       navigate('/');
  //     }
  //   }
  //   verifySession();
  //   navigate('/main')
  // }, []);

  let userExists = false;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    userExists = false;
    const loginEndpoint = `/users/${login.authType}`;
    const postBody = {};
    postBody.username = login.username;
    postBody.password = login.password;
    if (login.authType === 'register') {
      if (login.username === '') {
        postBody.username = login.email.split('@')[0];
        dispatch(setUsername(postBody.username));
      }
      postBody.email = login.email;
    }
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
              className='username'
              placeholder='username / email'
              autoComplete='off'
              onChange={(e) => dispatch(setUsername(e.target.value))}
            />
            <br />
            <input
              type='password'
              className='password'
              placeholder='password'
              autoComplete='off'
              onChange={(e) => dispatch(setPassword(e.target.value))}
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
              className='username'
              placeholder='email'
              autoComplete='off'
              onChange={(e) => dispatch(setEmail(e.target.value))}
            />
            <br />
            <input
              type='text'
              className='username'
              placeholder='username (optional)'
              autoComplete='off'
              onChange={(e) => dispatch(setUsername(e.target.value))}
            />
            {userExists && <p>User already exists</p>}
            <br />
            <input
              type='password'
              className='password'
              placeholder='password'
              autoComplete='off'
              onChange={(e) => dispatch(setPassword(e.target.value))}
            />
            <input
              type='password'
              className='password'
              placeholder='confirm password'
              autoComplete='off'
              onChange={(e) => dispatch(setPassMatch(e.target.value))}
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
