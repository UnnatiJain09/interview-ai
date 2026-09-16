const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Store files in disk storage with timestamp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.webm';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'voice-' + uniqueSuffix + ext);
  },
});

// Allow common audio formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'audio/webm',
    'audio/wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/mp4',
    'audio/m4a',
    'audio/x-m4a',
    'video/webm', // Browsers often record audio in video/webm containers
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Please upload an audio file (WEBM, WAV, MP3, M4A).'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter: fileFilter,
});

module.exports = upload;
