const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

// required route: /metrics?promAddress=<prometheus address>
router.get('/metrics', metricsController.getAllMetrics, (req, res) => {
  return res.status(200).json(res.locals.metrics);
});

module.exports = router;
