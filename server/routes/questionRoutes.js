const express = require('express');
const router = express.Router();
const { getQuestions, submitAnswer } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/interview/:id', getQuestions);
router.post('/:id/answer', submitAnswer);

module.exports = router;
