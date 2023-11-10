const pool = require('../db');
const bcrypt = require('bcrypt');
const express = require('express');
const session = require('express-session');
const sessionController = require('./sessionController');

const registerUser = async (req, res, next) => {
    const { username, password, email } = req.body;
  
    try {
      // Check if the username already exists
      console.log("Checking if the user exists...");
      const usernameExists = await checkIfUsernameExists(username);
      console.log("User:", user);
  
      if (usernameExists) {
        console.log("User not found");
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Hash the password before storing it in the database
      const hashedPassword = await hashPassword(password);
  
      // Insert the new user into the users table with the hashed password
      const userId = await createUser(username, hashedPassword, email);
  
      // Create a session for the new user
      const sessionData = {
        id: userId,
        username: username,
        sessionToken: sessionController.generateSessionToken(),
      };
  
      // Start the session using the sessionController
      sessionController.startSession(req, sessionData);
  
      // Set the SSID (Session ID) cookie
      sessionController.setSSIDCookie(res, sessionData.sessionToken);
  
      res.status(201).json({ user_id: userId, username: username });
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
  
    try {
      // Check if the user exists in the database
      console.log("Checking if the user exists...");
      const user = await getUserByUsername(username);
      console.log("User:", user);
  
      if (!user) {
        console.log("User not found");
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Verify the password against the hashed password in the database
      const isPasswordValid = await verifyPassword(password, user.password);
  
      if (!isPasswordValid) {
        console.log("Password is not valid");
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Check if the user has an active session
      const activeSession = await sessionController.getActiveSession(user.user_id);
      console.log('Active session: ', activeSession);
  
      if (activeSession) {
        console.log('Reusing active session');
        const sessionData = {
          id: user.user_id,
          username: user.username,
          sessionToken: activeSession.session_token,
        };
  
        // Start the session using the sessionController
        
          console.log('Before calling startSession');
          await sessionController.startSession(req, sessionData);
          console.log('After calling startSession');
       
  
        // Fetch service_addresses from the user's record using a helper function
        const serviceAddresses = await fetchServiceAddresses(user.user_id);
  
        return res.status(200).json({
          user_id: user.user_id,
          username: user.username,
          session_token: activeSession.session_token,
          service_addresses: serviceAddresses,
        });
      }
  
      // If there is no active session, generate a new one
      console.log("No active session found, generating a new session");
      const sessionToken = sessionController.generateSessionToken();
      const currentDate = new Date();
  
      // Insert the session data into the sessions table
  
        await sessionController.insertNewSession(user.user_id, sessionToken, currentDate);
     
  
      const sessionData = {
        id: user.user_id,
        username: user.username,
        sessionToken: sessionToken,
      };
  
      // Start the session using the sessionController
        console.log('Before calling startSession');
        await sessionController.startSession(req, sessionData);
        console.log('After calling startSession');
      
  
      // Fetch service_addresses from the user's record
      const serviceAddresses = await fetchServiceAddresses(user.user_id);
  
      // Set the SSID (Session ID) cookie using the sessionController
      sessionController.setSSIDCookie(res, sessionToken);
  
      return res.status(200).json({
        user_id: user.user_id,
        username: user.username,
        session_token: sessionToken,
        service_addresses: serviceAddresses,
      });
    } catch (error) {
      return next({
        log: 'Error in userController.loginUser middleware',
        status: 500,
        message: 'An error occurred during user login.',
      });
    }
  };
// Helper function to fetch service_addresses from the user's record
async function fetchServiceAddresses(userId) {
  const getUserServiceAddressesQuery = 'SELECT service_addresses FROM users WHERE user_id = $1';
  const result = await pool.query(getUserServiceAddressesQuery, [userId]);
  return result.rows[0].service_addresses || [];
}
// Helper function to get user by username
async function getUserByUsername(username) {
  const getUserQuery = 'SELECT * FROM users WHERE username = $1';
  const result = await pool.query(getUserQuery, [username]);
  // Log the result and the SQL query
  console.log('getUserByUsername Result:', JSON.stringify(result.rows[0], null, 2));
  console.log('SQL Query:', getUserQuery);

  return result.rows[0];
}

// Helper function to verify the password against the hashed password in the database
async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

const updateServiceAddresses = async (req, res, next) => {
    const username = req.params.username;
    const { service_addresses } = req.body;
  
    try {
      if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ error: 'You must be logged in...' });
      }
  
      // Check if the user exists
      const userQuery = 'SELECT * FROM users WHERE username = $1';
      const userResult = await pool.query(userQuery, [username]);
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const existingAddresses = userResult.rows[0].service_addresses || [];
  
      // Check for duplicates in the new service_addresses
      const duplicates = service_addresses.some(address =>
        existingAddresses.some(existingAddress => JSON.stringify(existingAddress) === JSON.stringify(address))
      );
  
      if (duplicates) {
        return res.status(400).json({ error: 'Duplicate service addresses found' });
      }
  
      // Normalize the format of the incoming service_addresses
      const normalizedAddresses = service_addresses.map(address =>
        Array.isArray(address) ? address : [address]
      );
  
      // Merge the new service addresses with the existing ones
      const updatedAddresses = existingAddresses.concat(normalizedAddresses);
  
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
  
      // Verify the user's session
      sessionController.verifySession(req, res, async() => {
        // Session is valid, continue with the function
        const userQuery = 'SELECT * FROM users WHERE username = $1';
        const userResult = await pool.query(userQuery, [username]);
        const existingAddresses = userResult.rows[0].service_addresses || [];
        return res.status(200).json(existingAddresses);
      });
    } catch (error) {
      return next({
        log: 'Error in userController.getServiceAddresses middleware',
        status: 500,
        message: 'An error occurred getting service address.',
      });
    }
  };
  
  
  
  const logout = (req, res) => {
    console.log(req.session.user)
    if (req.session.user) {
      const sessionToken = req.session.user.sessionToken; // Assuming you store the session token in the session
  
      // Destroy the user's session
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        } else {
          // If the session is successfully destroyed, delete the session entry from the database
          deleteSessionEntry(sessionToken);
        }
      });
  
      // Clear the session cookie
      res.clearCookie('ssid');
  
      // Redirect or respond as needed after logout
      return res.status(200).json({ message: 'User logged out' });
    }
  
    // If no user is logged in, respond accordingly
    res.status(401).json({ message: 'User is not logged in' });
  };
  
  const deleteSessionEntry = (sessionToken) => {
    const deleteSessionQuery = 'DELETE FROM sessions WHERE session_token = $1';
  
    pool.query(deleteSessionQuery, [sessionToken], (error, result) => {
      if (error) {
        console.error('Error deleting session entry:', error);
      } else {
        console.log('Session entry deleted for session token:', sessionToken);
      }
    });
  };
  
  module.exports = {
    registerUser,
    loginUser,
    updateServiceAddresses,
    logout,
    getAdresses,
  };
  
  