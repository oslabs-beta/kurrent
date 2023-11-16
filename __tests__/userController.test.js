// __tests__/userController.test.js


const userController = require('../server/controllers/userController');
const db = require('../server/db');

jest.mock('../server/controllers/userController', () => ({
  ...jest.requireActual('../server/controllers/userController'),
  hashPassword: jest.fn(),
  createUser: jest.fn(),
  getUserByCredential: jest.fn(),
  verifyPassword: jest.fn(),
}));

jest.mock('../server/db', () => ({
  query: jest.fn(),
}));

const expectedUsernameCheckQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
const expectedUserInsertionQuery = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING user_id';

const req = {
  body: {
    username: 'existinguser',
    password: 'correctpassword',
  },
};

const res = {
  locals: {},
};

const next = jest.fn();

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Register User Test Cases
  it('should register a new user', async () => {
    const req = {
      body: {
        username: 'newuser',
        password: '123pass',
        email: 'newuser@example.com',
      },
    };
    const res = {
      locals: {},
    };
    const next = jest.fn();

    db.query.mockResolvedValueOnce({ rows: [] });
    jest.spyOn(userController, 'hashPassword').mockResolvedValueOnce('hashedPassword123');

    await userController.registerUser(req, res, next);

    expect(db.query).toHaveBeenCalledWith(expectedUsernameCheckQuery, ["newuser", "newuser@example.com"]);
    expect(db.query).toHaveBeenCalledWith(expectedUserInsertionQuery, ["newuser", expect.any(String), "newuser@example.com"]);
    expect(next).toHaveBeenCalled();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  

  it('should return 400 if username or email already exists', async () => {
    const req = {
      body: {
        username: 'existinguser',
        password: 'password123',
        email: 'existinguser@example.com',
      },
    };

    const res = {
      locals: {},
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const next = jest.fn();

    db.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] });

    await userController.registerUser(req, res, next);

    expect(db.query).toHaveBeenCalledWith(expectedUsernameCheckQuery, ["existinguser", "existinguser@example.com"]);
    expect(db.query).not.toHaveBeenCalledWith(expectedUserInsertionQuery, expect.any(Array));
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Username or email already exists' });
    expect(next).not.toHaveBeenCalled();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
});





