import { NextFunction, Request, Response, RequestHandler } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';

type Controller = {
  registerUser: RequestHandler;
  loginUser: RequestHandler;
  updateServiceAddresses: RequestHandler;
  logout: RequestHandler;
};
type ServiceAddresses = [] | string[];

export const userController: Controller = {
  // login new user, save user data to db, start new session, set cookies
  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, password, email } = req.body;
    res.locals.username = req.body.username;
    try {
      // Check if the username already exists
      const usernameExists = await pool.query(
        'SELECT * FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );
      if (usernameExists.rows.length)
        return next({
          log: 'Error in userController.registerUser middleware: user already exists',
          status: 400,
          message: 'Username or email already exists',
        });
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert the new user into the users table with the hashed password
      const newUser = await pool.query(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING user_id',
        [username, hashedPassword, email]
      );
      res.locals.userId = newUser.rows[0].user_id;

      return next();
    } catch (error) {
      return next({
        log: 'Error in userController.registerUser middleware: ' + error,
        status: 500,
        message: 'An error occurred during user registration.',
      });
    }
  },

  // login existing user, set new session in db, set cookie
  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, password } = req.body;
    res.locals.username = username;
    try {
      // Check if the user exists in the database
      const user = await pool.query(
        'SELECT * FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1)',
        [username.toLowerCase()]
      );
      if (!user) {
        return next({
          log: 'Incorrect credentials attempted for login',
          status: 401,
          message: 'Incorrect username or password',
        });
      }

      // Verify the password against the hashed password in the database
      const isPasswordValid = await bcrypt.compare(
        password,
        user.rows[0].password
      );
      if (!isPasswordValid) {
        return next({
          log: 'Incorrect credentials attempted for login',
          status: 401,
          message: 'Incorrect username or password',
        });
      }

      // Save service_addresses from the user's record
      const serviceAddresses: ServiceAddresses =
        user.rows[0].service_addresses || [];
      res.locals.serviceAddresses = serviceAddresses;
      res.locals.userId = user.rows[0].user_id;

      return next();
    } catch (error) {
      console.error('Error in userController.loginUser middleware:', error);
      return next({
        log: 'Error in userController.loginUser middleware',
        status: 500,
        message: 'An error occurred during user login.',
      });
    }
  },

  // update user's prometheus server addresses in db
  async updateServiceAddresses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const username = req.params.username;
    const service_addresses: string = req.body.service_addresses;
    try {
      // check if user is logged in
      if (!req.cookies.ssid) {
        return next({
          log: 'Error in userController.updateServiceAddresses middleware: unauthorized attempt',
          status: 401,
          message: 'You must be logged in to perform this action',
        });
      }

      // Check if the user exists in db
      const userResult = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      if (!userResult.rows.length) {
        return next({
          log: 'Error in userController.updateServiceAddresses middleware: unauthorized attempt',
          status: 404,
          message: 'User not found',
        });
      }

      // cache the user's stored service addresses
      const existingAddresses: ServiceAddresses =
        userResult.rows[0].service_addresses || [];

      // Check for duplicates in the new service_addresses
      const duplicates = existingAddresses.some(
        (existingAddress) =>
          JSON.stringify(existingAddress) === JSON.stringify(service_addresses)
      );
      if (duplicates) {
        return next({
          log: 'Error in userController.updateServiceAddress middleware: address already exists.',
          status: 400,
          message: 'This service address already exists.',
        });
      }

      // Normalize the format of the incoming service_addresses
      const normalizedAddresses: string[] = [service_addresses];

      // Merge the new service addresses with the existing ones
      const updatedAddresses: string[] = [
        ...existingAddresses,
        ...normalizedAddresses,
      ];

      // Update the service_addresses array for the user in the database
      await pool.query(
        'UPDATE users SET service_addresses = $1 WHERE username = $2',
        [updatedAddresses, username]
      );
      return next();
    } catch (error) {
      return next({
        log: `Error in userController.updateServiceAddresses middleware: ${error}`,
        status: 500,
        message: 'An error occurred during service address update.',
      });
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get the session token from the request cookies
      const sessionToken: string = req.cookies.ssid;
      console.log(sessionToken);
      // retrieve associated session from the database
      await pool.query('DELETE FROM sessions WHERE session_token = $1', [
        sessionToken,
      ]);
      // clear the session cookie
      res.clearCookie('ssid');
      return next();
    } catch (error) {
      return next({
        log: `Error occurred in userController.logout middleware: ${error}`,
        status: 500,
        message: 'Internal server error occurred during logout attempt.',
      });
    }
  },
};
