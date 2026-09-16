const express = require('express');
const router = express.Router();
const { register, login, demoLogin, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/demo', demoLogin);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
