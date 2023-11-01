// db.js
const { Pool } = require('pg');

// I used this query to create table
// CREATE TABLE users (
//     user_id serial PRIMARY KEY,
//     username VARCHAR(255) NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     email VARCHAR(255),
//     service_addresses text[][]
// );

//I used this query to create sessions
// CREATE TABLE sessions (
//   session_id serial PRIMARY KEY,
//   user_id INT REFERENCES users(user_id),
//   session_token VARCHAR(255) NOT NULL,
//   created_at timestamp NOT NULL,
//   last_active timestamp NOT NULL,
//   active BOOLEAN DEFAULT true

//     email VARCHAR(255)
// );

const pool = new Pool({
  connectionString: process.env.POSTGRES,
});

// Attempt to connect to the database using the connection pool.
pool.connect()
  .then(() =>{
    console.log("Database is connected")
  })
  .catch((error) => {
    console.log('Database connection error: ', error);
  });

module.exports = pool;
