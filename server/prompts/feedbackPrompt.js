/**
 * Prompts for generating final comprehensive interview feedback
 */

const getFinalFeedbackPrompt = ({ interviewType, targetRole, overallScore, answersSummary }) => {
  return `Generate final executive feedback for a completed ${interviewType} interview for the position of ${targetRole}.

INTERVIEW RESULTS SUMMARY:
Overall Weighted Score: ${overallScore}/100
Questions and Evaluation Snapshots:
${JSON.stringify(answersSummary, null, 2)}

Provide an encouraging, analytical, and actionable performance review suitable for a candidate preparing for top-tier tech placements.

Return ONLY a valid JSON object:
{
  "performanceLevel": "Excellent", // "Excellent" (>=85), "Good" (70-84), "Average" (50-69), "Needs Improvement" (<50)
  "summaryFeedback": "A 3-4 sentence comprehensive breakdown of how the candidate performed across technical depth, articulation, and problem solving.",
  "topStrengths": [
    "Strength 1 with detail",
    "Strength 2 with detail",
    "Strength 3 with detail"
  ],
  "areasForImprovement": [
    "Area 1 with practical guidance",
    "Area 2 with practical guidance",
    "Area 3 with practical guidance"
  ],
  "actionableRecommendations": [
    "Study recommendation 1",
    "Communication/delivery recommendation 2",
    "Coding/architectural practice recommendation 3"
  ]
}`;
};

module.exports = { getFinalFeedbackPrompt };
