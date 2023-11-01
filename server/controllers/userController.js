const pool = require('../db');
const bcrypt = require('bcrypt');
const express = require('express');
const session = require('express-session');


const registerUser = async (req, res, next) => {
  const { username, password, email } = req.body;

  try {
    // Check if the username already exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before storing it in the database
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    console.log("Password:", password);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database with the hashed password
    const newUser = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, email]
    );

    res.json(newUser.rows[0]);
  } catch (error) {
    return next({
      log: 'Error in userController.registerUser middleware',
      status: 500,
      message: 'An error occurred during user registration.'
    })
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const hashedPassword = user.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // If login is successful, set session data
    // req.session.username = username;
    // req.session.loggedIn = true;

    // Include service_addresses in the response
    const serviceAddresses = user.rows[0].service_addresses || [];

    res.json({
      message: 'Login successful',
      service_addresses: serviceAddresses,
    });
  } catch (error) {
    return next({
      log: 'Error in userController.loginUser middleware',
      status: 500,
      message: { err: error }
    })
  }
};


const updateServiceAddresses = async (req, res) => {
  const { username } = req.params;
  const { service_addresses } = req.body;

  try {
    // Check if the user exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingAddresses = user.rows[0].service_addresses || [];
    
    // Check for duplicates in the new service addresses
    const duplicateAddresses = service_addresses.filter((address) => existingAddresses.includes(address));

    if (duplicateAddresses.length > 0) {
      return res.status(400).json({ error: 'Service addresses already exist', duplicates: duplicateAddresses });
    }

    // Merge the new service addresses with the existing ones
    const updatedAddresses = [...existingAddresses, ...service_addresses];

    // Update the service_addresses array for the user
    const updatedUser = await pool.query(
      'UPDATE users SET service_addresses = $1 WHERE username = $2 RETURNING *',
      [updatedAddresses, username]
    );

    res.json(updatedUser.rows[0]);
  } catch (error) {
    return next({
      log: 'Error in userController.updateServiceAddresses  middleware',
      status: 500,
      message: { err: error }
    })
  }
};


module.exports = { registerUser, loginUser, updateServiceAddresses };

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
