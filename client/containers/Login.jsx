import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { switchAuth, setEmail, setPassword, setUsername} from '../reducers/authReducer.js'


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login)


  useEffect(() => {
    async function verifySession() {
      const response = await fetch('/users');
      if (response.status === 200) {
        navigate('/main')
      }
    }
    verifySession();
  }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const loginEndpoint = `/users/${login.authType}`;
    const username = login.username
    const password = login.password
    let confirmPassword;
    if (login.authType === 'signup') confirmPassword = e.target.confirmPassword.value
  }


  if (authType === 'login') {
    return (
      <>
        <div className='login-container'>
          <form action='' className='submit-form'>
            <input
              type='text'
              className='username'
              placeholder='username'
              autoComplete='off'
              onChange={() => (setUsername = e.target.value)}
            />
            <br />
            <input
              type='text'
              className='password'
              placeholder='password'
              autoComplete='off'
              onChange={() => (setPassword = e.target.value)}
            />
            <button
              id='login'
              className='loginBtns'
              type='submit'
              onClick={() => dispatch(handleFormSubmit())}
            >
              Login
            </button>
            <button
              id='signup'
              className='loginBtns'
              type='submit'
              onClick={() => dispatch(handleFormSubmit())}
            >
              Sign Up
            </button>
          </form>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className='login-container'>
          <form action='' className='submit-form'>
            <input
              type='text'
              className='username'
              placeholder='username'
              autoComplete='off'
              onChange={() => (setUsername = e.target.value)}
            />
            <br />
            <input
              type='text'
              className='password'
              placeholder='password'
              autoComplete='off'
              onChange={() => (setPassword = e.target.value)}
            />
            <button
              id='login'
              className='loginBtns'
              type='submit'
              onClick={() => dispatch(handleFormSubmit())}
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
