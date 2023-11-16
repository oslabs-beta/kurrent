
class MockPool {
  constructor(config) {
    this.config = config;
  }

  query(query, values) {
    // Implement your desired behavior for the query method.
    // For testing purposes, you might want to return mock data.
    // For example, you can return { rows: [] }.
    return Promise.resolve({ rows: [] });
  }

  connect() {
    return Promise.resolve();
  }
}

module.exports = {
  Pool: MockPool,
};

// class MockPool {
//     connect() {
//       return Promise.resolve();
//     }
//   }
  
//   module.exports = {
//     Pool: MockPool,
//   };