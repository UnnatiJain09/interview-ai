const Question = require('../models/Question');
const CodingSubmission = require('../models/CodingSubmission');
const Interview = require('../models/Interview');
const { executeCode } = require('../services/codingService');
const { evaluateCodeWithAI } = require('../services/openaiService');

// @desc    Run code against visible test cases
// @route   POST /api/coding/run
const runCode = async (req, res, next) => {
  try {
    const { questionId, language, code } = req.body;

    const question = await Question.findById(questionId);
    if (!question || !question.codingChallenge) {
      return res.status(404).json({ success: false, message: 'Coding challenge not found' });
    }

    const testCases = question.codingChallenge.testCases || [];
    const executionResult = await executeCode({ language, code, testCases });

    res.status(200).json({
      success: true,
      ...executionResult,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit final code, execute all test cases, and get AI code evaluation
// @route   POST /api/coding/submit
const submitCode = async (req, res, next) => {
  try {
    const { interviewId, questionId, language, code } = req.body;

    const question = await Question.findById(questionId);
    if (!question || !question.codingChallenge) {
      return res.status(404).json({ success: false, message: 'Coding challenge not found' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    // 1. Run against all test cases
    const testCases = question.codingChallenge.testCases || [];
    const execution = await executeCode({ language, code, testCases });

    // 2. Perform AI code review
    const aiEvaluation = await evaluateCodeWithAI({
      problemTitle: question.codingChallenge.title,
      problemDescription: question.codingChallenge.description,
      language,
      code,
      testCasesPassed: execution.testCasesPassed,
      totalTestCases: execution.totalTestCases,
    });

    // 3. Save submission
    const submission = await CodingSubmission.create({
      interviewId: interview._id,
      questionId: question._id,
      userId: req.user._id,
      language,
      code,
      testCasesPassed: execution.testCasesPassed,
      totalTestCases: execution.totalTestCases,
      executionTimeMs: execution.executionTimeMs,
      score: aiEvaluation.score,
      correctnessScore: aiEvaluation.correctnessScore,
      codeQualityScore: aiEvaluation.codeQualityScore,
      timeComplexityScore: aiEvaluation.timeComplexityScore,
      spaceComplexityScore: aiEvaluation.spaceComplexityScore,
      timeComplexity: aiEvaluation.timeComplexity,
      spaceComplexity: aiEvaluation.spaceComplexity,
      feedback: aiEvaluation.feedback,
      strengths: aiEvaluation.strengths,
      suggestions: aiEvaluation.suggestions,
      testResults: execution.testResults,
    });

    // Update interview coding score
    interview.codingScore = aiEvaluation.score;
    await interview.save();

    res.status(200).json({
      success: true,
      submission,
      evaluation: aiEvaluation,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  runCode,
  submitCode,
};
