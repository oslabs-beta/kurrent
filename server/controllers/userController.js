const pool = require('../db');
const bcrypt = require('bcrypt');
const express = require('express');
const session = require('express-session');
const sessionController = require('./sessionController');

// const registerUser = async (req, res, next) => {
//   const { username, password, email } = req.body;

//   try {
//     // Check if the username already exists
//     const usernameExists = await checkIfUsernameExists(username);

//     if (usernameExists) {
//       return res.status(400).json({ error: 'Username already exists' });
//     }

//     // Hash the password before storing it in the database
//     const hashedPassword = await hashPassword(password);

//     // Insert the new user into the users table with the hashed password
//     const userId = await createUser(username, hashedPassword, email);

//     // Create a session token
//     const sessionToken = generateSessionToken();

//     // Insert the session data into the sessions table
//     const currentDate = new Date();
//     await insertNewSession(userId, sessionToken, currentDate);

//     console.log('Before setting user in session:', req.session.user);
//     // Create and set a session for the new user
//     req.session.user = { 
//     id: userId,
//     username: username,
//     sessionToken: sessionToken,
//     };
//     console.log('After setting user in session:', req.session.user);
    
//     // Optionally, set a cookie to store the user's session ID
//     res.cookie('ssid', sessionToken, {
//       httpOnly: true,
//     });

//       // Console log the session user
//       console.log('Session User:', req.session.user);

//     res.status(201).json({ user_id: userId, username: username });
//   } catch (error) {
//     return next({
//       log: 'Error in userController.registerUser middleware',
//       status: 500,
//       message: 'An error occurred during user registration.',
//     });
//   }
// };

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


// Helper functions 

async function checkIfUsernameExists(username) {
  const userCheckQuery = 'SELECT * FROM users WHERE username = $1';
  const userCheckResult = await pool.query(userCheckQuery, [username]);
  return userCheckResult.rows.length > 0;
}

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

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

// const loginUser = async (req, res, next) => {
//   const { username, password } = req.body;

//   try {
//     // Check if the username exists in the database
//     const user = await getUserByUsername(username);

//     if (!user) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     // Check if the user has an active session
//     const activeSession = await getActiveSession(user.user_id);

//     if (activeSession) {
//       // If an active session exists, reuse it
//       req.session.user = {
//         id: user.user_id,
//         username: user.username,
//         sessionToken: activeSession.session_token,
//       };

//       // Fetch service_addresses from the user's record using a helper function
//       const serviceAddresses = await fetchServiceAddresses(user.user_id);

//       return res.status(200).json({
//         user_id: user.user_id,
//         username: user.username,
//         session_token: activeSession.session_token,
//         service_addresses: serviceAddresses,
//       });
//     }

//     // Verify the password against the hashed password in the database
//     const isPasswordValid = await verifyPassword(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     // Generate a new session token
//     const sessionToken = generateSessionToken();

//     // Insert the session data into the sessions table
//     const currentDate = new Date();
//     await insertNewSession(user.user_id, sessionToken, currentDate);

//     // Set a session for the logged-in user
//     req.session.user = {
//       id: user.user_id,
//       username: user.username,
//       sessionToken: sessionToken,
//     };

//     // Fetch service_addresses from the user's record
//     const serviceAddresses = await fetchServiceAddresses(user.user_id);


//     // Set a cookie to store the user's session ID
//     res.cookie('ssid', sessionToken, {
//       httpOnly: true,
//     });

//     return res.status(200).json({
//       user_id: user.user_id,
//       username: user.username,
//       session_token: sessionToken,
//       service_addresses: serviceAddresses,
//     });
//   } catch (error) {
//     return next({
//       log: 'Error in userController.loginUser middleware',
//       status: 500,
//       message: 'An error occurred during user login.',
//     });
//   }
// };


// const loginUser = async (req, res, next) => {
//   const { username, password } = req.body;

//   try {
//     // Check if the user exists in the database
//     console.log("Checking if the user exists...");
//     const user = await getUserByUsername(username);
//     console.log("User:", user);

//     if (!user) {
//       console.log("User not found");
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     // Verify the password against the hashed password in the database
//     console.log("Verifying the password...");
//     const isPasswordValid = await verifyPassword(password, user.password);

//     if (!isPasswordValid) {
//       console.log("Password is not valid");
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     // Check if the user has an active session
//     console.log("Checking for an active session...");
//     const activeSession = await sessionController.getActiveSession(user.user_id);
//     console.log('Active session: ', activeSession);

//     if (activeSession) {
//       console.log('Reusing active session');
//       const sessionData = {
//         id: user.user_id,
//         username: user.username,
//         sessionToken: activeSession.session_token,
//       };

//       // Start the session using the sessionController
//       // console.log('Before calling startSession');
//       // sessionController.startSession(req, sessionData);
//       // console.log('After calling startSession');
//       try {
//         console.log('Before calling startSession');
//         await sessionController.startSession(req, sessionData);
//         console.log('After calling startSession');
//       } catch (sessionError) {
//         console.error('Error in startSession:', sessionError);
//       }

//       // Fetch service_addresses from the user's record using a helper function
//       const serviceAddresses = await fetchServiceAddresses(user.user_id);

//       return res.status(200).json({
//         user_id: user.user_id,
//         username: user.username,
//         session_token: activeSession.session_token,
//         service_addresses: serviceAddresses,
//       });
//     }

//     // If there is no active session, generate a new one
//     console.log("No active session found, generating a new session");
//     const sessionToken = sessionController.generateSessionToken();
//     const currentDate = new Date();

//     // Insert the session data into the sessions table
//     await sessionController.insertNewSession(user.user_id, sessionToken, currentDate);

//     const sessionData = {
//       id: user.user_id,
//       username: user.username,
//       sessionToken: sessionToken,
//     };

//     // Start the session using the sessionController
//     console.log('Before calling startSession');
//     try {
//       sessionController.startSession(req, sessionData);
//       console.log('After calling startSession');
//     } catch (error) {
//       console.error('Error in startSession:', error);
//     }
//     console.log('After try-catch block for startSession');
//     // sessionController.startSession(req, sessionData);
//     // console.log('After calling startSession');

//     // Fetch service_addresses from the user's record
//     const serviceAddresses = await fetchServiceAddresses(user.user_id);

//     // Set the SSID (Session ID) cookie using the sessionController
//     sessionController.setSSIDCookie(res, sessionToken);

//     return res.status(200).json({
//       user_id: user.user_id,
//       username: user.username,
//       session_token: sessionToken,
//       service_addresses: serviceAddresses,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       log: 'Error in userController.loginUser middleware',
//       status: 500,
//       message: 'An error occurred during user login.',
//     });
//   }
// };

const loginUser = async (req, res, next) => {
  console.log('Request Body:', req.body);
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

    //   await sessionController.insertNewSession(user.user_id, sessionToken, currentDate);
   

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

// const loginUser = async (req, res, next) => {
//   const { username, password } = req.body;

//   try {
//     // Check if the user exists in the database
//     console.log("Checking if the user exists...");
//     const user = await getUserByUsername(username);
//     console.log("User:", user);

//     if (!user) {
//       console.log("User not found");
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     // Verify the password against the hashed password in the database
//     const isPasswordValid = await verifyPassword(password, user.password);

//     if (!isPasswordValid) {
//       console.log("Password is not valid");
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     // Check if the user has an active session
//     const activeSession = await sessionController.getActiveSession(user.user_id);
//     console.log('Active session: ', activeSession);

//     if (activeSession) {
//       console.log('Reusing active session');

//       // Fetch service_addresses from the user's record using a helper function
//       const serviceAddresses = await fetchServiceAddresses(user.user_id);

//       return res.status(200).json({
//         user_id: user.user_id,
//         username: user.username,
//         session_token: activeSession.session_token,
//         service_addresses: serviceAddresses,
//       });
//     }

//     // If there is no active session, generate a new one
//     console.log("No active session found, generating a new session");
//     const sessionToken = sessionController.generateSessionToken();
//     const currentDate = new Date();

//     // Insert the session data into the sessions table
//     await insertNewSession(user.user_id, sessionToken, currentDate);

//     const sessionData = {
//       id: user.user_id,
//       username: user.username,
//       sessionToken: sessionToken,
//     };

//     // Start the session using the sessionController
//     console.log('Before calling startSession');
//     await sessionController.startSession(req, sessionData);
//     console.log('After calling startSession');

//     // Fetch service_addresses from the user's record
//     const serviceAddresses = await fetchServiceAddresses(user.user_id);

//     // Set the SSID (Session ID) cookie using the sessionController
//     sessionController.setSSIDCookie(res, sessionToken);

//     return res.status(200).json({
//       user_id: user.user_id,
//       username: user.username,
//       session_token: sessionToken,
//       service_addresses: serviceAddresses,
//     });
//   } catch (error) {
//     return next({
//       log: 'Error in userController.loginUser middleware',
//       status: 500,
//       message: 'An error occurred during user login.',
//     });
//   }
// };

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

// Helper function to get the user's active session
// async function getActiveSession(userId) {
//   const getSessionQuery = 'SELECT * FROM sessions WHERE user_id = $1 AND session_status = $2';
//   const result = await pool.query(getSessionQuery, [userId, 'active']);
//   return result.rows[0];
// }

// async function insertNewSession(userId, sessionToken, currentDate) {
//   const insertSessionQuery = 'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
//   await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);
// }

// function generateSessionToken() {
//   // Generate a random session token, you can use a library or custom logic here
//   return require('crypto').randomBytes(32).toString('hex');
// }


// const verifySession = async (req, res, next) => {
//   try {
//     if (!req.session.user || !req.session.user.id) {
//       console.log('User is not logged in');
//       return res.status(401).json({ error: 'You must be logged in...' });
//     } else {
//       return res.status(200);
//     }
//   } catch (error) {
//     return next({
//       log: 'Error in userController.verifySession middleware',
//       status: 500,
//       message: 'An error occurred during verify session.',
//     });
//   }
// };

// const updateServiceAddresses = async (req, res, next) => {
//   const username = req.params.username;

//   const { service_addresses } = req.body;
//   // console.log(service_addresses);

//   try {
//     if (!req.session.user || !req.session.user.id) {
//       return res.status(401).json({ error: 'You must be logged in...' });
//     }
//     // Check if the user exists
//     const userQuery = 'SELECT * FROM users WHERE username = $1';
//     const userResult = await pool.query(userQuery, [username]);
//     // console.log(userResult);
//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const existingAddresses = userResult.rows[0].service_addresses || [];

//     // Merge the new service addresses with the existing ones
//     const updatedAddresses = existingAddresses.concat(service_addresses);
//     console.log(updatedAddresses);
//     // Update the service_addresses array for the user in the database
//     const updateUserQuery =
//       'UPDATE users SET service_addresses = $1 WHERE username = $2';
//     await pool.query(updateUserQuery, [updatedAddresses, username]);

//     res.json({ message: 'Service addresses updated successfully' });
//   } catch (error) {
//     return next({
//       log: 'Error in userController.updateServiceAddresses middleware',
//       status: 500,
//       message: 'An error occurred during service address update.',
//     });
//   }
// };

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

const logout = (req, res, next) => {
  console.log('Session user:', req.session.user);

  if (req.session.user) {
    const sessionToken = req.session.user.sessionToken;

    // Destroy the user's session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        next(err); // Pass the error to the next middleware or error handler
      } else {
        // If the session is successfully destroyed, delete the session entry from the database
        deleteSessionEntry(sessionToken, next);
        console.log('Session destroyed and entry deleted');

        // Clear the session cookie
        res.clearCookie('ssid');

        // Redirect or respond as needed after logout
        res.status(200).json({ message: 'User logged out' });
      }
    });
  } else {
    // If no user is logged in, respond accordingly
    console.log('No user session found');
    res.status(401).json({ message: 'User is not logged in' });
  }
};

const deleteSessionEntry = (sessionToken, next) => {
  if (!sessionToken) {
    console.error('Session token is undefined');
    if (typeof next === 'function') {
      next(new Error('Session token is undefined')); // Handle the error appropriately
    } else {
      console.error('Next function is not defined');
    }
    return;
  }

  const deleteSessionQuery = 'DELETE FROM sessions WHERE session_token = $1';

  pool.query(deleteSessionQuery, [sessionToken], (error, result) => {
    if (error) {
      console.error('Error deleting session entry:', error);
      if (typeof next === 'function') {
        next(error); // Pass the error to the next middleware or error handler
      } else {
        console.error('Next function is not defined');
      }
    } else {
      console.log('Session entry deleted for session token:', sessionToken);

      // Continue with the next middleware or response handling here if needed
      if (typeof next === 'function') {
        next();
      }
    }
  });
};



// const logout = (req, res, next) => {
//   console.log(req.session.user)
//   if (req.session.user) {
//     const sessionToken = req.session.user.sessionToken; 

//     // Destroy the user's session
//     req.session.destroy((err) => {
//       if (err) {
//         console.error('Error destroying session:', err);
//         return next(err)
//       } else {
//         // If the session is successfully destroyed, delete the session entry from the database
//         deleteSessionEntry(sessionToken);
//         console.log('Session destroyed and entry deleted');
//       }
//     });

//     // Clear the session cookie
//     res.clearCookie('ssid');

//     // Redirect or respond as needed after logout
//     return res.status(200).json({ message: 'User logged out' });
//   }

//   // If no user is logged in, respond accordingly
//   console.log('No user session found');
//   res.status(401).json({ message: 'User is not logged in' });
// };


// const deleteSessionEntry = (sessionToken) => {
//   const deleteSessionQuery = 'DELETE FROM sessions WHERE session_token = $1';

//   pool.query(deleteSessionQuery, [sessionToken], (error, result) => {
//     if (error) {
//       console.error('Error deleting session entry:', error);
//     } else {
//       console.log('Session entry deleted for session token:', sessionToken);
//     }
//   });
// };

// const logout = async (req, res, next) => {
//   console.log('In logout route - req.session:', req.session);
//   console.log('In logout route - req.session.user:', req.session.user);
//   // console.log('username: ', req.session.user.username);
//   try {
//     // Check if there is an active session and user in the session
//     if (!req.session.user || !req.session.user.username) {
//       return res.status(401).json({ error: 'No active session found' });
//     }

//     // Get the username from the session
//     const username = req.session.user.username;

//     // Find the user's user_id based on the username
//     const userQuery = 'SELECT user_id FROM users WHERE username = $1';
//     const userResult = await pool.query(userQuery, [username]);

//     if (userResult.rows.length === 0) {
//       return res.status(401).json({ error: 'User not found in the database' });
//     }

//     const userId = userResult.rows[0].user_id;

//     // Delete all sessions for the user from the database
//     const deleteSessionQuery = 'DELETE FROM sessions WHERE user_id = $1';
//     await pool.query(deleteSessionQuery, [userId]);

//     // Clear the session cookie to log the user out
//     res.clearCookie('connect.sid'); // Replace with your session cookie name

//     // Destroy the session
//     req.session.destroy((err) => {
//       if (err) {
//         console.error('Error destroying the session:', err);
//         return res.status(500).json({ error: 'Failed to destroy the session' });
//       }

//       // Send a successful logout response
//       return res.status(200).json({ message: 'Logout successful' });
//     });
//   } catch (error) {
//     console.error('Error in logout route:', error);
//     return next({
//       log: 'Error in userController.logout middleware',
//       status: 500,
//       message: 'An error occurred during logout.',
//     });
//   }
// };





module.exports = {
  registerUser,
  loginUser,
  updateServiceAddresses,
  logout,
  getAdresses,
};


// const updateServiceAddresses = async (req, res, next) => {
//   const username = req.params.username;

//   try {
//     // Check if the session token exists in the request's cookies
//     //new 218 -222
    
//     if (!req.session.user || !req.session.user.id) {
//       return res.status(401).json({ error: 'You must be logged in...' });
//     }
//     // Check if the user exists
//     // Debugging: Check if the user exists
//     console.log('Session data is valid.');

//     const userQuery = 'SELECT * FROM users WHERE username = $1';
//     const userResult = await pool.query(userQuery, [username]);
//     console.log(userResult);

//     if (userResult.rows.length === 0) {
//       console.log('User not found');
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const existingAddresses = userResult.rows[0].service_addresses || [];
//     console.log('Existing Addresses:', existingAddresses);
//     console.log('New Service Addresses:', service_addresses);



//     // Merge the new service addresses with the existing ones
//     const updatedAddresses = existingAddresses.concat(service_addresses);
//     console.log(updatedAddresses);
//     // Update the service_addresses array for the user in the database
//     const updateUserQuery =
//       'UPDATE users SET service_addresses = $1 WHERE username = $2';
//       console.log('SQL Query:', updateUserQuery);
//     const result = await pool.query(updateUserQuery, [updatedAddresses, username]);
//     console.log('Database result:', result);

//     res.json({ message: 'Service addresses updated successfully' });
//   } catch (error) {
//     console.error('Error in userController.updateServiceAddresses:', error);

//     return next({
//       log: 'Error in userController.updateServiceAddresses middleware',
//       status: 500,
//       message: 'An error occurred during service address update.',
//     });
//   }
// };

// const updateServiceAddresses = async (req, res, next) => {
//   const username = req.params.username;
//   const service_addresses = req.body.service_addresses; // Assuming this is provided in the request body

//   try {
//     // Check if the session token exists in the request's cookies
//     if (!req.session.user || !req.session.user.id) {
//       return res.status(401).json({ error: 'You must be logged in...' });
//     }

//     // Check if the user exists
//     const userQuery = 'SELECT * FROM users WHERE username = $1';
//     const userResult = await pool.query(userQuery, [username]);

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const userId = userResult.rows[0].user_id;

//     // Check if the user has an active session
//     const sessionQuery = 'SELECT * FROM sessions WHERE user_id = $1 AND session_status = $2';
//     const sessionResult = await pool.query(sessionQuery, [userId, 'active']);

//     if (sessionResult.rows.length === 0) {
//       return res.status(401).json({ error: 'User does not have an active session' });
//     }

//     const existingAddresses = userResult.rows[0].service_addresses || [];

//     // Merge the new service addresses with the existing ones
//     const updatedAddresses = existingAddresses.concat(service_addresses);

//     // Update the service_addresses array for the user in the database
//     const updateUserQuery =
//       'UPDATE users SET service_addresses = $1 WHERE username = $2';
//     const result = await pool.query(updateUserQuery, [updatedAddresses, username]);

//     res.json({ message: 'Service addresses updated successfully' });
//   } catch (error) {
//     console.error('Error in userController.updateServiceAddresses:', error);

//     return next({
//       log: 'Error in userController.updateServiceAddresses middleware',
//       status: 500,
//       message: 'An error occurred during service address update.',
//     });
//   }
// };

// const logout = async (req, res, next) => {
//   try {
//     if (req.session.user && req.session.user.id) {
//       // Extract the user's ID from the session
//       const userId = req.session.user.id;

//       // Find the most recent active session for the user
//       const activeSessionQuery = `
//         SELECT session_id 
//         FROM sessions 
//         WHERE user_id = $1 
//         AND session_status = 'active' 
//         ORDER BY login_time DESC 
//         LIMIT 1`;

//       const activeSessionResult = await pool.query(activeSessionQuery, [userId]);

//       if (activeSessionResult.rows.length > 0) {
//         const sessionId = activeSessionResult.rows[0].session_id;

//         // Update the session_status to 'inactive' or 'logged_out'
//         const updateSessionStatusQuery = `
//           UPDATE sessions 
//           SET session_status = 'inactive' 
//           WHERE session_id = $1`;

//         await pool.query(updateSessionStatusQuery, [sessionId]);

//         // Then, delete the session record
//         const deleteSessionQuery = `
//           DELETE FROM sessions 
//           WHERE session_id = $1`;

//         await pool.query(deleteSessionQuery, [sessionId]);

//         // Clear the session cookie to log the user out
//         res.clearCookie('ssid'); // Replace 'ssid' with your session cookie name

//          // Destroy the session
//          req.session.destroy();

//         // Send a successful logout response
//         return res.status(200).json({ message: 'Logout successful' });
//       }

//       // Handle the case where there is no active session for the user
//       return res.status(401).json({ error: 'No active session found' });
//     }

//     // Handle the case where there is no active session for the user
//     return res.status(401).json({ error: 'No active session found' });
//   } catch (error) {
//     console.error('Error in logout route:', error);
//     return next({
//       log: 'Error in userController.logout middleware',
//       status: 500,
//       message: 'An error occurred during logout.',
//     });
//   }
// };






// const registerUser = async (req, res, next) => {
//   const { username, password, email } = req.body;

//   try {
//     // Check if the username already exists
//     const usernameExists = await checkIfUsernameExists(username);

//     if (usernameExists) {
//       return res.status(400).json({ error: 'Username already exists' });
//     }

//     // Hash the password before storing it in the database
//     const saltRounds = 10; // Define the number of salt rounds
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insert the new user into the users table with the hashed password
//     const insertUserQuery =
//       'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING user_id';
//     const insertUserResult = await pool.query(insertUserQuery, [username, hashedPassword, email]);
//     const userId = insertUserResult.rows[0].user_id;

//     // Generate a session token
//     const sessionToken = require('crypto').randomBytes(32).toString('hex');

//     // Insert the session data into the sessions table
//     const currentDate = new Date();
//     const insertSessionQuery =
//       'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
//     await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);

//     // Set a session for the new user
//     req.session.user = {
//       id: userId,
//       username: username,
//     };

//     // Optionally, set a cookie to store the user's session ID
//     res.cookie('ssid', sessionToken, {
//       httpOnly: true,
//     });

//     // Console log the session user
//     console.log('Session User:', req.session.user);

//     res.status(201).json({ user_id: userId, username: username });
//   } catch (error) {
//     return next({
//       log: 'Error in userController.registerUser middleware',
//       status: 500,
//       message: 'An error occurred during user registration.',
//     });
//   }
// };

// const loginUser = async (req, res, next) => {
//   const { username, password } = req.body;

//   // Check if the user is already authenticated
//   if (req.session.user) {
//     // User is already logged in, retrieve session information
//     return handleAlreadyLoggedIn(req, res);
//   }

//   try {
//     console.log('Username:', username); // Log the username
//     const user = await getUserByUsername(username);
//     console.log('User:', user); // Log the user object

//     if (!user) {
//       console.log('User not found'); // Log when the user is not found
//       return handleInvalidUsernameOrPassword(res);
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       console.log('Provided password:', password);
//       console.log('Stored password:', user.password);
//       console.log('Invalid password'); // Log when the password is invalid
//       return handleInvalidUsernameOrPassword(res);
//     }

//     const activeSessionToken = await getActiveSessionToken(user.user_id);

//     if (activeSessionToken) {
//       return handleExistingActiveSession(req, res, user, activeSessionToken);
//     }

//     // If there is no active session, create a new session
//     const sessionToken = generateSessionToken();
//     console.log('Generated session token:', sessionToken);

//     // Insert the session data into the sessions table
//     const currentDate = new Date();
//     await insertNewSession(user.user_id, sessionToken, currentDate);

//     // Create and set a session for the logged-in user
//     createAndSetUserSession(req, res, user, sessionToken); // Pass res as a parameter

//      // Set the user data in the session
//      req.session.user = {
//       user_id: user.user_id,
//       username: user.username,
//       service_addresses: user.service_addresses || [],
//     };

//     return handleSuccessfulLogin(res, user);
//   } catch (error) {
//     console.error('Error in userController.loginUser:', error);
//     return next({
//       log: 'Error in userController.loginUser middleware',
//       status: 500,
//       message: 'An error occurred during user login.',
//     });
//   }
// };



// // Helper functions for better organization

// async function getUserByUsername(username) {
//   const userQuery = 'SELECT user_id, password, service_addresses FROM users WHERE username = $1';
//   const userResult = await pool.query(userQuery, [username]);
//   return userResult.rows[0];
// }

// function handleAlreadyLoggedIn(req, res) {
//   const sessionUser = req.session.user;
//   const serviceAddresses = sessionUser.service_addresses || [];
//   return res.status(200).json({
//     message: 'User is already logged in',
//     service_addresses: serviceAddresses,
//     username: sessionUser.username,
//   });
// }

// function handleInvalidUsernameOrPassword(res) {
//   console.log('Invalid username or password.');
//   return res.status(401).json({ error: 'Invalid username or password' });
// }

// async function getActiveSessionToken(userId) {
//   const activeSessionQuery = 'SELECT session_token FROM sessions WHERE user_id = $1 AND session_status = \'active\'';
//   const activeSessionResult = await pool.query(activeSessionQuery, [userId]);
//   return activeSessionResult.rows[0]?.session_token || null;
// }

// async function handleExistingActiveSession(req, res, user, activeSessionToken) {
//   console.log('Using existing session token:', activeSessionToken);
//   console.log('User Data:', {
//     id: user.user_id,
//     username: user.username,
//     service_addresses: user.service_addresses,
//   });

//   createAndSetUserSession(req, res, user, activeSessionToken); // Pass res as a parameter

//   const serviceAddresses = user.service_addresses || [];
//   console.log('User already has an active session');
//   return res.status(200).json({
//     message: 'User already has an active session',
//     service_addresses: serviceAddresses,
//     username: user.username,
//   });
// }


// async function insertNewSession(userId, sessionToken) {
//   const insertSessionQuery =
//     'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
//   const currentDate = new Date();
//   await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);
// }

// function createAndSetUserSession(req, res, user, sessionToken) {
//   req.session.user = {
//     id: user.user_id,
//     username: user.username,
//     service_addresses: user.service_addresses,
//   };
//   res.cookie('ssid', sessionToken, {
//     httpOnly: true,
//   });
// }

// function handleSuccessfulLogin(res, user) {
//   const serviceAddresses = user.service_addresses || [];
//   console.log('Login successful, sending response');
//   return res.status(200).json({
//     message: 'Login successful',
//     service_addresses: serviceAddresses,
//     username: user.username,
//   });
// }

// const updateServiceAddresses = async (req, res, next) => {
//   const username = req.params.username;
//   // const service_addresses = req.body.service_addresses; // Assuming this is provided in the request body as a nested array

//   // Check if the user is already authenticated
//   if (!req.session.user) {
//     return res.status(401).json({ error: 'User is not authenticated' });
//   }

//   try {
//     // Check if the user exists
//     const userQuery = 'SELECT * FROM users WHERE username = $1';
//     const userResult = await pool.query(userQuery, [username]);

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const userId = userResult.rows[0].user_id;

//      // Ensure that the authenticated user matches the user being updated
//      if (req.session.user.id !== userId) {
//       return res.status(403).json({ error: 'User is not authorized to update service addresses for this user' });
//     }

//     // Check if there's an active session for the user
//     const sessionQuery = 'SELECT * FROM sessions WHERE user_id = $1 AND session_status = $2';
//     const sessionResult = await pool.query(sessionQuery, [userId, 'active']);

//     if (sessionResult.rows.length === 0) {
//       return res.status(401).json({ error: 'User does not have an active session' });
//     }

//     const existingAddresses = userResult.rows[0].service_addresses || [];

//     // Flatten the nested array and remove duplicates
//     const flattenedServiceAddresses = [].concat(...service_addresses);
//     const newAddresses = flattenedServiceAddresses.filter(
//       (address) => !existingAddresses.includes(address)
//     );

//     if (newAddresses.length === 0) {
//       return res.status(400).json({ error: 'No new service addresses to add' });
//     }

//     // Merge the new service addresses with the existing ones
//     const updatedAddresses = existingAddresses.concat(newAddresses);

//     // Update the service_addresses array for the user in the database
//     const updateUserQuery =
//       'UPDATE users SET service_addresses = $1 WHERE username = $2';
//     const result = await pool.query(updateUserQuery, [updatedAddresses, username]);

//     res.json({ message: 'Service addresses updated successfully' });
//   } catch (error) {
//     console.error('Error in userController.updateServiceAddresses:', error);

//     return next({
//       log: 'Error in userController.updateServiceAddresses middleware',
//       status: 500,
//       message: 'An error occurred during service address update.',
//     });
//   }
// };

