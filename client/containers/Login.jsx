import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../scss/login.scss';
import metricsDemoGif from '../assets/Metricsdemo.gif';
import savingPortGif from '../assets/Addingport.gif';
//importing our reducers
import {
  switchAuth,
  setAuthInfo,
  setPassMatch,
  setIsLoggedIn,
  setUserExists,
  setEmailValid,
} from '../reducers/authReducer.js';

import { setClusters } from '../reducers/dashReducer.js';
//Login logic
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
  //checking for existing sessions to redirect users straight to the dashboard
  //can set up conditional for checking if a cookie with name ssid exists before running the verifySession to reduce calls to the server
  useEffect(() => {
    async function verifySession() {
      try {
        const response = await fetch('/users');
        if (response.status === 200) {
          dispatch(setIsLoggedIn(true));
          navigate('/dashboard');
          const authData = await response.json();
          dispatch(setAuthInfo(authData));
          dispatch(setClusters(authData.service_addresses));
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
      if (login.username == '') {
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
          }
          dispatch(setAuthInfo(loginData));
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
  //Regex expression to check if the provided email is valid or not
  const validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //We dispatch either a true or false value based off our validEmailRegex test
  const handleEmailChange = (e) => {
    const email = e.target.value;
    dispatch(setEmailValid(validEmailRegex.test(email)));
  };
  //login page
  // If the authType is currently 'login' we render the landing page
  if (login.authType === 'login') {
    return (
      <>
        <nav id='loginNav'>
          <div className='loginNavRef'>
            <a href='#home' className='navTag'>
              Home
            </a>
            <a href='#about' className='navTag'>
              About
            </a>
            <a href='#team' className='navTag'>
              Team
            </a>
          </div>
        </nav>
        <div className='loginPageContainer' id='home'>
          <h1 id='title'>Kurrent</h1>
          <div className='login-container'>
            {/* <h1 id='titlePage'>Log in</h1> */}
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
            <h1 className='aboutTitle'>About Kurrent</h1>
          </span>
          <a id='Github' href='https://github.com/oslabs-beta/kurrent'>
            Check out our GitHub!
          </a>
          <span className='demoSpan'>
            <div className='aboutText'>
              <h4>
                Kurrent is an open-source project providing real-time Apache
                Kafka metrics data monitoring. Our tool is dedicated to
                providing developers an easy and intuitive means for monitoring
                the health and throughput of their Kafta cluster.
              </h4>
              <hr />
              <p className='aboutPTag'>
                Simply create an account, add and select your port number, and
                tab between the different display metrics.
              </p>
              <hr />
              <img src={savingPortGif} alt='' />
            </div>
            <div className='aboutImg'>
              <h4>
                Real-Time Metrics: View your metrics in real-time with Kurrents
                intuitive dashboard charts to monitor the ongoing health of your
                cluster through testing or real-time use.
              </h4>
              <hr />
              <img
                src={metricsDemoGif}
                alt='metrics demo gif'
                id='metricsGif'
              />
            </div>
          </span>
        </div>
        <div id='team'>
          <div className='loginSpan'>
            <h1 className='teamHeader'>Meet the team!</h1>
          </div>
          <div className='teamContainer'>
            <div className='memberCard'>
              <div className='memberInfo'>
                <h3 className='memberName'>Garrett Byrne</h3>
                <a
                  href='https://www.linkedin.com/in/garrett-byrne12/'
                  className='socials'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                  </svg>
                </a>
                <a href='https://github.com/G-Byrne' className='socials'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                </a>
              </div>
            </div>
            <div className='memberCard'>
              <div className='memberInfo'>
                <h3 className='memberName'>Jensen Schmidt</h3>
                <a
                  href='https://www.linkedin.com/in/jensen-schmidt/'
                  className='socials'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                  </svg>
                </a>
                <a href='https://github.com/jensenrs' className='socials'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                </a>
              </div>
            </div>
            <div className='memberCard'>
              <div className='memberInfo'>
                <h3 className='memberName'>Michael Newbold</h3>
                <a
                  href='https://www.linkedin.com/in/mjnewbold/'
                  className='socials'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                  </svg>
                </a>
                <a href='https://github.com/MichaelNewbold' className='socials'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                </a>
              </div>
            </div>
            <div className='memberCard'>
              <div className='memberInfo'>
                <h3 className='memberName'>Swarna Muralidharan</h3>
                <a
                  href='https://www.linkedin.com/in/swarna-muralidharan-52a57b29b'
                  className='socials'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                  </svg>
                </a>
                <a href='https://github.com/swarna2072' className='socials'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  //signup page
  //if the user goes to the signup page:
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
            {!login.passMatch && (
              <p className='inputInvalid'>Passwords must match</p>
            )}
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
