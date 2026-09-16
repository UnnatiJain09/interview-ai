const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { transcribe } = require('../controllers/speechController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/transcribe', upload.single('audio'), transcribe);

module.exports = router;
