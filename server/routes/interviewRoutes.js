const express = require('express');
const router = express.Router();
const {
  createInterview,
  getInterviews,
  getInterviewById,
  startInterview,
  completeInterview,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(createInterview).get(getInterviews);
router.route('/:id').get(getInterviewById);
router.post('/:id/start', startInterview);
router.post('/:id/complete', completeInterview);

module.exports = router;
