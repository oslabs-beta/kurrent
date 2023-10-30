/*
 * *************************************
 *
 * @module  Login.jsx
 * @author MichaelNewbold, jensenrs
 * @date 10/28/2023
 * @description Login container
 *
 * ************************************
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../scss/login.scss';

import {
  switchAuth,
  setEmail,
  setPassword,
  setUsername,
  setPassMatch,
} from '../reducers/authReducer.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);

  useEffect(() => {
    async function verifySession() {
      const response = await fetch('/api/users');
      if (response.status === 200) {
        navigate('/main');
      }
    }
    verifySession();
    navigate('/main')
  }, []);

  let userExists = false;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    userExists = false;
    const loginEndpoint = `/api/users/${login.authType}`;
    const postBody = {};
    postBody.username = login.username;
    postBody.password = login.password;
    if (login.authType === 'register') {
      if (login.username === '') {
        postBody.username = login.email.split('@')[0];
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
        if (response.status === 201) {
          navigate('/main');
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
      <>
        <h1 className='kurrentTitle'>Kurrent</h1>
        <div className='login-container'>
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
      </>
    );
  }
  //signup page
  else {
    return (
      <>
        <h1 className='signUpTitle'>Sign Up</h1>
        <div className='login-container'>
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
          </form>
        </div>
      </>
    );
  }
};

export default Login;
