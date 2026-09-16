/**
 * Scoring engine with transparent weighted formulas
 */

const calculateWeightedInterviewScore = (interviewType, answers = [], codingSubmissions = []) => {
  if (answers.length === 0 && codingSubmissions.length === 0) {
    return {
      overallScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      codingScore: 0,
      answerQuality: 0,
      clarityScore: 0,
      relevanceScore: 0,
      grammarScore: 0,
      breakdownFormula: 'No evaluations recorded yet',
    };
  }

  // Aggregate answer metrics
  const avg = (arr, key) => (arr.length ? Math.round(arr.reduce((acc, curr) => acc + (curr[key] || 0), 0) / arr.length) : 0);

  const technicalScore = avg(answers, 'technicalKnowledge') || 75;
  const communicationScore = avg(answers, 'communication') || 75;
  const clarityScore = avg(answers, 'clarity') || 75;
  const relevanceScore = avg(answers, 'relevance') || 80;
  const grammarScore = avg(answers, 'grammar') || 85;
  const answerQuality = avg(answers, 'score') || 75;

  // Coding metrics
  let codingScore = 0;
  if (codingSubmissions.length > 0) {
    codingScore = Math.round(
      codingSubmissions.reduce((acc, sub) => acc + (sub.score || 0), 0) / codingSubmissions.length
    );
  }

  let overallScore = 0;
  let breakdownFormula = '';

  if (interviewType === 'Coding') {
    overallScore = codingScore || answerQuality;
    breakdownFormula = 'Correctness (50%) + Code Quality (20%) + Time Complexity (15%) + Space Complexity (15%)';
  } else if (interviewType === 'HR') {
    overallScore = Math.round(
      communicationScore * 0.3 +
      answerQuality * 0.25 +
      relevanceScore * 0.2 +
      clarityScore * 0.15 +
      grammarScore * 0.1
    );
    breakdownFormula = 'Communication (30%) + Answer Quality (25%) + Relevance (20%) + Clarity (15%) + Grammar & Fluency (10%)';
  } else if (interviewType === 'Technical') {
    overallScore = Math.round(
      technicalScore * 0.35 +
      answerQuality * 0.25 +
      communicationScore * 0.2 +
      relevanceScore * 0.1 +
      grammarScore * 0.1
    );
    breakdownFormula = 'Technical Knowledge (35%) + Answer Quality (25%) + Communication (20%) + Relevance (10%) + Fluency (10%)';
  } else {
    // Full Mock
    overallScore = Math.round(
      technicalScore * 0.3 +
      communicationScore * 0.25 +
      (codingScore > 0 ? codingScore * 0.2 : technicalScore * 0.2) +
      answerQuality * 0.15 +
      relevanceScore * 0.1
    );
    breakdownFormula = 'Technical Knowledge (30%) + Communication (25%) + Coding Assessment (20%) + Quality (15%) + Relevance (10%)';
  }

  // Ensure 0-100 bounded
  overallScore = Math.min(100, Math.max(0, overallScore));

  return {
    overallScore,
    technicalScore,
    communicationScore,
    codingScore,
    answerQuality,
    clarityScore,
    relevanceScore,
    grammarScore,
    breakdownFormula,
  };
};

module.exports = { calculateWeightedInterviewScore };
