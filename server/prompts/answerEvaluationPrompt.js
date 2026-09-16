/**
 * Prompts for evaluating candidate answers across multiple dimensions
 */

const getAnswerEvaluationPrompt = ({ question, answerText, targetRole, difficulty, interviewType }) => {
  return `Evaluate the candidate's spoken/written answer for the following interview question.

CONTEXT:
Interview Type: ${interviewType}
Target Role: ${targetRole}
Difficulty: ${difficulty}

QUESTION:
"${question}"

CANDIDATE'S ANSWER:
"${answerText}"

Evaluation Guidelines:
- Relevance: How directly does the answer address the question? (0-100)
- Accuracy: Are the technical concepts, terminology, or reasoning correct? (0-100)
- Completeness: Did the answer cover key edge cases, depth, and practical context? (0-100)
- Technical Knowledge: Depth of understanding appropriate for a ${targetRole}? (0-100)
- Communication: Clarity of explanation, articulation, and coherence? (0-100)
- Structure: Logical progression (e.g., STAR method for behavioral, problem-solution-impact for technical)? (0-100)
- Grammar: Linguistic flow, sentence structure, and vocabulary precision? (0-100)
- Conciseness: Avoiding rambling while providing sufficient depth? (0-100)

Return ONLY a valid JSON object in this exact structure:
{
  "score": 82,
  "relevance": 85,
  "accuracy": 80,
  "communication": 84,
  "clarity": 86,
  "grammar": 90,
  "completeness": 78,
  "technicalKnowledge": 82,
  "strengths": [
    "Specific positive attribute 1",
    "Specific positive attribute 2"
  ],
  "weaknesses": [
    "Area that was missing or vague 1",
    "Area that could be improved 2"
  ],
  "suggestions": [
    "Concrete actionable tip 1",
    "Concrete actionable tip 2"
  ],
  "idealAnswer": "A comprehensive, high-scoring model answer that demonstrates how an experienced candidate would answer this question effectively.",
  "feedback": "A constructive 2-3 sentence personalized feedback summary."
}`;
};

module.exports = { getAnswerEvaluationPrompt };
