const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const CodingSubmission = require('../models/CodingSubmission');
const { startInterviewSession, finalizeInterview } = require('../services/interviewService');

// @desc    Create a new interview configuration
// @route   POST /api/interviews
const createInterview = async (req, res, next) => {
  try {
    const {
      interviewType,
      targetRole,
      difficulty,
      duration,
      questionCount,
      mode,
      preferredLanguage,
    } = req.body;

    const interview = await Interview.create({
      userId: req.user._id,
      interviewType: interviewType || 'Technical',
      targetRole: targetRole || req.user.role || 'Full Stack Developer',
      difficulty: difficulty || 'Medium',
      duration: Number(duration) || 20,
      questionCount: Number(questionCount) || 5,
      mode: mode || 'voice',
      preferredLanguage: preferredLanguage || req.user.preferredLanguage || 'javascript',
      status: 'configured',
    });

    res.status(201).json({ success: true, interview });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all interviews for current user
// @route   GET /api/interviews
const getInterviews = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const filter = { userId: req.user._id };

    if (type && type !== 'all') {
      filter.interviewType = type;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    const interviews = await Interview.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: interviews.length, interviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single interview with all questions and answers
// @route   GET /api/interviews/:id
const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const questions = await Question.find({ interviewId: interview._id }).sort({ order: 1 });
    const answers = await Answer.find({ interviewId: interview._id }).populate('questionId');
    const codingSubmissions = await CodingSubmission.find({ interviewId: interview._id });

    res.status(200).json({
      success: true,
      interview,
      questions,
      answers,
      codingSubmissions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Start interview and generate first question
// @route   POST /api/interviews/:id/start
const startInterview = async (req, res, next) => {
  try {
    const result = await startInterviewSession(req.params.id, req.user._id);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// @desc    Complete interview and calculate final results
// @route   POST /api/interviews/:id/complete
const completeInterview = async (req, res, next) => {
  try {
    const result = await finalizeInterview(req.params.id, req.user._id);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  startInterview,
  completeInterview,
};
