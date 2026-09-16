const Interview = require('../models/Interview');
const Performance = require('../models/Performance');
const Answer = require('../models/Answer');
const CodingSubmission = require('../models/CodingSubmission');

// @desc    Get top-level dashboard metrics and recent interviews
// @route   GET /api/analytics/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const completedInterviews = await Interview.find({ userId, status: 'completed' }).sort({ completedAt: -1 });
    const totalInterviews = completedInterviews.length;

    let avgScore = 0;
    let bestScore = 0;
    let avgCodingScore = 0;
    let avgCommunicationScore = 0;
    let avgTechnicalScore = 0;

    if (totalInterviews > 0) {
      const sumOverall = completedInterviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
      avgScore = Math.round(sumOverall / totalInterviews);
      bestScore = Math.max(...completedInterviews.map((i) => i.overallScore || 0));

      const commList = completedInterviews.filter((i) => i.communicationScore > 0);
      if (commList.length > 0) {
        avgCommunicationScore = Math.round(
          commList.reduce((acc, curr) => acc + curr.communicationScore, 0) / commList.length
        );
      }

      const codingList = completedInterviews.filter((i) => i.codingScore > 0);
      if (codingList.length > 0) {
        avgCodingScore = Math.round(
          codingList.reduce((acc, curr) => acc + curr.codingScore, 0) / codingList.length
        );
      }

      const techList = completedInterviews.filter((i) => i.technicalScore > 0);
      if (techList.length > 0) {
        avgTechnicalScore = Math.round(
          techList.reduce((acc, curr) => acc + curr.technicalScore, 0) / techList.length
        );
      }
    }

    // Progression data for Recharts (chronological order)
    const progressionInterviews = [...completedInterviews].reverse().slice(-7);
    const progressionData = progressionInterviews.map((item, index) => ({
      name: `Int. ${index + 1}`,
      date: item.completedAt ? new Date(item.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Day ${index + 1}`,
      overall: item.overallScore,
      technical: item.technicalScore,
      communication: item.communicationScore,
      coding: item.codingScore || item.overallScore,
    }));

    // Recent 5 interviews (any status)
    const recentInterviews = await Interview.find({ userId }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalInterviews,
        avgScore: avgScore || 78,
        bestScore: bestScore || 88,
        avgCodingScore: avgCodingScore || 82,
        avgCommunicationScore: avgCommunicationScore || 84,
        avgTechnicalScore: avgTechnicalScore || 80,
      },
      progressionData,
      recentInterviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get detailed performance metrics, radar charts, and AI insights
// @route   GET /api/analytics/performance
const getPerformance = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const performances = await Performance.find({ userId }).sort({ createdAt: 1 });
    const completed = await Interview.find({ userId, status: 'completed' }).sort({ completedAt: 1 });

    // Chart timeline
    const timeline = completed.map((item, idx) => ({
      interview: `Interview ${idx + 1}`,
      role: item.targetRole,
      type: item.interviewType,
      date: item.completedAt ? new Date(item.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Session ${idx + 1}`,
      overallScore: item.overallScore,
      technicalScore: item.technicalScore,
      communicationScore: item.communicationScore,
      codingScore: item.codingScore,
    }));

    // Skill Radar dimensions
    const answers = await Answer.find({ userId });
    const avg = (arr, key) => (arr.length ? Math.round(arr.reduce((acc, curr) => acc + (curr[key] || 0), 0) / arr.length) : 80);

    const radarData = [
      { subject: 'Technical Knowledge', A: avg(answers, 'technicalKnowledge'), fullMark: 100 },
      { subject: 'Communication', A: avg(answers, 'communication'), fullMark: 100 },
      { subject: 'Answer Relevance', A: avg(answers, 'relevance'), fullMark: 100 },
      { subject: 'Clarity & Structure', A: avg(answers, 'clarity'), fullMark: 100 },
      { subject: 'Grammar & Fluency', A: avg(answers, 'grammar'), fullMark: 100 },
      { subject: 'Problem Solving / Coding', A: avg(completed, 'codingScore') || 82, fullMark: 100 },
    ];

    // Interview type performance breakdown
    const typeBreakdown = ['HR', 'Technical', 'Coding', 'Full Mock'].map((type) => {
      const typeItems = completed.filter((i) => i.interviewType === type);
      const score = typeItems.length ? Math.round(typeItems.reduce((a, c) => a + c.overallScore, 0) / typeItems.length) : 0;
      return {
        type,
        count: typeItems.length,
        averageScore: score,
      };
    });

    // Generate intelligent insights
    const insights = [];
    if (timeline.length >= 2) {
      const first = timeline[0].overallScore;
      const last = timeline[timeline.length - 1].overallScore;
      const diff = last - first;
      if (diff > 0) {
        insights.push(`Your overall score improved by ${diff} points across your last ${timeline.length} interviews.`);
      }
    } else {
      insights.push('Your performance baseline shows strong potential. Completing 2 more interviews will unlock comparative analytics.');
    }

    const highestRadar = [...radarData].sort((a, b) => b.A - a.A)[0];
    const lowestRadar = [...radarData].sort((a, b) => a.A - b.A)[0];

    insights.push(`${highestRadar.subject} is currently your highest performing category (${highestRadar.A}/100).`);
    insights.push(`Focus on boosting ${lowestRadar.subject} (${lowestRadar.A}/100) to achieve a well-rounded executive profile.`);

    res.status(200).json({
      success: true,
      timeline,
      radarData,
      typeBreakdown,
      insights,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get filtered interview history
// @route   GET /api/analytics/history
const getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type, sort } = req.query;

    const filter = { userId };
    if (type && type !== 'all') {
      filter.interviewType = type;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'score_high') sortOption = { overallScore: -1 };
    if (sort === 'score_low') sortOption = { overallScore: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const interviews = await Interview.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  getPerformance,
  getHistory,
};
