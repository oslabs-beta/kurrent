// Mock any functions or objects you use from pg-promise
pgPromise.mock = jest.fn(() => ({
    any: jest.fn(),
    // add any other methods you use
  }));
  
  module.exports = pgPromise;