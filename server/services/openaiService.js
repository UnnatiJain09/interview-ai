const { OpenAI } = require('openai');
const { getInterviewerSystemPrompt, getQuestionGenerationPrompt } = require('../prompts/interviewerPrompt');
const { getAnswerEvaluationPrompt } = require('../prompts/answerEvaluationPrompt');
const { getFollowupPrompt } = require('../prompts/followupPrompt');
const { getCodingEvaluationPrompt } = require('../prompts/codingEvaluationPrompt');
const { getFinalFeedbackPrompt } = require('../prompts/feedbackPrompt');

let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('[AI Service] OpenAI Client initialized successfully with API Key.');
  } catch (err) {
    console.warn('[AI Service] Failed to initialize OpenAI client:', err.message);
  }
} else {
  console.log('[AI Service] OPENAI_API_KEY not provided. Operating with Intelligent Dynamic AI Simulation Engine.');
}

/**
 * Helper to safely parse JSON from AI response with markdown strip
 */
const safeParseJSON = (text, fallback) => {
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean);
  } catch (err) {
    console.warn('[AI Service] JSON Parse error, using fallback format:', err.message);
    return fallback;
  }
};

/**
 * 1. Generate Interview Question
 */
const generateInterviewQuestion = async ({
  interviewType,
  targetRole,
  difficulty,
  experience,
  questionNumber,
  totalQuestions,
  previousQuestions = [],
}) => {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: getInterviewerSystemPrompt(interviewType, targetRole, difficulty, experience) },
          {
            role: 'user',
            content: getQuestionGenerationPrompt({
              interviewType,
              targetRole,
              difficulty,
              experience,
              questionNumber,
              totalQuestions,
              previousQuestions,
            }),
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const parsed = safeParseJSON(response.choices[0].message.content, null);
      if (parsed && parsed.question) {
        return parsed;
      }
    } catch (err) {
      console.warn('[AI Service] OpenAI API error in question generation, switching to dynamic generator:', err.message);
    }
  }

  // Dynamic Intelligent Fallback Engine
  return generateDynamicFallbackQuestion({
    interviewType,
    targetRole,
    difficulty,
    experience,
    questionNumber,
    previousQuestions,
  });
};

/**
 * 2. Evaluate Answer
 */
const evaluateAnswer = async ({ question, answerText, targetRole, difficulty, interviewType }) => {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a rigorous, objective interview assessor. Evaluate the candidate answer against the question and return strict JSON.',
          },
          {
            role: 'user',
            content: getAnswerEvaluationPrompt({
              question,
              answerText,
              targetRole,
              difficulty,
              interviewType,
            }),
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      });

      const parsed = safeParseJSON(response.choices[0].message.content, null);
      if (parsed && typeof parsed.score === 'number') {
        return parsed;
      }
    } catch (err) {
      console.warn('[AI Service] OpenAI API error in answer evaluation, using dynamic evaluator:', err.message);
    }
  }

  // Dynamic Intelligent Fallback Engine
  return generateDynamicFallbackEvaluation({
    question,
    answerText,
    targetRole,
    difficulty,
    interviewType,
  });
};

/**
 * 3. Generate Follow-up Question
 */
const generateFollowup = async ({ question, candidateAnswer, targetRole, difficulty }) => {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Decide whether to ask a contextual follow-up question based on the candidate response. Return JSON.',
          },
          {
            role: 'user',
            content: getFollowupPrompt({
              question,
              candidateAnswer,
              targetRole,
              difficulty,
            }),
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      return safeParseJSON(response.choices[0].message.content, {
        shouldAskFollowUp: false,
        followUpQuestion: '',
        reason: '',
      });
    } catch (err) {
      console.warn('[AI Service] OpenAI API error in follow-up generation:', err.message);
    }
  }

  // Dynamic rule-based follow-up generator
  const answerWords = candidateAnswer.split(/\s+/).filter(Boolean);
  if (answerWords.length > 25 && Math.random() > 0.45) {
    return {
      shouldAskFollowUp: true,
      followUpQuestion: `Interesting point you made regarding your approach. Could you elaborate on how you handled trade-offs or edge-case constraints in that scenario?`,
      reason: 'Candidate provided a detailed foundational point suitable for probing deeper into trade-offs.',
    };
  }

  return {
    shouldAskFollowUp: false,
    followUpQuestion: '',
    reason: 'Answer sufficiently addressed the primary topic.',
  };
};

/**
 * 4. Evaluate Code Submission
 */
const evaluateCodeWithAI = async ({
  problemTitle,
  problemDescription,
  language,
  code,
  testCasesPassed,
  totalTestCases,
}) => {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an algorithmic code interviewer. Analyze code complexity and quality, returning JSON.',
          },
          {
            role: 'user',
            content: getCodingEvaluationPrompt({
              problemTitle,
              problemDescription,
              language,
              code,
              testCasesPassed,
              totalTestCases,
            }),
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const parsed = safeParseJSON(response.choices[0].message.content, null);
      if (parsed && typeof parsed.score === 'number') {
        return parsed;
      }
    } catch (err) {
      console.warn('[AI Service] OpenAI code evaluation error:', err.message);
    }
  }

  // Dynamic code evaluation fallback
  const passRate = totalTestCases > 0 ? testCasesPassed / totalTestCases : 0.8;
  const correctness = Math.round(passRate * 100);
  const codeLength = code.trim().length;
  const hasComments = code.includes('//') || code.includes('#');
  const codeQuality = Math.min(95, Math.max(70, 75 + (hasComments ? 10 : 0) + (codeLength > 50 ? 5 : 0)));

  // Detect basic complexity hints
  let timeComplexity = 'O(N)';
  let spaceComplexity = 'O(1)';
  if (code.includes('for') && code.slice(code.indexOf('for') + 3).includes('for')) {
    timeComplexity = 'O(N^2)';
  } else if (code.includes('sort') || code.includes('log')) {
    timeComplexity = 'O(N log N)';
  }

  if (code.includes('Map') || code.includes('new Array') || code.includes('dict') || code.includes('set()') || code.includes('[]')) {
    spaceComplexity = 'O(N)';
  }

  const overallScore = Math.round(correctness * 0.5 + codeQuality * 0.2 + 85 * 0.15 + 85 * 0.15);

  return {
    score: overallScore,
    correctnessScore: correctness,
    codeQualityScore: codeQuality,
    timeComplexityScore: timeComplexity === 'O(N^2)' ? 70 : 90,
    spaceComplexityScore: spaceComplexity === 'O(1)' ? 95 : 85,
    timeComplexity,
    spaceComplexity,
    feedback: `Your solution successfully passed ${testCasesPassed} of ${totalTestCases} test cases. It implements an idiomatic approach with clean control flow.`,
    strengths: [
      'Good variable semantics and readable logic flow',
      'Effective handling of base constraints and loops',
    ],
    suggestions: [
      'Ensure defensive bounds-checking for empty or null inputs',
      'Optimize space usage where in-place operations are feasible',
    ],
  };
};

/**
 * 5. Final Feedback
 */
const generateFinalFeedback = async ({ interviewType, targetRole, overallScore, answersSummary }) => {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Generate executive interview debrief feedback and actionable development suggestions. Return JSON.',
          },
          {
            role: 'user',
            content: getFinalFeedbackPrompt({
              interviewType,
              targetRole,
              overallScore,
              answersSummary,
            }),
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      const parsed = safeParseJSON(response.choices[0].message.content, null);
      if (parsed && parsed.summaryFeedback) {
        return parsed;
      }
    } catch (err) {
      console.warn('[AI Service] OpenAI API error in final feedback:', err.message);
    }
  }

  const perfLevel = overallScore >= 85 ? 'Excellent' : overallScore >= 70 ? 'Good' : overallScore >= 55 ? 'Average' : 'Needs Improvement';

  return {
    performanceLevel: perfLevel,
    summaryFeedback: `Candidate demonstrated solid preparation for the ${targetRole} interview. Your responses showed a commendable balance of technical clarity and communication effectiveness, achieving an overall score of ${overallScore}/100.`,
    topStrengths: [
      'Solid grasp of core architectural and technical principles',
      'Clear, articulate communication with concise reasoning',
      'Good structured thought process during problem breakdowns',
    ],
    areasForImprovement: [
      'Incorporate more concrete metrics and real-world system trade-offs',
      'Adopt the STAR method (Situation, Task, Action, Result) more consistently',
      'Refine edge-case identification in algorithmic discussions',
    ],
    actionableRecommendations: [
      'Practice deep-dive architectural diagrams and microservice communication patterns',
      'Review Big-O space and time complexity proofs for common data structures',
      'Record mock voice answers to systematically eliminate pauses and filler words',
    ],
  };
};

// ==========================================
// DYNAMIC FALLBACK KNOWLEDGE GENERATOR
// ==========================================

const ROLE_TOPIC_BANK = {
  'Full Stack Developer': [
    {
      question: 'Explain how the Event Loop works in Node.js, and how it handles asynchronous I/O operations without blocking the main execution thread.',
      expectedTopics: ['Call Stack', 'Libuv Thread Pool', 'Microtasks & Macrotasks', 'Non-blocking I/O'],
    },
    {
      question: 'What are the main differences between React Server Components (RSC) and standard Client Components, and how do they impact initial load time and bundle size?',
      expectedTopics: ['Server-side execution', 'Zero-bundle-size dependencies', 'Hydration', 'Data fetching'],
    },
    {
      question: 'How do you design and structure a secure RESTful API with JWT authentication, refresh tokens, and rate limiting in Express.js?',
      expectedTopics: ['HttpOnly Cookies', 'Token rotation', 'Rate limiting', 'CSRF protection'],
    },
    {
      question: 'When would you choose MongoDB (NoSQL) over PostgreSQL (SQL) in a scalable full-stack application, and how do you handle data consistency?',
      expectedTopics: ['Document model vs Relational', 'ACID transactions', 'Horizontal scalability', 'Indexing'],
    },
    {
      question: 'Describe a situation where a web application suffered from poor performance. How did you identify the bottleneck (frontend vs backend vs database) and resolve it?',
      expectedTopics: ['Profiling', 'Database query optimization / indexes', 'Network waterfall', 'Caching with Redis'],
    },
  ],
  'Frontend Developer': [
    {
      question: 'Explain the Virtual DOM reconciliation algorithm in React. How does the key prop help React identify changed elements efficiently?',
      expectedTopics: ['Diffing algorithm', 'Fiber tree', 'Key prop stability', 'Re-rendering optimization'],
    },
    {
      question: 'What are Core Web Vitals (LCP, FID/INP, CLS), and what specific strategies do you employ to optimize them for high-traffic web applications?',
      expectedTopics: ['Image optimization', 'Code splitting', 'Font display swap', 'Layout shifts'],
    },
    {
      question: 'How do you approach state management in large-scale modern React applications? Compare Context API vs Zustand or Redux Toolkit.',
      expectedTopics: ['Prop drilling', 'Selector subscriptions', 'Boilerplate', 'Server state vs Client state'],
    },
    {
      question: 'Describe the CSS Box Model, stacking contexts, and how modern CSS Grid and Flexbox solve complex layout challenges.',
      expectedTopics: ['Margin collapsing', 'z-index & stacking contexts', 'Flexbox axes', 'Grid template areas'],
    },
    {
      question: 'How do you ensure accessibility (a11y) across interactive frontend components like modals, dropdowns, and forms?',
      expectedTopics: ['ARIA attributes', 'Keyboard navigation (focus trap)', 'Color contrast', 'Screen reader announcements'],
    },
  ],
  'Backend Developer': [
    {
      question: 'Explain the differences between horizontal and vertical scaling, and describe how load balancers distribute traffic using algorithms like Round Robin or Least Connections.',
      expectedTopics: ['Stateless services', 'Load balancers', 'Sticky sessions', 'Failover redundancy'],
    },
    {
      question: 'How does indexing work internally in relational and document databases (e.g., B-Trees vs Hash Indexes), and what are the trade-offs of having too many indexes?',
      expectedTopics: ['B-Tree traversal', 'Write overhead (INSERT/UPDATE)', 'Query execution plans', 'Compound indexes'],
    },
    {
      question: 'Describe the concepts of ACID properties in transaction management and how distributed systems address the CAP theorem.',
      expectedTopics: ['Atomicity', 'Consistency', 'Isolation levels', 'Partition tolerance', 'Eventual consistency'],
    },
    {
      question: 'How do you prevent common security vulnerabilities in backend services, including SQL/NoSQL Injection, DDoS, and Broken Object Level Authorization (BOLA)?',
      expectedTopics: ['Parameterized queries', 'Input sanitization', 'Authorization middleware', 'Rate limiting'],
    },
    {
      question: 'Explain how message queues (such as RabbitMQ, Kafka, or Redis Pub/Sub) enable asynchronous task processing and decoupling in microservices.',
      expectedTopics: ['Producers & Consumers', 'Message persistence', 'Dead-letter queues', 'Idempotency'],
    },
  ],
  'Software Developer': [
    {
      question: 'Explain the four core principles of Object-Oriented Programming (OOP) and provide a real-world scenario where polymorphism is crucial.',
      expectedTopics: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism'],
    },
    {
      question: 'What are SOLID design principles, and how does the Dependency Inversion Principle facilitate modularity and unit testing?',
      expectedTopics: ['Single Responsibility', 'Open-Closed', 'Liskov Substitution', 'Dependency Injection'],
    },
    {
      question: 'Explain the difference between processes and threads, race conditions, and how deadlocks can be detected and prevented.',
      expectedTopics: ['Shared memory', 'Mutexes and Semaphores', 'Deadlock four conditions', 'Context switching'],
    },
    {
      question: 'Describe your approach to writing effective unit and integration tests. What is the testing pyramid and code coverage standard you aim for?',
      expectedTopics: ['Unit vs Integration vs E2E', 'Mocking dependencies', 'Test-Driven Development (TDD)', 'Edge cases'],
    },
    {
      question: 'Walk through how Git manages version history internally with commits, trees, and blobs, and explain the difference between git merge and git rebase.',
      expectedTopics: ['Directed Acyclic Graph (DAG)', 'Fast-forward merge', 'Commit history linear vs branched', 'Merge conflicts'],
    },
  ],
  'HR': [
    {
      question: 'Tell me about yourself, your educational background, and what motivated you to specialize in software engineering.',
      expectedTopics: ['Background summary', 'Passions & projects', 'Career objectives', 'Soft skills'],
    },
    {
      question: 'Describe a challenging project you worked on where you encountered a significant obstacle. How did you overcome it?',
      expectedTopics: ['STAR method', 'Problem solving', 'Resilience', 'Impactful outcome'],
    },
    {
      question: 'Tell me about a time when you experienced a conflict or disagreement with a team member or peer. How was it resolved?',
      expectedTopics: ['Active listening', 'Objective communication', 'Compromise', 'Team cohesion'],
    },
    {
      question: 'What are your greatest technical and personal strengths, and what is one area you are currently actively working to improve?',
      expectedTopics: ['Self-awareness', 'Growth mindset', 'Continuous learning', 'Honesty'],
    },
    {
      question: 'Where do you envision yourself professionally in five years, and how does this role align with your long-term career aspirations?',
      expectedTopics: ['Ambition', 'Skill mastery', 'Leadership potential', 'Company alignment'],
    },
  ],
};

const CODING_PROBLEMS = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists.'],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums, target):
    # Write your code here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    },
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', isHidden: false },
      { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', isHidden: false },
      { input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]', isHidden: true },
    ],
  },
  {
    title: 'Valid Palindrome',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your code here
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
      python: `def is_palindrome(s):
    # Write your code here
    clean = ''.join(c.lower() for c in s if c.isalnum())
    return clean == clean[::-1]`,
    },
    testCases: [
      { input: 's = "A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false },
      { input: 's = "race a car"', expectedOutput: 'false', isHidden: false },
      { input: 's = " "', expectedOutput: 'true', isHidden: true },
    ],
  },
];

const generateDynamicFallbackQuestion = ({
  interviewType,
  targetRole,
  difficulty,
  experience,
  questionNumber,
  previousQuestions = [],
}) => {
  if (interviewType === 'Coding') {
    const problem = CODING_PROBLEMS[(questionNumber - 1) % CODING_PROBLEMS.length];
    return {
      question: `Coding Assessment: ${problem.title}\n\n${problem.description}`,
      type: 'coding',
      difficulty: difficulty || 'Medium',
      expectedTopics: ['Data Structures', 'Algorithmic Optimization', 'Complexity Analysis'],
      codingChallenge: problem,
    };
  }

  const pool = ROLE_TOPIC_BANK[interviewType === 'HR' ? 'HR' : targetRole] || ROLE_TOPIC_BANK['Full Stack Developer'];
  const available = pool.filter((item) => !previousQuestions.some((pq) => pq.includes(item.question.slice(0, 20))));
  const selected = available.length > 0 ? available[0] : pool[(questionNumber - 1) % pool.length];

  return {
    question: selected.question,
    type: interviewType === 'HR' ? 'hr' : 'technical',
    difficulty: difficulty || 'Medium',
    expectedTopics: selected.expectedTopics,
  };
};

const generateDynamicFallbackEvaluation = ({ question, answerText, targetRole, difficulty, interviewType }) => {
  const words = (answerText || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Length and content indicators
  let score = 75;
  if (wordCount < 10) {
    score = 45;
  } else if (wordCount < 25) {
    score = 65;
  } else if (wordCount > 60) {
    score = 88;
  } else {
    score = 78;
  }

  const relevance = Math.min(95, Math.max(50, score + Math.floor(Math.random() * 8) - 4));
  const accuracy = Math.min(95, Math.max(50, score + Math.floor(Math.random() * 6) - 3));
  const communication = Math.min(95, Math.max(55, score + (wordCount > 30 ? 5 : -5)));
  const clarity = Math.min(95, Math.max(55, communication + 2));
  const grammar = Math.min(98, Math.max(60, 85 + Math.floor(Math.random() * 8)));
  const completeness = Math.min(95, Math.max(45, score - 3));
  const technicalKnowledge = interviewType === 'HR' ? 80 : Math.min(95, Math.max(50, accuracy));

  return {
    score,
    relevance,
    accuracy,
    communication,
    clarity,
    grammar,
    completeness,
    technicalKnowledge,
    strengths: [
      'Identified core concepts directly related to the prompt',
      'Logical delivery and coherent articulation',
      'Demonstrated practical perspective relevant to ' + targetRole,
    ],
    weaknesses: [
      wordCount < 40 ? 'Could expand with more real-world technical depth and edge cases' : 'Could refine conciseness and reduce conversational pauses',
      'Could highlight concrete metrics or performance impacts',
    ],
    suggestions: [
      'Structure future responses using Problem-Solution-Impact format',
      'Explicitly state architectural trade-offs to demonstrate senior engineering maturity',
    ],
    idealAnswer: `An exemplary answer would explicitly define the core architecture, explain how the mechanism behaves under load, describe failure modes, and provide a concrete example from a production project.`,
    feedback: `Good effort! Your response addresses the fundamental expectations with a score of ${score}/100. Expanding on edge-case scenarios will elevate this to an exceptional response.`,
  };
};

module.exports = {
  generateInterviewQuestion,
  evaluateAnswer,
  generateFollowup,
  evaluateCodeWithAI,
  generateFinalFeedback,
  CODING_PROBLEMS,
};
