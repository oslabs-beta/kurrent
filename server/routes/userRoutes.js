// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.patch('/update-service-addresses/:username', userController.updateServiceAddresses);
// router.get('/service-addresses/:username', userController.getServiceAddresses);


module.exports = router;

