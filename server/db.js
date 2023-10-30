// db.js
const { Pool } = require('pg');
// I used this query to create table
// CREATE TABLE users (
//     user_id serial PRIMARY KEY,
//     username VARCHAR(255) NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     email VARCHAR(255)
// );

const pool = new Pool({
  connectionString: '',
});

module.exports = pool;
