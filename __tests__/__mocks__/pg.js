
class MockPool {
    connect() {
      return Promise.resolve();
    }
  }
  
  module.exports = {
    Pool: MockPool,
  };