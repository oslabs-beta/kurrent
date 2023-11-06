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
  try {
    if (!req.session.user || !req.session.user.id) {
      const errObj = {
        log: 'Error in sessionController.verifySession',
        status: 401,
        message: { err: 'You must be logged in...' },
      };
      return next(errObj);
    } else {
      return next();
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
