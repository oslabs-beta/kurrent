const pool = require('../db');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the username already exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before storing it in the database
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
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

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };

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
