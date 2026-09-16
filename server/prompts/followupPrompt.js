/**
 * Prompts for generating dynamic follow-up questions
 */

const getFollowupPrompt = ({ question, candidateAnswer, targetRole, difficulty }) => {
  return `You are an expert interviewer for a ${targetRole} role.
The candidate was asked:
"${question}"

The candidate answered:
"${candidateAnswer}"

Based on the candidate's answer, decide whether a follow-up probe is needed to dig deeper into an interesting point they raised, or ask them to clarify an architectural trade-off or specific experience they mentioned.

If the answer was complete and comprehensive, return null or a logical progression question.

Return ONLY a valid JSON object:
{
  "shouldAskFollowUp": true,
  "followUpQuestion": "A targeted follow-up question digging deeper into their stated answer (or empty string if none)",
  "reason": "Brief explanation why this follow-up is relevant"
}`;
};

module.exports = { getFollowupPrompt };
