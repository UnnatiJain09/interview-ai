require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const server = app.listen(PORT, () => {
  console.log(`
=====================================================
  🚀 InterviewAI Server running on port ${PORT}
  📡 Environment: ${process.env.NODE_ENV || 'development'}
  🔗 API Base: http://localhost:${PORT}/api
  🧠 AI Engine: ${process.env.OPENAI_API_KEY ? 'OpenAI GPT-4o & Whisper' : 'Intelligent Dynamic Simulation Engine'}
=====================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
});
