// db.js
const { Pool } = require('pg');

// I used this query to create table
// CREATE TABLE users (
//     user_id serial PRIMARY KEY,
//     email VARCHAR(255) NOT NULL,
//     username VARCHAR(255),
//     password VARCHAR(255) NOT NULL,
//     service_addresses text[][]
// );
const myURI = 'postgres://owpkxuij:RCy03blF6Cmvz4cUiYQFEUZujP8ublao@castor.db.elephantsql.com/owpkxuij'
const pool = new Pool({connectionString: myURI});

//I used this query to create sessions
// CREATE TABLE sessions (
//   session_id serial PRIMARY KEY,
//   user_id INT REFERENCES users(user_id),
//   session_token VARCHAR(255) NOT NULL,
//   login_time timestamp,
//   session_status VARCHAR(20) DEFAULT 'active'
// );


// Attempt to connect to the database using the connection pool.
pool.connect()
  .then(() =>{
    console.log("Database is connected")
  })
  .catch((error) => {
    console.log('Database connection error: ', error);
  })

module.exports = pool;
