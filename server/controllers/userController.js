const pool = require('../db');
const bcrypt = require('bcrypt');

// login new user, save user data to db, start new session, set cookies
const registerUser = async (req, res, next) => {
  const { username, password, email } = req.body;
  res.locals.username = req.body.username;
  try {
    // Check if the username already exists
    const usernameExists = await checkIfUsernameExists(username, email);
    if (usernameExists) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await hashPassword(password);
    console.log('Hashed Password:', hashedPassword);
    // Insert the new user into the users table with the hashed password
    const userId = await createUser(username, hashedPassword, email);
    res.locals.userId = userId

    return next();
  } catch (error) {
    return next({
      log: 'Error in userController.registerUser middleware: ' + error,
      status: 500,
      message: 'An error occurred during user registration.',
    });
  }
};

// check if username already in DB
async function checkIfUsernameExists(username, email) {
  const userCheckQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
  const userCheckResult = await pool.query(userCheckQuery, [username, email]);
  return userCheckResult.rows.length > 0;
}

// hash password string for storage in DB
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// add user data to DB
async function createUser(username, hashedPassword, email) {
  const insertUserQuery =
    'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING user_id';
  const insertUserResult = await pool.query(insertUserQuery, [
    username,
    hashedPassword,
    email,
  ]);
  return insertUserResult.rows[0].user_id;
}

// login existing user, set new session in db, set cookie
const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  res.locals.username = username;
  try {
    // Check if the user exists in the database
    const user = await getUserByCredential(username.toLowerCase());
    if (!user) {
      return next({
        log: 'Incorrect credentials attempted for login',
        status: 401,
        message: 'Incorrect username or password'
      })
    }

    // Verify the password against the hashed password in the database
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return next({
        log: 'Incorrect credentials attempted for login',
        status: 401,
        message: 'Incorrect username or password'
      })
    }

    // Save service_addresses from the user's record
    const serviceAddresses = user.service_addresses || []
    res.locals.serviceAddresses = serviceAddresses;
    res.locals.userId = user.user_id

    return next();
  } catch (error) {
    console.error('Error in userController.loginUser middleware:', error);
    return next({
      log: 'Error in userController.loginUser middleware',
      status: 500,
      message: 'An error occurred during user login.',
    });
  }
};

// Helper function to get user by username or email
async function getUserByCredential(credential) {
  const getUserQuery =
    'SELECT * FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1)';
  try {
    const result = await pool.query(getUserQuery, [credential]);

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getUserByCredential:', error);
    throw error;
  }
}
// Helper function to verify the password against the hashed password in the database
async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// update user's prometheus server addresses in db
const updateServiceAddresses = async (req, res, next) => {
  const username = req.params.username;
  const { service_addresses } = req.body;
  try {
    // check if user is logged in
    if (!req.cookies.ssid) {
      return res.status(401).json({ error: 'You must be logged in...' });
    }

    // Check if the user exists in db
    const userQuery = 'SELECT * FROM users WHERE username = $1';
    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingAddresses = userResult.rows[0].service_addresses || [];

    // Check for duplicates in the new service_addresses
    const duplicates = existingAddresses.some(
      (existingAddress) =>
        JSON.stringify(existingAddress) === JSON.stringify(service_addresses)
    );
    if (duplicates) {
      return next({
        log: 'Error in userController.updateServiceAddress middleware: address already exists.',
        status: 400,
        message: 'This service address already exists.',
      });
    }

    // Normalize the format of the incoming service_addresses
    const normalizedAddresses = [service_addresses];

    // Merge the new service addresses with the existing ones
    const updatedAddresses = existingAddresses.concat(normalizedAddresses);

    // Update the service_addresses array for the user in the database
    const updateUserQuery =
      'UPDATE users SET service_addresses = $1 WHERE username = $2';
    await pool.query(updateUserQuery, [updatedAddresses, username]);

    res.json({ message: 'Service addresses updated successfully' });
  } catch (error) {
    return next({
      log: `Error in userController.updateServiceAddresses middleware: ${error}`,
      status: 500,
      message: 'An error occurred during service address update.',
    });
  }
};

const logout = (req, res, next) => {
  // Get the session token from the request cookies
  const sessionToken = req.cookies.ssid;

  if (sessionToken) {
    deleteSessionEntry(sessionToken, (error) => {
      if (error) {
        return next(error); // Pass the error to the next middleware or error handler
      }

      // Clear the SSID (Session ID) cookie in the response
      res.clearCookie('ssid');

      return next();
    });
  } else {
    // If no session token is found
    res.status(401).json({ message: 'User is not logged in' });
  }
};

// delete session from session db
const deleteSessionEntry = (sessionToken, callback) => {
  // check valid sessionToken passed
  if (!sessionToken) {
    console.error('Session token is undefined');
    return callback(new Error('Session token is undefined'));
  }

  // delete session from db
  const deleteSessionQuery = 'DELETE FROM sessions WHERE session_token = $1';
  pool.query(deleteSessionQuery, [sessionToken], (error, result) => {
    if (error) {
      console.error('Error deleting session entry:', error);
      return callback(error);
    }

    callback();
  });
};

module.exports = { 
  registerUser, 
  loginUser, 
  updateServiceAddresses, 
  logout, 
  getUserByCredential , 
  checkIfUsernameExists, 
  hashPassword, 
  createUser};
