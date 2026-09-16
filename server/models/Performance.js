const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
    interviewType: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
    },
    technicalScore: {
      type: Number,
      default: 0,
    },
    communicationScore: {
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
    relevance: {
      type: Number,
      default: 0,
    },
    clarity: {
      type: Number,
      default: 0,
    },
    grammar: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Performance', performanceSchema);
