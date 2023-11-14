const pool = require('../db');
const crypto = require('crypto');

// Function to generate a session token
function generateSessionToken() {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  return sessionToken;
}

// Function to set the SSID (Session ID) cookie
function setSSIDCookie(res, sessionToken) {
  res.cookie('ssid', sessionToken, {
    httpOnly: true,
  });
}

// get session from db by session token
async function getSessionByToken(sessionToken) {
  const getSessionQuery = 'SELECT * FROM sessions WHERE session_token = $1';
  const result = await pool.query(getSessionQuery, [sessionToken]);
  return result.rows[0];
}

// update session information in db
async function updateSession(sessionId, sessionData) {
  const updateSessionQuery =
    'UPDATE sessions SET user_id = $1, session_token = $2, login_time = $3, session_status = $4 WHERE session_id = $5';
  const { id, sessionToken, loginTime, sessionStatus } = sessionData;
  await pool.query(updateSessionQuery, [
    id,
    sessionToken,
    loginTime,
    sessionStatus,
    sessionId,
  ]);
}

// start new session in db
async function startSession(req, sessionData) {
  const currentDate = new Date();
  const { id, sessionToken } = sessionData;

  try {
    // Check if a session with the provided session token already exists
    const existingSession = await getSessionByToken(sessionToken);

    if (existingSession) {
      // If a session already exists, update the session data
      await updateSession(existingSession.id, sessionData);
    } else {
      // If no session exists, create a new session
      await insertNewSession(id, sessionToken, currentDate);
    }

    // Set the session for the user
    req.session.user = {
      id: id,
      username: sessionData.username,
      service_addresses: sessionData.service_addresses || [],
    };
  } catch (error) {
    // Handle specific error cases and provide meaningful error messages
    if (error.code === 'unique_violation') {
      return Promise.reject(new Error('Session already exists for this user.'));
    }

    // Handle other cases as needed
    return Promise.reject(new Error('Error creating/updating session.'));
  }
}

// get active user session from db
async function getActiveSession(userId) {
  try {
    const getSessionQuery =
      'SELECT * FROM sessions WHERE user_id = $1 AND session_status = $2';
    const result = await pool.query(getSessionQuery, [userId, 'active']);
    return result.rows[0];
  } catch (error) {
    throw error; // Propagate the error to the caller
  }
}

// Insert new session into db
async function insertNewSession(userId, sessionToken, currentDate) {
  try {
    const insertSessionQuery =
      'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
    await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);
  } catch (error) {
    throw error; // Propagate the error to the caller
  }
}

// verify user session in db
async function verifySession(req, res, next) {
  const ssid = req.cookies.ssid;
  const username = req.params.username;
  // no ssid cookie
  if (!ssid) {
    return next({
      log: 'Error in verifySession: no ssid',
      status: 401,
      message: { err: 'You must be logged in...' },
    });
  }

  try {
    // Get the user's session token from the database
    const sessionTokenQuery =
      'SELECT session_token FROM sessions INNER JOIN users ON sessions.user_id = users.user_id WHERE users.username = $1 AND session_status = $2';
    const sessionTokenResult = await pool.query(sessionTokenQuery, [
      username,
      'active',
    ]);

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
}

module.exports = {
  generateSessionToken,
  setSSIDCookie,
  startSession,
  verifySession,
  getActiveSession,
  insertNewSession,
};
