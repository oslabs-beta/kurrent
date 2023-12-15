import { NextFunction, Response, Request, RequestHandler } from 'express';
import pool from '../db';
import crypto from 'crypto';

type Controller = {
  setSSIDCookie: RequestHandler;
  startSession: RequestHandler;
  verifySession: RequestHandler;
};

export const sessionController: Controller = {
  // Function to set the SSID (Session ID) cookie
  setSSIDCookie(req: Request, res: Response, next: NextFunction): void {
    try {
      res.cookie('ssid', res.locals.sessionToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      });
      return next();
    } catch (error) {
      return next({
        log: `Error in sessionController.setSSIDCookie middleware: ${error}`,
        status: 500,
        message: 'An error occurred when attempting to set a cookie',
      });
    }
  },

  // start new session in db
  async startSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const currentDate = new Date();
    let sessionToken: string = req.cookies.ssid;
    if (!sessionToken) {
      sessionToken = crypto.randomBytes(32).toString('hex');
    }
    res.locals.sessionToken = sessionToken;
    try {
      // Check if a session with the provided session token already exists
      const getSessionQuery = 'SELECT * FROM sessions WHERE session_token = $1';
      const result = await pool.query(getSessionQuery, [sessionToken]);

      if (result.rows.length) {
        // If a session already exists, update the session data
        const updateSessionQuery =
          'UPDATE sessions SET user_id = $1, session_token = $2, login_time = $3, session_status = $4 WHERE session_id = $5';
        await pool.query(updateSessionQuery, [
          res.locals.userId,
          sessionToken,
          currentDate,
          'active',
          result.rows[0].id,
        ]);
      } else {
        // If no session exists, create a new session
        const insertSessionQuery =
          'INSERT INTO sessions (user_id, session_token, login_time) VALUES ($1, $2, $3)';
        await pool.query(insertSessionQuery, [
          res.locals.userId,
          sessionToken,
          currentDate,
        ]);
      }

      // // Set the session for the user
      // req.session.user = {
      //   id: res.locals.id,
      //   username: res.locals.username,
      // };
      return next();
    } catch (error) {
      // Handle specific error cases and provide meaningful error messages
      return next({
        log: `Error in sessionController.startSession middleware: ${error}`,
        status: 500,
        message: 'An error occurred when attempting to start your session',
      });
    }
  },

  // verify user session in db
  async verifySession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const ssid = req.cookies.ssid;
    // no ssid cookie
    if (!ssid) {
      return next({
        log: 'Error in verifySession: no ssid',
        status: 401,
        message: { err: 'No active session' },
      });
    }

    try {
      // Get the user's session token from the database
      const sessionTokenQuery =
        'SELECT * FROM sessions INNER JOIN users ON sessions.user_id = users.user_id WHERE sessions.session_token = $1 AND session_status = $2';
      const sessionTokenResult = await pool.query(sessionTokenQuery, [
        ssid,
        'active',
      ]);
      if (sessionTokenResult.rows.length > 0) {
        res.locals.username = sessionTokenResult.rows[0].username;
        res.locals.email = sessionTokenResult.rows[0].email;
        res.locals.serviceAddresses =
          sessionTokenResult.rows[0].service_addresses;
        return next();
      } else {
        return next({
          log: 'Error in verifySession: no active session for user',
          status: 401,
          message: { err: 'No active session' },
        });
      }
    } catch (error) {
      return next({
        log: 'Error in sessionController.verifySession middleware: ' + error,
        status: 500,
        message: 'An error occurred during session verification.',
      });
    }
  },
};
