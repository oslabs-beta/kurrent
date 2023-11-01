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
    const insertUserQuery = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING user_id';
    const insertUserResult = await pool.query(insertUserQuery, [username, hashedPassword, email]);
    const userId = insertUserResult.rows[0].user_id;

    // Create a session token
    const sessionToken = generateSessionToken();

    // Insert the session data into the sessions table
    const insertSessionQuery = 'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
    const currentDate = new Date();
    await pool.query(insertSessionQuery, [userId, sessionToken, currentDate]);

    // Create and set a session for the new user
    req.session.user = {
      id: userId,
      username: username,
    };

    // Optionally, set a cookie to store the user's session ID
    res.cookie('ssid', sessionToken, {
      httpOnly: true,
    });

    res.status(201).json({ user_id: userId, username: username });

  } catch (error) {
    return next({
      log: 'Error in userController.registerUser middleware',
      status: 500,
      message: 'An error occurred during user registration.'
    });
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Query the user by username to get the user_id
    const userQuery = 'SELECT user_id, password FROM users WHERE username = $1';
    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      // Log that an invalid username or password was provided
      console.log('Invalid username or password');
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = userResult.rows[0];
    const hashedPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      // Log that an invalid username or password was provided
      console.log('Invalid username or password');
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create a session token
    const sessionToken = generateSessionToken();
    console.log('Generated session token:', sessionToken);

    // Insert the session data into the sessions table
    const insertSessionQuery = 'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
    const currentDate = new Date();
    await pool.query(insertSessionQuery, [user.user_id, sessionToken, currentDate]);

    // Create and set a session for the logged-in user
    req.session.user = {
      id: user.user_id,
      username: username,
    };

    // Optionally, set a cookie to store the user's session ID
    res.cookie('ssid', sessionToken, {
      httpOnly: true,
    });

    // Include service_addresses in the response
    const serviceAddresses = user.service_addresses || [];

    // Log the response being sent
    console.log('Login successful, sending response');
    res.json({
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


const updateServiceAddresses = async (req, res, next) => {
  const { username } = req.params;
  // const { username } = req.session.user
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

    // Check for duplicates by comparing the addresses
    const duplicateAddresses = service_addresses.filter((newAddress) =>
      existingAddresses.some((existingAddress) => areServiceAddressesEqual(existingAddress, newAddress))
    );

    if (duplicateAddresses.length > 0) {
      return res.status(400).json({ error: 'Service addresses already exist', duplicates: duplicateAddresses });
    }

    // Merge the new service addresses with the existing ones
    const updatedAddresses = existingAddresses.concat(service_addresses);

    // Update the service_addresses array for the user in the database
    const updateUserQuery = 'UPDATE users SET service_addresses = $1 WHERE username = $2';
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

function areServiceAddressesEqual(address1, address2) {
  return address1[0] === address2[0] && address1[1] === address2[1];
}
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

      // Query the sessions table to find the most recent session for the user
      const session = await pool.query(
        'SELECT session_id FROM sessions WHERE user_id = $1 ORDER BY login_time DESC LIMIT 1',
        [userId]
      );

      // Check if a session was found
      if (session.rows.length > 0) {
        const sessionId = session.rows[0].session_id;

        // Delete the session record from the sessions table
        await pool.query('DELETE FROM sessions WHERE session_id = $1', [sessionId]);

        // Clear the session cookie to log the user out
        res.clearCookie('ssid'); // Replace 'ssid' with your session cookie name

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


module.exports = { registerUser, loginUser, updateServiceAddresses, logout };








// // controllers/userController.js
// const pool = require('../db'); // You'll create the 'db.js' file to set up your database connection.

// const registerUser = async (req, res) => {
//   const { username, password, email } = req.body;

//   try {
//     // Check if the username already exists
//     const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

//     if (user.rows.length > 0) {
//       return res.status(400).json({ error: 'Username already exists' });
//     }

//     // Insert the new user into the database
//     const newUser = await pool.query(
//       'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
//       [username, password, email]
//     );

//     res.json(newUser.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [
//       username,
//       password,
//     ]);

//     if (user.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     res.json({ message: 'Login successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = { registerUser, loginUser };

// const updateServiceAddresses = async (req, res, next) => {
//   const { username } = req.params;
//   const { service_addresses } = req.body;

//   try {
//     // Check if the user exists
//     const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

//     if (user.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const existingAddresses = user.rows[0].service_addresses || [];
    
//     // Check for duplicates in the new service addresses
//     const duplicateAddresses = service_addresses.filter((address) => existingAddresses.includes(address));

//     if (duplicateAddresses.length > 0) {
//       return res.status(400).json({ error: 'Service addresses already exist', duplicates: duplicateAddresses });
//     }

//     // Merge the new service addresses with the existing ones
//     const updatedAddresses = [...existingAddresses, ...service_addresses];

//     // Update the service_addresses array for the user
//     const updatedUser = await pool.query(
//       'UPDATE users SET service_addresses = $1 WHERE username = $2 RETURNING *',
//       [updatedAddresses, username]
//     );

//     res.json(updatedUser.rows[0]);
//   } catch (error) {
//     return next({
//       log: 'Error in userController.updateServiceAddresses  middleware',
//       status: 500,
//       message: { err: error }
//     })
//   }
// };
