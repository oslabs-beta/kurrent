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
    console.error('Error in session creation:', error.message);
     // Handle specific error cases and provide meaningful error messages
     if (error.code === 'unique_violation') {
      return Promise.reject(new Error('Session already exists for this user.'));
    }
    // Handle other cases as needed
    return Promise.reject(new Error('Error creating session.'));
  }
}


//Function to get the active session for a user
async function getActiveSession(userId) {
  try{
    console.log('Querying Active Session for User ID:', userId, 'active');
    const getSessionQuery = 'SELECT * FROM sessions WHERE user_id = $1 AND session_status = $2';
    const result = await pool.query(getSessionQuery, [userId, 'active']);
    console.log('Active Session Result:', result.rows[0]);
    return result.rows[0];
  }catch(error){
    console.error('Error getting active session:', error);
    throw error; // Propagate the error to the caller
  }
  
}

// Function to insert the session data into the sessions table
async function insertNewSession(userId, sessionToken, currentDate) {
  try{
    const insertSessionQuery =
    'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
  await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);
  }
  catch(error){
    console.error('Error inserting new session:', error);
    throw error; // Propagate the error to the caller
  }
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

// const session = require('express-session');
// const pool = require('../db');

// const sessionController = {};

// sessionController.startSession = async (req, res, next) => {
//   const sessionToken = res.locals.ssid;
//   const { username } = req.body;
//   try {
//     // find user info
//     const userQuery =
//       'SELECT user_id, password, service_addresses FROM users WHERE username = $1';
//     const userResult = await pool.query(userQuery, [username]);
//     const user = userResult.rows[0];
//     const userId = user.user_id;
//     const currentDate = new Date();

//     // check if user already has a session
//     const activeSessionQuery =
//       "SELECT session_token FROM sessions WHERE user_id = $1 AND session_status = 'active'";
//     const activeSessionResult = await pool.query(activeSessionQuery, [userId]);
//     if (activeSessionResult.rows.length > 0) {
//       const sessionToken = activeSessionResult.rows[0].session_token;
//       // reset ssid cookie to current sessionToken
//       res.cookie('ssid', sessionToken, { httpOnly: true });
//       // Create and set session for the new user
//       req.session.user = {
//         id: user.userId,
//         username: username,
//         service_addresses: user.service_addresses || [],
//       };
//       // save user info for response return
//       res.locals.user = {
//         username: username,
//         service_addresses: user.service_addresses || [],
//       };
//       return next();
//     } else {
//       // insert session data into session db table
//       const insertSessionQuery =
//         'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
//       await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);

//       // Create and set session for the new user
//       req.session.user = {
//         id: user.userId,
//         username: username,
//         service_addresses: user.service_addresses || [],
//       };
//       // save user info for response return
//       res.locals.user = {
//         username: username,
//         service_addresses: user.service_addresses || [],
//       };
//       return next();
//     }
//   } catch (error) {
//     return next({
//       log: 'Error in sessionController.startSSIDCookie middleware',
//       status: 500,
//       message: 'An error occurred starting session.',
//     });
//   }
// };

// sessionController.setSSIDCookie = async (req, res, next) => {
//   // generate session token
//   try {
//     const sessionToken = require('crypto').randomBytes(32).toString('hex');
//     res.cookie('ssid', sessionToken, { httpOnly: true });
//     res.locals.ssid = sessionToken;
//     return next();
//   } catch (error) {
//     return next({
//       log: 'Error in sessionController.setSSIDCookie middleware',
//       status: 500,
//       message: 'An error occurred setting cookies.',
//     });
//   }
// };

// sessionController.verifySession = async (req, res, next) => {
//   const username = req.params.username;
//   console.log(username);
//   try {
//     // check if client has ssid
//     if (req.cookies.ssid) {
//       // check that ssid matches saved session Token
//       const ssid = req.cookies.ssid;
//       // find user info
//       const userQuery =
//         'SELECT user_id, password, service_addresses FROM users WHERE username = $1';
//       const userResult = await pool.query(userQuery, [username]);
//       const user = userResult.rows[0];
//       const userId = user.user_id;

//       // check if user already has a session
//       const activeSessionQuery =
//         "SELECT session_token FROM sessions WHERE user_id = $1 AND session_status = 'active'";
//       const activeSessionResult = await pool.query(activeSessionQuery, [
//         userId,
//       ]);
//       if (activeSessionResult.rows.length > 0) {
//         const sessionToken = activeSessionResult.rows[0].session_token;
//         if (ssid === sessionToken) {
//           return next();
//         } else {
//           return next({
//             log: 'Error in verifySession: ssid does not match session token',
//             status: 401,
//             message: { err: 'You must be logged in...' },
//           });
//         }
//       } else {
//         return next({
//           log: 'Error in verifySession: no session for user',
//           status: 401,
//           message: { err: 'You must be logged in...' },
//         });
//       }
//     } else {
//       return next({
//         log: 'Error in verifySession: no ssid',
//         status: 401,
//         message: { err: 'You must be logged in...' },
//       });
//     }
//   } catch (error) {
//     return next({
//       log: 'Error in userController.verifySession middleware',
//       status: 500,
//       message: 'An error occurred during verify session.',
//     });
//   }
// };

// module.exports = sessionController;
