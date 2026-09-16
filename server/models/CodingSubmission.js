const mongoose = require('mongoose');

const codingSubmissionSchema = new mongoose.Schema(
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
    language: {
      type: String,
      required: true,
      default: 'javascript',
    },
    code: {
      type: String,
      required: true,
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    executionTimeMs: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    correctnessScore: {
      type: Number,
      default: 0,
    },
    codeQualityScore: {
      type: Number,
      default: 0,
    },
    timeComplexityScore: {
      type: Number,
      default: 0,
    },
    spaceComplexityScore: {
      type: Number,
      default: 0,
    },
    timeComplexity: {
      type: String,
      default: 'O(N)',
    },
    spaceComplexity: {
      type: String,
      default: 'O(1)',
    },
    feedback: {
      type: String,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    testResults: [
      {
        testCaseIndex: Number,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean,
        error: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);
