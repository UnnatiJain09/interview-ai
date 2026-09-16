require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const CodingSubmission = require('../models/CodingSubmission');
const Performance = require('../models/Performance');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interview_ai';
    console.log(`[Seed] Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database.');

    // Remove existing demo user and demo records
    const existingDemoUser = await User.findOne({ email: 'demo@interviewai.com' });
    if (existingDemoUser) {
      await Interview.deleteMany({ userId: existingDemoUser._id });
      await Question.deleteMany({ interviewId: { $in: await Interview.find({ userId: existingDemoUser._id }).distinct('_id') } });
      await Answer.deleteMany({ userId: existingDemoUser._id });
      await CodingSubmission.deleteMany({ userId: existingDemoUser._id });
      await Performance.deleteMany({ userId: existingDemoUser._id });
      await User.deleteOne({ _id: existingDemoUser._id });
      console.log('[Seed] Cleared previous demo records.');
    }

    // 1. Create Demo User
    const user = await User.create({
      name: 'Alex Morgan',
      email: 'demo@interviewai.com',
      password: 'password123',
      role: 'Full Stack Developer',
      experience: 'Fresher',
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Tailwind CSS', 'TypeScript', 'REST APIs'],
      preferredLanguage: 'javascript',
      resumeSummary: 'Final-year Information Technology student with hands-on experience developing full-stack MERN applications, AI integrations, and RESTful web microservices.',
    });
    console.log(`[Seed] Created demo user: ${user.email} (${user._id})`);

    // 2. Sample Completed Interview #1: Technical Interview (Full Stack)
    const int1 = await Interview.create({
      userId: user._id,
      interviewType: 'Technical',
      targetRole: 'Full Stack Developer',
      difficulty: 'Medium',
      duration: 20,
      questionCount: 3,
      mode: 'voice',
      status: 'completed',
      overallScore: 85,
      technicalScore: 88,
      communicationScore: 82,
      codingScore: 80,
      answerQuality: 86,
      clarityScore: 84,
      relevanceScore: 90,
      grammarScore: 88,
      summaryFeedback: 'Strong fundamental knowledge of full-stack asynchronous architecture, Event Loop mechanics, and React reconciliation. Answers were articulate and logically structured.',
      strengths: [
        'Clear breakdown of Node.js non-blocking I/O and libuv thread pool',
        'Effective explanation of React Virtual DOM diffing',
        'Good use of concrete project architectural examples',
      ],
      improvements: [
        'Could discuss microservices communication failure modes in more depth',
        'Include more specific database indexing trade-offs',
      ],
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 18 * 60 * 1000),
    });

    const q1 = await Question.create({
      interviewId: int1._id,
      question: 'Explain how the Event Loop works in Node.js, and how it handles asynchronous I/O operations without blocking the main execution thread.',
      type: 'technical',
      difficulty: 'Medium',
      order: 1,
      expectedTopics: ['Call Stack', 'Libuv Thread Pool', 'Microtasks & Macrotasks', 'Non-blocking I/O'],
    });

    await Answer.create({
      interviewId: int1._id,
      questionId: q1._id,
      userId: user._id,
      transcript: 'Node.js uses a single-threaded event loop powered by libuv. When an asynchronous operation like a database query or file read starts, Node offloads it to the OS or libuv thread pool. Meanwhile, the main call stack continues executing synchronous code. When the async operation completes, its callback is placed in the event queue and picked up when the call stack is empty.',
      answerText: 'Node.js uses a single-threaded event loop powered by libuv. When an asynchronous operation like a database query or file read starts, Node offloads it to the OS or libuv thread pool. Meanwhile, the main call stack continues executing synchronous code. When the async operation completes, its callback is placed in the event queue and picked up when the call stack is empty.',
      score: 88,
      relevance: 92,
      accuracy: 89,
      communication: 86,
      clarity: 88,
      grammar: 90,
      completeness: 85,
      technicalKnowledge: 90,
      strengths: ['Accurate explanation of libuv thread offloading', 'Clear differentiation between synchronous stack and callback queues'],
      weaknesses: ['Did not explicitly mention microtask queue priorities like process.nextTick'],
      suggestions: ['Add a brief mention of microtask vs macrotask execution phases (timers, poll, check)'],
      idealAnswer: 'Node.js operates on a single execution thread using an event-driven architecture powered by libuv. Synchronous code executes immediately on the Call Stack. Asynchronous tasks (I/O, network requests, timers) are delegated to the underlying OS kernel or the libuv worker thread pool. Once completed, their callbacks enter specific phase queues (Timers, Pending I/O, Poll, Check, Close), while Microtasks (process.nextTick, Promise callbacks) execute immediately after each phase transition.',
      feedback: 'Excellent answer displaying a thorough understanding of Node.js internals and non-blocking execution.',
    });

    // 3. Sample Completed Interview #2: HR Interview
    const int2 = await Interview.create({
      userId: user._id,
      interviewType: 'HR',
      targetRole: 'Full Stack Developer',
      difficulty: 'Easy',
      duration: 15,
      questionCount: 2,
      mode: 'voice',
      status: 'completed',
      overallScore: 89,
      technicalScore: 80,
      communicationScore: 92,
      codingScore: 0,
      answerQuality: 88,
      clarityScore: 90,
      relevanceScore: 92,
      grammarScore: 94,
      summaryFeedback: 'Exceptional communication skills, high emotional intelligence, and great structure using the STAR method for behavioral responses.',
      strengths: [
        'Exemplary STAR method execution',
        'Balanced, constructive reflection on personal development areas',
        'Strong team collaboration mindset',
      ],
      improvements: [
        'Ensure answers remain crisp without unnecessary introductory preambles',
      ],
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 1000),
    });

    const q2 = await Question.create({
      interviewId: int2._id,
      question: 'Tell me about a time when you experienced a disagreement with a peer or teammate during a technical project. How was it resolved?',
      type: 'hr',
      difficulty: 'Easy',
      order: 1,
      expectedTopics: ['Situation', 'Conflict', 'Resolution', 'Outcome'],
    });

    await Answer.create({
      interviewId: int2._id,
      questionId: q2._id,
      userId: user._id,
      transcript: 'During our college capstone project, our team had a disagreement regarding database choice between MongoDB and PostgreSQL. My peer wanted SQL for relational integrity, while I suggested MongoDB for schema flexibility. To resolve this objectively, we built a small proof of concept benchmark measuring our query patterns and schema changes. We discovered PostgreSQL suited our transaction requirements better, so I happily adopted it. The project succeeded and earned top marks.',
      answerText: 'During our college capstone project, our team had a disagreement regarding database choice between MongoDB and PostgreSQL. My peer wanted SQL for relational integrity, while I suggested MongoDB for schema flexibility. To resolve this objectively, we built a small proof of concept benchmark measuring our query patterns and schema changes. We discovered PostgreSQL suited our transaction requirements better, so I happily adopted it. The project succeeded and earned top marks.',
      score: 92,
      relevance: 95,
      accuracy: 90,
      communication: 93,
      clarity: 92,
      grammar: 95,
      completeness: 88,
      technicalKnowledge: 85,
      strengths: ['Data-driven conflict resolution approach', 'Demonstrated humility and team-first attitude'],
      weaknesses: ['Could briefly mention how peer relationships were maintained during the debate'],
      suggestions: ['Reinforce how this collaborative experience influenced subsequent team decisions'],
      idealAnswer: 'In my final-year project, my peer and I differed on whether to use SQL or NoSQL. Rather than debating theoretically, I proposed defining our quantitative criteria: query complexity, data consistency, and delivery timeline. We created a proof of concept comparing both schemas. The benchmark demonstrated PostgreSQL had clearer ACID guarantees for our financial workflow. By focusing on data rather than egos, we maintained high team morale and delivered on schedule.',
      feedback: 'Outstanding response. Illustrates emotional maturity, active listening, and empirical problem resolution.',
    });

    // 4. Sample Completed Interview #3: Coding Interview
    const int3 = await Interview.create({
      userId: user._id,
      interviewType: 'Coding',
      targetRole: 'Software Developer',
      difficulty: 'Medium',
      duration: 30,
      questionCount: 1,
      mode: 'text',
      preferredLanguage: 'javascript',
      status: 'completed',
      overallScore: 94,
      technicalScore: 92,
      communicationScore: 85,
      codingScore: 96,
      answerQuality: 92,
      clarityScore: 88,
      relevanceScore: 95,
      grammarScore: 90,
      summaryFeedback: 'Flawless algorithmic implementation passing 100% of test cases with optimal O(N) time and O(N) space complexity.',
      strengths: [
        'Optimal hash map complement lookup',
        'Clean variable names and modular layout',
        'Passed all visible and hidden test cases',
      ],
      improvements: [
        'Add guard clause for input array length < 2',
      ],
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
    });

    const q3 = await Question.create({
      interviewId: int3._id,
      question: 'Coding Assessment: Two Sum\n\nGiven an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      type: 'coding',
      difficulty: 'Medium',
      order: 1,
      codingChallenge: {
        title: 'Two Sum',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.',
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
          { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', isHidden: false },
          { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', isHidden: false },
          { input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]', isHidden: true },
        ],
      },
    });

    await CodingSubmission.create({
      interviewId: int3._id,
      questionId: q3._id,
      userId: user._id,
      language: 'javascript',
      code: `function twoSum(nums, target) {
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
      testCasesPassed: 3,
      totalTestCases: 3,
      executionTimeMs: 42,
      score: 96,
      correctnessScore: 100,
      codeQualityScore: 92,
      timeComplexityScore: 95,
      spaceComplexityScore: 90,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      feedback: 'Optimal linear time complexity achieved via single-pass hash map tracking.',
      strengths: ['Single-pass O(N) complexity', 'Modern ES6 Map implementation'],
      suggestions: ['Add early exit if array length is less than 2'],
      testResults: [
        { testCaseIndex: 1, input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', actualOutput: '[0,1]', passed: true },
        { testCaseIndex: 2, input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', actualOutput: '[1,2]', passed: true },
        { testCaseIndex: 3, input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]', actualOutput: '[0,1]', passed: true },
      ],
    });

    // 5. Create Performance Progression Entries for Charts
    const performances = [
      {
        userId: user._id,
        interviewId: int1._id,
        interviewType: 'Technical',
        targetRole: 'Full Stack Developer',
        overallScore: 85,
        technicalScore: 88,
        communicationScore: 82,
        codingScore: 80,
        answerQuality: 86,
        relevance: 90,
        clarity: 84,
        grammar: 88,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user._id,
        interviewId: int2._id,
        interviewType: 'HR',
        targetRole: 'Full Stack Developer',
        overallScore: 89,
        technicalScore: 80,
        communicationScore: 92,
        codingScore: 78,
        answerQuality: 88,
        relevance: 92,
        clarity: 90,
        grammar: 94,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user._id,
        interviewId: int3._id,
        interviewType: 'Coding',
        targetRole: 'Software Developer',
        overallScore: 94,
        technicalScore: 92,
        communicationScore: 85,
        codingScore: 96,
        answerQuality: 92,
        relevance: 95,
        clarity: 88,
        grammar: 90,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    await Performance.insertMany(performances);

    console.log('[Seed] Database successfully populated with high-quality demo data!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedData();
