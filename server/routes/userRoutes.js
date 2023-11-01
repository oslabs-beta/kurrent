// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.patch('/update-service-addresses/:username', userController.updateServiceAddresses);
// Logout route
router.post('/logout', userController.logout);

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
