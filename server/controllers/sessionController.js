const session = require('express-session');
const pool = require('../db');

const crypto = require('crypto');

// Function to generate a session token
function generateSessionToken() {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  console.log('Generated Session Token:', sessionToken);
  return sessionToken;
}

// Function to set the SSID (Session ID) cookie
function setSSIDCookie(res, sessionToken) {
  console.log('Setting SSID Cookie:', sessionToken);
  res.cookie('ssid', sessionToken, {
    httpOnly: true,
  });
}

// Function to start a session
async function startSession(req, sessionData) {
  // Insert the session data into the sessions table
  console.log('Starting session for user:', sessionData.id);
  
  const currentDate = new Date();
  console.log('Session Data:', sessionData);

  try {
    // Attempt to insert the session into the database
    console.log('Before executing query');
    await insertNewSession(sessionData.id, sessionData.sessionToken, currentDate);
    console.log('Session inserted into the database successfully.');

    // Set the session for the user
    req.session.user = {
      id: sessionData.id,
      username: sessionData.username,
      service_addresses: sessionData.service_addresses || [],
    };
    console.log('Session set for the user:', req.session.user);
  } catch (error) {
    console.error('Error in session creation:', error);
    // Handle any errors here
    throw error;
  }
}


//Function to get the active session for a user
async function getActiveSession(userId) {
  console.log('Querying Active Session for User ID:', userId);
    const getSessionQuery = 'SELECT * FROM sessions WHERE user_id = $1 AND session_status = $2';
    const result = await pool.query(getSessionQuery, [userId, 'active']);
    console.log('Active Session Result:', result.rows[0]);
    return result.rows[0];
  }

// Function to insert the session data into the sessions table
async function insertNewSession(userId, sessionToken, currentDate) {
  const insertSessionQuery =
    'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
  await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);
}
// async function insertNewSession(userId, sessionToken, currentDate) {
  
//     const insertSessionQuery =
//     'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
  
//   console.log('Before executing query');
//   try {
//     const result = await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);
//     console.log('After executing query. Result:', JSON.stringify(result.rows, null, 2));
//   } catch (error) {
//     console.error('Error executing query:', error);
//   }
//   console.log('After executing try-catch block');
// }


// Function to verify a user's session
async function verifySession(req, res, next){
    const ssid = req.cookies.ssid;
  
    if (!ssid) {
      return next({
        log: 'Error in verifySession: no ssid',
        status: 401,
        message: { err: 'You must be logged in...' },
      });
    }
  
    const username = req.params.username;
  
    try {
      // Get the user's session token from the database
      const sessionTokenQuery =
        'SELECT session_token FROM sessions INNER JOIN users ON sessions.user_id = users.user_id WHERE users.username = $1 AND session_status = $2';
      const sessionTokenResult = await pool.query(sessionTokenQuery, [username, 'active']);
  
      if (sessionTokenResult.rows.length > 0) {
        const sessionToken = sessionTokenResult.rows[0].session_token;
  
        if (ssid === sessionToken) {
          return next();
        } else {
          return next({
            log: 'Error in verifySession: ssid does not match session token',
            status: 401,
            message: { err: 'You must be logged in...' },
          });
        }
      } else {
        return next({
          log: 'Error in verifySession: no active session for user',
          status: 401,
          message: { err: 'You must be logged in...' },
        });
      }
    } catch (error) {
      return next({
        log: 'Error in sessionController.verifySession middleware',
        status: 500,
        message: 'An error occurred during session verification.',
      });
    }
  };
  
module.exports = { generateSessionToken, setSSIDCookie, 
    startSession, verifySession, getActiveSession, insertNewSession};
