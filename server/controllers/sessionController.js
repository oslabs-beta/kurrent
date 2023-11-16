const pool = require('../db');
const crypto = require('crypto');

// Function to generate a session token
function generateSessionToken() {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  return sessionToken;
}

// Function to set the SSID (Session ID) cookie
function setSSIDCookie(req, res, next) {
  try {
    res.cookie('ssid', res.locals.sessionToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'None',
    });
    return next();
  } catch (error) {
    return next({
      log: `Error in sessionController.setSSIDCookie middleware: ${error}`,
      status: 500,
      message: 'An error occurred when attempting to set a cookie',
    });
  }
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
  const { id, sessionToken, loginTime } = sessionData;
  await pool.query(updateSessionQuery, [
    id,
    sessionToken,
    loginTime,
    'active',
    sessionId,
  ]);
}

// start new session in db
async function startSession(req, res, next) {
  const currentDate = new Date();
  let sessionToken = req.cookies.ssid;
  if (!sessionToken) {
    sessionToken = generateSessionToken();
  }
  res.locals.sessionToken = sessionToken;
  const sessionData = {
    id: res.locals.userId,
    sessionToken: sessionToken,
    loginTime: currentDate,
  };
  try {
    // Check if a session with the provided session token already exists
    const existingSession = await getSessionByToken(sessionToken);

    if (existingSession) {
      // If a session already exists, update the session data
      await updateSession(existingSession.id, sessionData);
    } else {
      // If no session exists, create a new session
      await insertNewSession(res.locals.userId, sessionToken, currentDate);
    }

    // Set the session for the user
    req.session.user = {
      id: res.locals.id,
      username: res.locals.username,
    };
    return next();
  } catch (error) {
    // Handle specific error cases and provide meaningful error messages
    return next({
      log: `Error in sessionController.startSession middleware: ${error}`,
      status: 500,
      message: 'An error occurred when attempting to start your session',
    });
  }
}

// get active user session from db
async function getActiveSession(sessionToken) {
  try {
    const getSessionQuery =
      'SELECT * FROM sessions WHERE session_token = $1 AND session_status = $2';
    const result = await pool.query(getSessionQuery, [sessionToken, 'active']);
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
  // no ssid cookie
  if (!ssid) {
    return next({
      log: 'Error in verifySession: no ssid',
      status: 401,
      message: { err: 'No active session' },
    });
  }

  try {
    // Get the user's session token from the database
    const sessionTokenQuery =
      'SELECT * FROM sessions INNER JOIN users ON sessions.user_id = users.user_id WHERE sessions.session_token = $1 AND session_status = $2';
    const sessionTokenResult = await pool.query(sessionTokenQuery, [
      ssid,
      'active',
    ]);
    if (sessionTokenResult.rows.length > 0) {
      res.locals.username = sessionTokenResult.rows[0].username;
      res.locals.email = sessionTokenResult.rows[0].email;
      res.locals.serviceAddresses =
        sessionTokenResult.rows[0].service_addresses;
      return next();
    } else {
      return next({
        log: 'Error in verifySession: no active session for user',
        status: 401,
        message: { err: 'No active session' },
      });
    }
  } catch (error) {
    return next({
      log: 'Error in sessionController.verifySession middleware: ' + error,
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
