const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getPerformance,
  getHistory,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/performance', getPerformance);
router.get('/history', getHistory);

module.exports = router;
