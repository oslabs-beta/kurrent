const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');

// login and save new user to db
router.post(
  '/register',
  userController.registerUser,
  sessionController.startSession,
  sessionController.setSSIDCookie,
  (req, res) => {
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
  (req, res) => {
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
  (req, res) => {return res.status(200)}
);

router.get('/', sessionController.verifySession, (req, res) => {
  return res
    .status(200)
    .json({
      username: res.locals.username,
      service_addresses: res.locals.serviceAddresses,
      email: res.locals.email,
    });
});

// logout user, remove current session from DB
router.get('/logout', userController.logout, (req, res) => {
  return res.status(200).json({msg: 'Successfully logged out'})
}
);

module.exports = router;
