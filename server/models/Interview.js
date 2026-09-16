const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewType: {
      type: String,
      enum: ['HR', 'Technical', 'Coding', 'Full Mock'],
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
      default: 'Full Stack Developer',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    duration: {
      type: Number, // in minutes
      default: 20,
    },
    questionCount: {
      type: Number,
      default: 5,
    },
    mode: {
      type: String,
      enum: ['voice', 'text'],
      default: 'voice',
    },
    preferredLanguage: {
      type: String,
      enum: ['python', 'javascript', 'java', 'cpp'],
      default: 'javascript',
    },
    status: {
      type: String,
      enum: ['configured', 'in-progress', 'completed', 'abandoned'],
      default: 'configured',
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    communicationScore: {
      type: Number,
      default: 0,
    },
    technicalScore: {
      type: Number,
      default: 0,
    },
    codingScore: {
      type: Number,
      default: 0,
    },
    answerQuality: {
      type: Number,
      default: 0,
    },
    clarityScore: {
      type: Number,
      default: 0,
    },
    relevanceScore: {
      type: Number,
      default: 0,
    },
    grammarScore: {
      type: Number,
      default: 0,
    },
    summaryFeedback: {
      type: String,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
