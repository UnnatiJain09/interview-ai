const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transcript: {
      type: String,
      default: '',
    },
    answerText: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      default: '',
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    relevance: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    communication: {
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
    completeness: {
      type: Number,
      default: 0,
    },
    technicalKnowledge: {
      type: Number,
      default: 0,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    idealAnswer: {
      type: String,
      default: '',
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Answer', answerSchema);
