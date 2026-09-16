const express = require('express');
const router = express.Router();
const { runCode, submitCode } = require('../controllers/codingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/run', runCode);
router.post('/submit', submitCode);

module.exports = router;
