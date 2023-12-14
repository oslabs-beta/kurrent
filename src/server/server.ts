import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import path from 'path';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// importing server routes to be used
import userRoutes from './routes/userRoutes';
import metricsRoutes from './routes/metricsRoutes';

// importing types to be used
import { ServerError } from '../types'
const app = express();
app.use(express.json());
