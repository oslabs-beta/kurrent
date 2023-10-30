const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

router.post('/', metricsController.getAllMetrics, (req, res) => {
  return res.status(200).json(res.locals.metrics);
});

module.exports = router;
