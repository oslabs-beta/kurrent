const { 
    generateSessionToken, 
    setSSIDCookie, 
  
} = require('../server/controllers/sessionController');
const crypto = require('crypto');

// Mocking crypto.randomBytes to always return a fixed value for testing
jest.mock('crypto');
crypto.randomBytes.mockReturnValue(Buffer.from('a1b2c3d4e5f6', 'hex'));

describe('generateSessionToken', () => {
  it('should generate a session token', () => {
    const token = generateSessionToken();
    expect(token).toBe('a1b2c3d4e5f6');
  });
});

describe('setSSIDCookie', () => {
  // Mocking res.cookie and next function
  const res = {
    cookie: jest.fn(),
    locals: { sessionToken: 'a1b2c3d4e5f6' },
  };
  const next = jest.fn();

  it('should set the SSID cookie with the correct options', () => {
    const req = {}; // Mock req object
    const middleware = setSSIDCookie(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith('ssid', 'a1b2c3d4e5f6', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
    });
    expect(next).toHaveBeenCalled();
    expect(middleware).toBeUndefined();
  });

  it('should handle errors and call the next function with an error object', () => {
    // Mocking a situation where an error occurs
    res.cookie.mockImplementationOnce(() => {
      throw new Error('Mocked cookie setting error');
    });

    const req = {}; // Mock req object
    setSSIDCookie(req, res, next);

    expect(next).toHaveBeenCalledWith({
      log: expect.any(String),
      status: 500,
      message: 'An error occurred when attempting to set a cookie',
    });
  });
});


