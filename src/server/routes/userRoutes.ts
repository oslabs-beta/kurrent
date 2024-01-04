import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  Router,
} from 'express';
import { userController } from '../controllers/userController';
import { sessionController } from '../controllers/sessionController';

const router: Router = express.Router();

// login and save new user to db
router.post(
  '/register',
  userController.registerUser,
  sessionController.startSession,
  sessionController.setSSIDCookie,
  (req: Request, res: Response): Response => {
    return res
      .status(200)
      .json({ user_id: res.locals.userId, username: res.locals.username });
  }
);

// login existing user
router.post(
  '/login',
  userController.loginUser,
  sessionController.startSession,
  sessionController.setSSIDCookie,
  (req: Request, res: Response): Response => {
    return res.status(200).json({
      user_id: res.locals.user_id,
      username: res.locals.username,
      session_token: res.locals.session_token,
      service_addresses: res.locals.serviceAddresses,
    });
  }
);

// update users prometheus server addresses in DB
router.patch(
  '/update-service-addresses/:username',
  userController.updateServiceAddresses,
  (req: Request, res: Response, next: NextFunction) => {
    console.log('in the function after updateServiceAddresses');
    return next();
  },
  (req: Request, res: Response): Response => {
    console.log('this is right before returning the response');
    return res.status(200).json({ msg: 'Service Address successfully added' });
  }
);

router.get(
  '/logout',
  userController.logout,
  (req: Request, res: Response): Response => {
    return res.status(200).json({ msg: 'Successfully logged out' });
  }
);

router.get(
  '/',
  sessionController.verifySession,
  (req: Request, res: Response): Response => {
    return res.status(200).json({
      username: res.locals.username,
      service_addresses: res.locals.serviceAddresses,
      email: res.locals.email,
    });
  }
);

export default router;
