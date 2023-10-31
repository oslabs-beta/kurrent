const pool = require('../db');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  console.log('Request Body:', req.body); 
  const { username, password, email } = req.body;
  // console.log('Username:', username);
  // console.log('Password:', password);
  // console.log('Email:', email);

  try {
    // Check if the username already exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before storing it in the database
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    console.log('Password:', password);
    console.log('Salt Rounds:', saltRounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database with the hashed password
    const newUser = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, email]
    );

    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const hashedPassword = user.rows[0].password;

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // If login is successful, include service_addresses in the response
    const serviceAddresses = user.rows[0].service_addresses || [];

    res.json({
      message: 'Login successful',
      service_addresses: serviceAddresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
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
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// const getServiceAddresses = async (req, res) => {
//   const { username } = req.params;

//   try {
//     // Check if the user exists
//     const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

//     if (user.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Extract the service addresses
//     const serviceAddresses = user.rows[0].service_addresses || [];

//     res.json({ service_addresses: serviceAddresses });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


module.exports = { registerUser, loginUser, updateServiceAddresses};

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


// const loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

//     if (user.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     const hashedPassword = user.rows[0].password;

//     // Compare the provided password with the stored hashed password
//     const passwordMatch = await bcrypt.compare(password, hashedPassword);

//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     res.json({ message: 'Login successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
