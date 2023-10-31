// db.js
const { Pool } = require('pg');
require('dotenv').config();
// I used this query to create table
// CREATE TABLE users (
//     user_id serial PRIMARY KEY,
//     username VARCHAR(255) NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     email VARCHAR(255)
// );

const pool = new Pool({
  connectionString: process.env.POSTGRES,
});

module.exports = pool;
