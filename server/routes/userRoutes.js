const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// login and save new user to db
router.post('/register', (req, res, next) => {
  console.log('Entering register route...');
  userController.registerUser(req, res, next);
  console.log('Exiting register route...');
});

// login existing user
router.post('/login', (req, res, next) => {
  console.log('Entering login route...');
  userController.loginUser(req, res, next);
  console.log('Exiting login route...');
});

// update users prometheus server addresses in DB
router.patch('/update-service-addresses/:username', (req, res, next) => {
  console.log('Entering update service addresses route...');
  userController.updateServiceAddresses(req, res, next);
  console.log('Entering update service addresses route...');
});

// logout user, remove current session from DB
router.get('/logout', (req, res, next) => {
  console.log('Entering logout route...');
  userController.logout(req, res, next);
  console.log('Exiting logout route...');
});

module.exports = router;
