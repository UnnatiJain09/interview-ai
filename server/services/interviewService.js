const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const CodingSubmission = require('../models/CodingSubmission');
const Performance = require('../models/Performance');
const { generateInterviewQuestion, generateFinalFeedback } = require('./openaiService');
const { calculateWeightedInterviewScore } = require('./evaluationService');

/**
 * Initialize first question for a newly configured interview
 */
const startInterviewSession = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    throw new Error('Interview not found');
  }

  interview.status = 'in-progress';
  interview.startedAt = new Date();
  await interview.save();

  // Check if a question already exists
  let firstQuestion = await Question.findOne({ interviewId, order: 1 });
  if (!firstQuestion) {
    // Generate initial question
    const qData = await generateInterviewQuestion({
      interviewType: interview.interviewType,
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      experience: 'Fresher',
      questionNumber: 1,
      totalQuestions: interview.questionCount,
      previousQuestions: [],
    });

    firstQuestion = await Question.create({
      interviewId: interview._id,
      question: qData.question,
      type: qData.type || (interview.interviewType === 'Coding' ? 'coding' : 'technical'),
      difficulty: qData.difficulty || interview.difficulty,
      order: 1,
      expectedTopics: qData.expectedTopics || [],
      codingChallenge: qData.codingChallenge || undefined,
    });
  }

  return { interview, currentQuestion: firstQuestion };
};

/**
 * Complete the interview, calculate final scores, generate feedback, and record performance history
 */
const finalizeInterview = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    throw new Error('Interview not found');
  }

  const answers = await Answer.find({ interviewId });
  const codingSubmissions = await CodingSubmission.find({ interviewId });

  // Calculate scores
  const scores = calculateWeightedInterviewScore(interview.interviewType, answers, codingSubmissions);

  // Generate final executive summary
  const summaryPayload = answers.map((a) => ({
    score: a.score,
    strengths: a.strengths,
    weaknesses: a.weaknesses,
  }));

  const aiFeedback = await generateFinalFeedback({
    interviewType: interview.interviewType,
    targetRole: interview.targetRole,
    overallScore: scores.overallScore,
    answersSummary: summaryPayload,
  });

  interview.status = 'completed';
  interview.completedAt = new Date();
  interview.overallScore = scores.overallScore;
  interview.technicalScore = scores.technicalScore;
  interview.communicationScore = scores.communicationScore;
  interview.codingScore = scores.codingScore;
  interview.answerQuality = scores.answerQuality;
  interview.clarityScore = scores.clarityScore;
  interview.relevanceScore = scores.relevanceScore;
  interview.grammarScore = scores.grammarScore;
  interview.summaryFeedback = aiFeedback.summaryFeedback;
  interview.strengths = aiFeedback.topStrengths;
  interview.improvements = aiFeedback.areasForImprovement;
  await interview.save();

  // Create performance history entry
  await Performance.create({
    userId,
    interviewId: interview._id,
    interviewType: interview.interviewType,
    targetRole: interview.targetRole,
    overallScore: scores.overallScore,
    technicalScore: scores.technicalScore,
    communicationScore: scores.communicationScore,
    codingScore: scores.codingScore,
    answerQuality: scores.answerQuality,
    relevance: scores.relevanceScore,
    clarity: scores.clarityScore,
    grammar: scores.grammarScore,
  });

  return { interview, aiFeedback, scores };
};

module.exports = {
  startInterviewSession,
  finalizeInterview,
};
