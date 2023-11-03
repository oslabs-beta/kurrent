const pool = require('../db');
const bcrypt = require('bcrypt');
const express = require('express');
const session = require('express-session');

const registerUser = async (req, res, next) => {
  const { username, password, email } = req.body;

  try {
    // Check if the username already exists
    const userCheckQuery = 'SELECT * FROM users WHERE username = $1';
    const userCheckResult = await pool.query(userCheckQuery, [username]);

    if (userCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the users table with the hashed password
    const insertUserQuery =
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING user_id';
    const insertUserResult = await pool.query(insertUserQuery, [
      username,
      hashedPassword,
      email,
    ]);
    const userId = insertUserResult.rows[0].user_id;

    // Create a session token
    const sessionToken = generateSessionToken();

    // Insert the session data into the sessions table
    const insertSessionQuery =
      'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
    const currentDate = new Date();
    await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);

    // // Create and set a session for the new user
    req.session.user = {
      id: userId,
      username: username,
    };

    // // Optionally, set a cookie to store the user's session ID
    res.cookie('ssid', sessionToken, {
      httpOnly: true,
    });

    res.status(200).json({
      user_id: userId,
      username: username,
    });
  } catch (error) {
    return next({
      log: 'Error in userController.registerUser middleware',
      status: 500,
      message: 'An error occurred during user registration.',
    });
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  // Check if the user is already authenticated
  if (req.session.user) {
    // User is already logged in, retrieve session information
    const sessionUser = req.session.user;
    // User is already logged in, send a response indicating that
    return res.status(200).json({
      message: 'User is already logged in',
      service_addresses: sessionUser.service_addresses || [],
      username: req.session.user.username,
    });
  }

  try {
    // Query the user by username to get the user_id
    const userQuery =
      'SELECT user_id, password, service_addresses FROM users WHERE username = $1';
    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      console.log('Invalid username or password');
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = userResult.rows[0];
    const userId = user.user_id;
    const hashedPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      console.log('Invalid username or password');
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check if an active session already exists for the user
    const activeSessionQuery = 'SELECT session_token FROM sessions WHERE user_id = $1 AND session_status = \'active\'';
    const activeSessionResult = await pool.query(activeSessionQuery, [userId]);

    if (activeSessionResult.rows.length > 0) {
      // There is an active session, use the existing session token
      const sessionToken = activeSessionResult.rows[0].session_token;

      // Create and set a session for the logged-in user
      req.session.user = {
        id: userId,
        username: username,
        service_addresses: user.service_addresses, // Set service addresses here
      };

      // Optionally, set a cookie to store the user's session ID
      res.cookie('ssid', sessionToken, {
        httpOnly: true,
      });

      // Include service_addresses in the response
      const serviceAddresses = user.service_addresses || [];

      console.log('User already has an active session');
      return res.status(200).json({
        message: 'User already has an active session',
        service_addresses: serviceAddresses,
        username: username,
      });
    }

    // If there is no active session, create a new session
    const sessionToken = generateSessionToken();
    console.log('Generated session token:', sessionToken);

    // Insert the session data into the sessions table
    const insertSessionQuery =
      'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
    const currentDate = new Date();
    await pool.query(insertSessionQuery, [
      userId,
      sessionToken,
      currentDate,
    ]);

    // Create and set a session for the logged-in user
    req.session.user = {
      id: userId,
      username: username,
      service_addresses: user.service_addresses, // Set service addresses here
    };

    // Optionally, set a cookie to store the user's session ID
    res.cookie('ssid', sessionToken, {
      httpOnly: true,
    });

    // Include service_addresses in the response
    const serviceAddresses = user.service_addresses || [];

    console.log('Login successful, sending response');
    res.status(200).json({
      message: 'Login successful',
      service_addresses: serviceAddresses,
      username: username,
    });
  } catch (error) {
    console.error('Error in userController.loginUser:', error);
    return next({
      log: 'Error in userController.loginUser middleware',
      status: 500,
      message: 'An error occurred during user login.',
    });
  }
};



function generateSessionToken() {
  // Generate a random session token, you can use a library or custom logic here
  return require('crypto').randomBytes(32).toString('hex');
}

const verifySession = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: 'You must be logged in...' });
    } else {
      return res.status(200);
    }
  } catch (error) {
    return next({
      log: 'Error in userController.verifySession middleware',
      status: 500,
      message: 'An error occurred during verify session.',
    });
  }
};

const updateServiceAddresses = async (req, res, next) => {
  const username = req.params.username;

  const { service_addresses } = req.body;
  // console.log(service_addresses);

  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: 'You must be logged in...' });
    }
    // Check if the user exists
    const userQuery = 'SELECT * FROM users WHERE username = $1';
    const userResult = await pool.query(userQuery, [username]);
    // console.log(userResult);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingAddresses = userResult.rows[0].service_addresses || [];
    // console.log(existingAddresses);
    // Check for duplicates by comparing the addresses
    //------Removed to check for bug----------
    // const duplicateAddresses = service_addresses.filter((newAddress) =>
    //   existingAddresses.some((existingAddress) =>
    //     areServiceAddressesEqual(existingAddress, newAddress)
    //   )
    // );

    // if (duplicateAddresses.length > 0) {
    //   return res.status(400).json({
    //     error: 'Service addresses already exist',
    //     duplicates: duplicateAddresses,
    //   });
    // }

    // Merge the new service addresses with the existing ones
    const updatedAddresses = existingAddresses.concat(service_addresses);
    console.log(updatedAddresses);
    // Update the service_addresses array for the user in the database
    const updateUserQuery =
      'UPDATE users SET service_addresses = $1 WHERE username = $2';
    await pool.query(updateUserQuery, [updatedAddresses, username]);

    res.json({ message: 'Service addresses updated successfully' });
  } catch (error) {
    return next({
      log: 'Error in userController.updateServiceAddresses middleware',
      status: 500,
      message: 'An error occurred during service address update.',
    });
  }
};

const getAdresses = async (req, res, next) => {
  try {
    const { username } = req.params;
    //console.log(username);
    const userQuery = 'SELECT * FROM users WHERE username = $1';
    const userResult = await pool.query(userQuery, [username]);
    const existingAddresses = userResult.rows[0].service_addresses || [];
    // console.log(existingAddresses);
    return res.status(200).json(existingAddresses);
  } catch (error) {
    return next({
      log: 'Error in userController.getServiceAddresses middleware',
      status: 500,
      message: 'An error occurred getting service address.',
    });
  }
};

// function areServiceAddressesEqual(address1, address2) {
//   return address1[0] === address2[0] && address1[1] === address2[1];
// }
// function areServiceAddressesEqual(address1, address2) {
//   // Implement custom logic to compare service addresses
//   // Return true if they are equal, otherwise return false
//   return JSON.stringify(address1) === JSON.stringify(address2);
// }

const logout = async (req, res, next) => {
  try {
    if (req.session.user && req.session.user.id) {
      // Extract the user's ID from the session
      const userId = req.session.user.id;

      // Find the most recent active session for the user
      const activeSessionQuery = `
        SELECT session_id 
        FROM sessions 
        WHERE user_id = $1 
        AND session_status = 'active' 
        ORDER BY login_time DESC 
        LIMIT 1`;

      const activeSessionResult = await pool.query(activeSessionQuery, [userId]);

      if (activeSessionResult.rows.length > 0) {
        const sessionId = activeSessionResult.rows[0].session_id;

        // Update the session_status to 'inactive' or 'logged_out'
        const updateSessionStatusQuery = `
          UPDATE sessions 
          SET session_status = 'inactive' 
          WHERE session_id = $1`;

        await pool.query(updateSessionStatusQuery, [sessionId]);

        // Then, delete the session record
        const deleteSessionQuery = `
          DELETE FROM sessions 
          WHERE session_id = $1`;

        await pool.query(deleteSessionQuery, [sessionId]);

        // Clear the session cookie to log the user out
        res.clearCookie('ssid'); // Replace 'ssid' with your session cookie name

         // Destroy the session
         req.session.destroy();

        // Send a successful logout response
        return res.status(200).json({ message: 'Logout successful' });
      }

      // Handle the case where there is no active session for the user
      return res.status(401).json({ error: 'No active session found' });
    }

    // Handle the case where there is no active session for the user
    return res.status(401).json({ error: 'No active session found' });
  } catch (error) {
    console.error('Error in logout route:', error);
    return next({
      log: 'Error in userController.logout middleware',
      status: 500,
      message: 'An error occurred during logout.',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateServiceAddresses,
  logout,
  verifySession,
  getAdresses,
};



