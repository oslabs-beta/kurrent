// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');

// register a new user
router.post(
  '/register',
  userController.registerUser,
  sessionController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    return res.status(200).json(res.locals.user);
  }
);

// login an existing user
router.post(
  '/login',
  userController.loginUser,
  sessionController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    return res.status(200).json(res.locals.user);
  }
);

router.patch(
  '/update-service-addresses:username',
  sessionController.verifySession,
  userController.updateServiceAddresses
);
// Logout route
router.get('/logout', userController.logout);
router.get(
  '/service-address:username',
  userController.getAdresses,
  (req, res) => {
    return res.status(200).json(res.locals.addresses);
  }
);
router.get('/', sessionController.verifySession, (req, res) => {
  return res.status(200);
});

module.exports = router;

// router.post('/register', async (req, res, next) => {
//   try {
//     await registerUser(req, res, next);
//   } catch (error) {
//     next(error);
//   }
// });

// // Register a user
// router.post('/register', userController.registerUser, sessionController.createSession);

// // Login a user
// router.post('/login', userController.loginUser, sessionController.createSession);
// router.patch('/update-service-addresses/:username', userController.updateServiceAddresses);
// // Logout a user
// router.post('/logout', sessionController.endSession);
