const Question = require('../models/Question');
const Interview = require('../models/Interview');
const Answer = require('../models/Answer');
const { generateInterviewQuestion, evaluateAnswer, generateFollowup } = require('../services/openaiService');

// @desc    Get all questions for an interview
// @route   GET /api/interviews/:id/questions
const getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ interviewId: req.params.id }).sort({ order: 1 });
    res.status(200).json({ success: true, count: questions.length, questions });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit answer for a question and get instant AI evaluation
// @route   POST /api/questions/:id/answer
const submitAnswer = async (req, res, next) => {
  try {
    const { answerText, transcript, audioUrl, durationSeconds } = req.body;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const interview = await Interview.findById(question.interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const effectiveText = answerText || transcript || 'Candidate did not speak or answer was blank.';

    // 1. Evaluate answer with AI
    const evaluation = await evaluateAnswer({
      question: question.question,
      answerText: effectiveText,
      targetRole: interview.targetRole,
      difficulty: question.difficulty || interview.difficulty,
      interviewType: interview.interviewType,
    });

    // 2. Save or update answer in DB
    let answer = await Answer.findOne({ questionId, userId: req.user._id });
    if (answer) {
      answer.answerText = effectiveText;
      answer.transcript = transcript || effectiveText;
      answer.audioUrl = audioUrl || answer.audioUrl;
      answer.durationSeconds = durationSeconds || answer.durationSeconds;
      answer.score = evaluation.score;
      answer.relevance = evaluation.relevance;
      answer.accuracy = evaluation.accuracy;
      answer.communication = evaluation.communication;
      answer.clarity = evaluation.clarity;
      answer.grammar = evaluation.grammar;
      answer.completeness = evaluation.completeness;
      answer.technicalKnowledge = evaluation.technicalKnowledge;
      answer.strengths = evaluation.strengths;
      answer.weaknesses = evaluation.weaknesses;
      answer.suggestions = evaluation.suggestions;
      answer.idealAnswer = evaluation.idealAnswer;
      answer.feedback = evaluation.feedback;
      await answer.save();
    } else {
      answer = await Answer.create({
        interviewId: interview._id,
        questionId: question._id,
        userId: req.user._id,
        answerText: effectiveText,
        transcript: transcript || effectiveText,
        audioUrl: audioUrl || '',
        durationSeconds: durationSeconds || 0,
        score: evaluation.score,
        relevance: evaluation.relevance,
        accuracy: evaluation.accuracy,
        communication: evaluation.communication,
        clarity: evaluation.clarity,
        grammar: evaluation.grammar,
        completeness: evaluation.completeness,
        technicalKnowledge: evaluation.technicalKnowledge,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        suggestions: evaluation.suggestions,
        idealAnswer: evaluation.idealAnswer,
        feedback: evaluation.feedback,
      });
    }

    // 3. Check if follow-up question or next question should be generated
    const totalQuestionsAsked = await Question.countDocuments({ interviewId: interview._id });
    let nextQuestion = null;
    let isCompleted = false;

    // Check if we should ask a dynamic follow-up
    if (totalQuestionsAsked < interview.questionCount && question.type !== 'follow-up') {
      const followUpDecision = await generateFollowup({
        question: question.question,
        candidateAnswer: effectiveText,
        targetRole: interview.targetRole,
        difficulty: interview.difficulty,
      });

      if (followUpDecision && followUpDecision.shouldAskFollowUp && followUpDecision.followUpQuestion) {
        nextQuestion = await Question.create({
          interviewId: interview._id,
          question: followUpDecision.followUpQuestion,
          type: 'follow-up',
          difficulty: interview.difficulty,
          order: question.order + 1,
          followUpTo: question._id,
          expectedTopics: ['Practical Depth', 'Clarification', 'Trade-offs'],
        });
      }
    }

    // If no follow-up, and not at max questions, generate next planned question
    if (!nextQuestion && totalQuestionsAsked < interview.questionCount) {
      const existingQuestions = await Question.find({ interviewId: interview._id });
      const previousQuestionTexts = existingQuestions.map((q) => q.question);

      const newQData = await generateInterviewQuestion({
        interviewType: interview.interviewType,
        targetRole: interview.targetRole,
        difficulty: interview.difficulty,
        experience: 'Fresher',
        questionNumber: totalQuestionsAsked + 1,
        totalQuestions: interview.questionCount,
        previousQuestions: previousQuestionTexts,
      });

      nextQuestion = await Question.create({
        interviewId: interview._id,
        question: newQData.question,
        type: newQData.type || (interview.interviewType === 'Coding' ? 'coding' : 'technical'),
        difficulty: newQData.difficulty || interview.difficulty,
        order: totalQuestionsAsked + 1,
        expectedTopics: newQData.expectedTopics || [],
        codingChallenge: newQData.codingChallenge || undefined,
      });
    } else if (!nextQuestion && totalQuestionsAsked >= interview.questionCount) {
      isCompleted = true;
    }

    res.status(200).json({
      success: true,
      evaluation,
      answer,
      nextQuestion,
      isCompleted,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuestions,
  submitAnswer,
};
