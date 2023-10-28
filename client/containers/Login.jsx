import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setUsername, setPassword, setAuthenticated } from '';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [auth, setAuth] = useState('login');
  const [matchPassword, setMatchPassword] = useState(true);
  const [entry, setEntry] = useState(true);

  return (
    <>
      <div className='login-container'>
        <form action='' className='submit-form'>
          <input
            type='text'
            className='username'
            placeholder='username'
            autoComplete='off'
          />
          <br />
          <input
            type='text'
            className='password'
            placeholder='password'
            autoComplete='off'
          />
          <button id='login' className='loginBtns' type='submit'>
            Login
          </button>
          <button id='signup' className='loginBtns' type='submit'>
            Sign Up
          </button>
        </form>
      </div>
      <Link to='/main'>Dashboard</Link>
    </>
  );
};

export default Home;
