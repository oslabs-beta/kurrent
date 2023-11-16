// Mock any functions or objects you use from pg-promise

class MockPool {
  constructor(connection) {
    this.connection = connection;
  }

  query(query, values) {
    // Implement your desired behavior for the query method.
    // For testing purposes, you might want to return mock data.
    // For example, you can return an array of objects.
    return Promise.resolve([]);
  }

  connect() {
    return Promise.resolve(this);
  }
}

module.exports = {
  Pool: MockPool,
};

// pgPromise.mock = jest.fn(() => ({
//     any: jest.fn(),
//     // add any other methods you use
//   }));
  
//   module.exports = pgPromise;