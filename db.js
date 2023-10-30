// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://owpkxuij:RCy03blF6Cmvz4cUiYQFEUZujP8ublao@castor.db.elephantsql.com/owpkxuij',
});

module.exports = pool;
