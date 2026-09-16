/**
 * Prompts for evaluating coding solutions
 */

const getCodingEvaluationPrompt = ({ problemTitle, problemDescription, language, code, testCasesPassed, totalTestCases }) => {
  return `Evaluate the candidate's code submission for the following problem.

PROBLEM:
Title: ${problemTitle}
Description: ${problemDescription}

SUBMISSION:
Language: ${language}
Test Cases Passed: ${testCasesPassed}/${totalTestCases}

CODE:
\`\`\`${language}
${code}
\`\`\`

Evaluate the submission on:
1. Correctness & edge case handling
2. Time complexity (Big-O notation, e.g. O(N), O(N log N), O(N^2))
3. Space complexity (Big-O notation, e.g. O(1), O(N))
4. Code readability, modularity, idiomatic conventions, and variable naming

Return ONLY a valid JSON object in this format:
{
  "score": 85,
  "correctnessScore": 90,
  "codeQualityScore": 85,
  "timeComplexityScore": 80,
  "spaceComplexityScore": 85,
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "feedback": "Concise 2-3 sentence review of the code's approach and performance.",
  "strengths": [
    "Efficient hash map lookup approach",
    "Clean early return structure"
  ],
  "suggestions": [
    "Consider adding input boundary checks for null or empty arrays",
    "Can simplify variable declaration"
  ]
}`;
};

module.exports = { getCodingEvaluationPrompt };
