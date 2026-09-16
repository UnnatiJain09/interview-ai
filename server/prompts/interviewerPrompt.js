/**
 * Prompts for generating initial and subsequent interview questions
 */

const getInterviewerSystemPrompt = (interviewType, targetRole, difficulty, experience) => {
  return `You are InterviewAI, an elite, professional technical and HR interviewer assessing a candidate.
Target Role: ${targetRole}
Interview Category: ${interviewType}
Difficulty Level: ${difficulty}
Candidate Experience: ${experience}

Your responsibilities:
1. Ask realistic, insightful, and practical interview questions tailored specifically to the ${targetRole} position and ${experience} experience level.
2. Maintain a professional, encouraging, yet thorough interviewer tone.
3. Never ask vague or generic textbook trivia; prioritize practical application, architecture, problem-solving, and core fundamentals.
4. Always output your response in valid JSON format matching the requested schema.`;
};

const getQuestionGenerationPrompt = ({ interviewType, targetRole, difficulty, experience, questionNumber, totalQuestions, previousQuestions = [], previousAnswers = [] }) => {
  return `Generate Question #${questionNumber} of ${totalQuestions} for this ${interviewType} interview.

Previous questions asked in this session so far:
${previousQuestions.length > 0 ? previousQuestions.map((q, idx) => `${idx + 1}. ${q}`).join('\n') : 'None (This is the first question)'}

Candidate's background context:
- Role: ${targetRole}
- Experience: ${experience}
- Difficulty: ${difficulty}

Instructions:
- If this is Question #1:
  * For HR: Ask a tailored "Tell me about yourself" or background overview focused on their passion for ${targetRole}.
  * For Technical: Ask a foundational question relevant to ${targetRole}.
  * For Coding: Present an algorithmic/data structure problem suited for ${difficulty} level.
- For subsequent questions:
  * Build on previous discussions or explore a new relevant dimension (e.g., system design, asynchronous handling, state management, databases, conflict resolution, or team leadership).
  * Do NOT repeat any previously asked questions or topics.

Return ONLY a valid JSON object in the following format:
{
  "question": "The exact interview question text to read to the candidate",
  "type": "${interviewType === 'Coding' ? 'coding' : interviewType === 'HR' ? 'hr' : 'technical'}",
  "difficulty": "${difficulty}",
  "expectedTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "starterCode": {
    "javascript": "// Starter code if coding challenge",
    "python": "# Starter code if coding challenge"
  }
}`;
};

module.exports = {
  getInterviewerSystemPrompt,
  getQuestionGenerationPrompt,
};
