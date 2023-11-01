// db.js
const { Pool } = require('pg');

// This SQL query is used to create a 'users' table in the database.
// CREATE TABLE users (
//     user_id serial PRIMARY KEY,
//     username VARCHAR(255) NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     email VARCHAR(255),
//     service_addresses VARCHAR(255)[] 
// );
const myURI = 'postgres://owpkxuij:RCy03blF6Cmvz4cUiYQFEUZujP8ublao@castor.db.elephantsql.com/owpkxuij'
const pool = new Pool({connectionString: myURI});

// Attempt to connect to the database using the connection pool.
pool.connect()
  .then(() =>{
    console.log("Database is connected")
  })
  .catch((error) => {
    console.log('Database connection error: ', error);
  })

// Export the 'pool' object to make it available for other parts of your application that require database access.
module.exports = pool;
