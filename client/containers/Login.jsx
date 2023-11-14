import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../scss/login.scss';

import {
  switchAuth,
  setAuthInfo,
  setPassMatch,
  setIsLoggedIn,
  setUserExists,
  setEmailValid,
} from '../reducers/authReducer.js';

import { setClusters } from '../reducers/dashReducer.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);
  // Checking if password and confirm password match
  const confirmPass = (e) => {
    let password = document.getElementById('password').value;
    if (e.target.value === password) dispatch(setPassMatch(true));
    else dispatch(setPassMatch(false));
  };

  useEffect(() => {
    async function verifySession() {
      try {
        const response = await fetch('/users');
        if (response.status === 200) {
          dispatch(setIsLoggedIn(true));
          dispatch('/dashboard');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('An error occurred:', err);
      }
    }
    verifySession();
  }, []);

  // Performs fetch request to user database to handle login/registration logic
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(setUserExists(''));
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    const loginEndpoint = `/users/${login.authType}`;
    const postBody = { username, password };
    if (login.authType === 'register') {
      let email = document.getElementById('email').value;
      postBody.email = email;
      if (login.username === '') {
        postBody.username = email.split('@')[0];
      }
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
            dispatch(setClusters(loginData.service_addresses));
            dispatch(setAuthInfo(loginData));
          }
          dispatch(setIsLoggedIn(true));
          navigate('/dashboard');
        } else if (response.status === 400) {
          dispatch(setUserExists('User Already Exists'));
        } else if (response.status === 401) {
          dispatch(setUserExists('Invalid Username or Password'));
        }
      } catch (error) {
        return `Error in login attempt. Check username or password. ${error}`;
      }
    }
  };

  const validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const handleEmailChange = (e) => {
    const email = e.target.value;
    dispatch(setEmailValid(validEmailRegex.test(email)));
  };
  //login page
  if (login.authType === 'login') {
    return (
      <>
        <nav id='loginNav'>
          <a href='#home' className='navTag'>
            Back to Home
          </a>
          <a href='#about' className='navTag'>
            About Kurrent
          </a>
          <a href='#team' className='navTag'>
            Meet the team
          </a>
        </nav>
        <div className='loginPageContainer' id='home'>
          <div className='login-container'>
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
              {login.userExists !== '' && <p>{login.userExists}</p>}
              <a
                id='signup'
                className='loginBtns'
                type='submit'
                onClick={() => {
                  dispatch(switchAuth());
                  dispatch(setUserExists(''));
                }}
              >
                Don't have an Account?
              </a>
            </form>
          </div>
        </div>
        <div id='about'>
          <span className='aboutSpan'>
            <h1 className='aboutTitle'>Why Kurrent?</h1>
          </span>
          <span className='demoSpan'>
            <div className='aboutText'>
              <h4>
                Kurrent is a premier visualization tool that empowers users to view their Kafka clusters in real time.
              </h4>
              <p>
                Simply create an account, add your port number, and tab between the different display metrics.
              </p>
            </div>
            <div className='aboutImg'></div>
          </span>
        </div>
        <div id='team'>
          <span className='loginSpan'>
            <h1 className='teamHeader'>Meet the team!</h1>
          </span>
          <div className='teamContainer'>
            <div className='memberCard'>
              {/* image? */}
              <span className='cardSpan'>
                <h3 className='teamHeader'>Garrett Byrne</h3>
              </span>
              <a href='' className='socials'>
                LinkedIn
              </a>
              <a href='' className='socials'>
                Github
              </a>
            </div>
            <div className='memberCard'>
              {/* image? */}
              <span className='cardSpan'>
                <h3 className='teamHeader'>Jensen Schmidt</h3>
              </span>
              <a href='' className='socials'>
                LinkedIn
              </a>
              <a href='' className='socials'>
                Github
              </a>
            </div>
            <div className='memberCard'>
              {/* image? */}
              <span className='cardSpan'>
                <h3 className='teamHeader'>Michael Newbold</h3>
              </span>
              <a href='' className='socials'>
                LinkedIn
              </a>
              <a href='' className='socials'>
                Github
              </a>
            </div>
            <div className='memberCard'>
              {/* image? */}
              <span className='cardSpan'>
                <h3 className='teamHeader'>Swarna Muralidharan</h3>
              </span>
              <a href='' className='socials'>
                LinkedIn
              </a>
              <a href='' className='socials'>
                Github
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }
  //signup page
  else {
    return (
      <div className='loginPageContainer'>
        <div className='signUp-container'>
          <h1 className='signUpTitle'>Sign Up</h1>
          <form action='' className='submit-form' id='signUpForm'>
            {login.userExists !== '' && <p>{login.userExists}</p>}
            <input
              type='text'
              id='email'
              className='username'
              placeholder='email'
              autoComplete='off'
              onChange={handleEmailChange}
              required
            />
            {!login.isEmailValid && (
              <p className='inputInvalid'>Invalid email address</p>
            )}
            <input
              type='text'
              id='username'
              className='username'
              placeholder='username (optional)'
              autoComplete='off'
              required
            />
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
              disabled={!(login.passMatch && login.isEmailValid)}
            >
              Create Account
            </button>
            <a
              id='routeLogin'
              className='loginBtns'
              type='submit'
              onClick={() => {
                dispatch(switchAuth());
                dispatch(setUserExists(''));
              }}
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
