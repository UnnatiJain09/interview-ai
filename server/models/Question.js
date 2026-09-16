const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['hr', 'technical', 'coding', 'follow-up'],
      default: 'technical',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
    expectedTopics: {
      type: [String],
      default: [],
    },
    followUpTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null,
    },
    // For coding questions
    codingChallenge: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      examples: [
        {
          input: String,
          output: String,
          explanation: String,
        },
      ],
      constraints: [String],
      starterCode: {
        python: String,
        javascript: String,
        java: String,
        cpp: String,
      },
      testCases: [
        {
          input: String,
          expectedOutput: String,
          isHidden: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
