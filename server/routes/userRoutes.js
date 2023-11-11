// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//const sessionController = require('../controllers/sessionController');


// router.post('/register', userController.registerUser);
// In userRoutes.js
router.post('/register', (req, res, next) => {
    console.log('Entering register route...');
    userController.registerUser(req, res, next);
    console.log('Exiting register route...');
});
  
router.post('/login', (req, res, next) => {
    console.log('Entering login route...');
    userController.loginUser(req, res, next);
    console.log('Exiting login route...');
});

router.patch('/update-service-addresses/:username', (req, res, next) => {
    console.log('Entering update service addresses route...');
    userController.updateServiceAddresses(req, res, next);
    console.log('Entering update service addresses route...');
});

// router.get('/service-address/:username', userController.getAdresses);

router.get('/logout', (req, res, next) => {
    console.log('Entering logout route...');
    userController.logout(req, res, next);
    console.log('Exiting logout route...');
});
    
module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const sessionController = require('../controllers/sessionController');

// // register a new user
// router.post(
//   '/register',
//   userController.registerUser,
//   sessionController.setSSIDCookie,
//   sessionController.startSession,
//   (req, res) => {
//     return res.status(200).json(res.locals.user);
//   }
// );

// // login an existing user
// router.post(
//   '/login',
//   userController.loginUser,
//   sessionController.setSSIDCookie,
//   sessionController.startSession,
//   (req, res) => {
//     return res.status(200).json(res.locals.user);
//   }
// );

// // update service addresses in db
// router.patch(
//   '/update-service-addresses/:username',
//   sessionController.verifySession,
//   userController.updateServiceAddresses,
//   (req, res) => {
//     return res.status(200);
//   }
// );
// // Logout route
// router.get('/logout', userController.logout);

// // get service addresses from db
// router.get(
//   '/service-address:username',
//   userController.getAdresses,
//   (req, res) => {
//     return res.status(200).json(res.locals.addresses);
//   }
// );
// router.get('/', sessionController.verifySession, (req, res) => {
//   return res.status(200);
// });

// module.exports = router;

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
