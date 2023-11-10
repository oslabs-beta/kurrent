const session = require('express-session');
const pool = require('../db');

const sessionController = {};

sessionController.startSession = async (req, res, next) => {
  const sessionToken = res.locals.ssid;
  const { username } = req.body;
  try {
    // find user info
    const userQuery =
      'SELECT user_id, password, service_addresses FROM users WHERE username = $1';
    const userResult = await pool.query(userQuery, [username]);
    const user = userResult.rows[0];
    const userId = user.user_id;
    const currentDate = new Date();

    // check if user already has a session
    const activeSessionQuery =
      "SELECT session_token FROM sessions WHERE user_id = $1 AND session_status = 'active'";
    const activeSessionResult = await pool.query(activeSessionQuery, [userId]);
    if (activeSessionResult.rows.length > 0) {
      const sessionToken = activeSessionResult.rows[0].session_token;
      // reset ssid cookie to current sessionToken
      res.cookie('ssid', sessionToken, { httpOnly: true });
      // Create and set session for the new user
      req.session.user = {
        id: user.userId,
        username: username,
        service_addresses: user.service_addresses || [],
      };
      // save user info for response return
      res.locals.user = {
        username: username,
        service_addresses: user.service_addresses || [],
      };
      return next();
    } else {
      // insert session data into session db table
      const insertSessionQuery =
        'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
      await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);

      // Create and set session for the new user
      req.session.user = {
        id: user.userId,
        username: username,
        service_addresses: user.service_addresses || [],
      };
      // save user info for response return
      res.locals.user = {
        username: username,
        service_addresses: user.service_addresses || [],
      };
      return next();
    }
  } catch (error) {
    return next({
      log: 'Error in sessionController.startSSIDCookie middleware',
      status: 500,
      message: 'An error occurred starting session.',
    });
  }
};

sessionController.setSSIDCookie = async (req, res, next) => {
  // generate session token
  try {
    const sessionToken = require('crypto').randomBytes(32).toString('hex');
    res.cookie('ssid', sessionToken, { httpOnly: true });
    res.locals.ssid = sessionToken;
    return next();
  } catch (error) {
    return next({
      log: 'Error in sessionController.setSSIDCookie middleware',
      status: 500,
      message: 'An error occurred setting cookies.',
    });
  }
};

sessionController.verifySession = async (req, res, next) => {
  const username = req.params.username;
  console.log(username);
  try {
    // check if client has ssid
    if (req.cookies.ssid) {
      // check that ssid matches saved session Token
      const ssid = req.cookies.ssid;
      // find user info
      const userQuery =
        'SELECT user_id, password, service_addresses FROM users WHERE username = $1';
      const userResult = await pool.query(userQuery, [username]);
      const user = userResult.rows[0];
      const userId = user.user_id;

      // check if user already has a session
      const activeSessionQuery =
        "SELECT session_token FROM sessions WHERE user_id = $1 AND session_status = 'active'";
      const activeSessionResult = await pool.query(activeSessionQuery, [
        userId,
      ]);
      if (activeSessionResult.rows.length > 0) {
        const sessionToken = activeSessionResult.rows[0].session_token;
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
          log: 'Error in verifySession: no session for user',
          status: 401,
          message: { err: 'You must be logged in...' },
        });
      }
    } else {
      return next({
        log: 'Error in verifySession: no ssid',
        status: 401,
        message: { err: 'You must be logged in...' },
      });
    }
  } catch (error) {
    return next({
      log: 'Error in userController.verifySession middleware',
      status: 500,
      message: 'An error occurred during verify session.',
    });
  }
};

module.exports = sessionController;
