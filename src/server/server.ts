import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import path from 'path';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'crypto'

// importing server routes to be used
import userRoutes from './routes/userRoutes';
import metricsRoutes from './routes/metricsRoutes';

// importing types to be used
import { ServerError } from '../types'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(cors());

const randomSecret: string = crypto.randomBytes(64).toString('hex')
app.use(session({
  secret: randomSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    httpOnly: true, // Make the cookie accessible only via HTTP requests
    path: '/', // Cookie is valid for all routes
    sameSite: 'None'
  },
}))

// get, set user data in db
app.use('/users', userRoutes);

// get metrics from prometheus server
app.use('/metrics', metricsRoutes);

// redirect get requests to initial login for universal client-side render handling
app.get('/*', (req: Request, res: Response) => {
  res.redirect('/')
});

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error: ' + err,
    status: 500,
    message: { err: 'An error occurred'}
  }
  const errorObj: ServerError = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  if (!res.headersSent) {
    return res.status(errorObj.status).json(errorObj.message);
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});