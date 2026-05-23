export const mockUser = {
  name: 'Arjun Mehta',
  email: 'arjun@example.com',
  initial: 'A',
}

export const mockStats = {
  totalSessions: 12,
  avgScore: 71,
  bestScore: 89,
  topicsMastered: 8,
}

export const mockSessions = [
  { id: 's1', role: 'Senior Backend Engineer', company: 'Stripe', date: 'May 15, 2025', mode: 'thread-puller', score: 82 },
  { id: 's2', role: 'Full Stack Developer', company: 'Notion', date: 'May 12, 2025', mode: 'concept-mapper', score: 67 },
  { id: 's3', role: 'SDE-2', company: 'Amazon', date: 'May 8, 2025', mode: 'thread-puller', score: 45 },
]

export const mockResumes = [
  { id: 'r1', name: 'Arjun_Resume_2025.pdf', date: 'May 1, 2025' },
  { id: 'r2', name: 'Arjun_SWE_Resume.pdf', date: 'Apr 20, 2025' },
]

export const mockQuestions = [
  {
    id: 'q1', number: 1, concept: 'OOP Principles', difficulty: 'easy',
    text: 'Can you explain the four pillars of Object-Oriented Programming and give a real-world example for each?',
    userAnswer: 'The four pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction. Encapsulation bundles data and methods together...',
    score: 8,
    signals: { semantic: 0.84, coverage: 0.80, confidence: 0.78, depth: 0.72 },
    strengths: ['Correctly identified all four pillars', 'Good real-world examples for Encapsulation'],
    shaky: ['Polymorphism explanation was slightly imprecise'],
    missed: ['Did not mention compile-time vs runtime polymorphism'],
    flagged: false,
  },
  {
    id: 'q2', number: 2, concept: 'REST APIs', difficulty: 'medium',
    text: 'What is the difference between PUT and PATCH in REST, and when would you use each?',
    userAnswer: 'PUT replaces the entire resource while PATCH does a partial update. If I want to update just the email of a user, I\'d use PATCH.',
    score: 6,
    signals: { semantic: 0.70, coverage: 0.65, confidence: 0.60, depth: 0.55 },
    strengths: ['Correct core distinction between PUT and PATCH'],
    shaky: ['Did not mention idempotency'],
    missed: ['No mention of partial vs full representation', 'Missing HTTP status code conventions'],
    flagged: true,
  },
  {
    id: 'q3', number: 3, concept: 'SQL Joins', difficulty: 'easy',
    text: 'Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN and FULL OUTER JOIN with examples.',
    userAnswer: 'INNER JOIN returns only matching rows. LEFT JOIN returns all rows from left table and matching from right...',
    score: 9,
    signals: { semantic: 0.92, coverage: 0.90, confidence: 0.88, depth: 0.85 },
    strengths: ['Comprehensive coverage of all join types', 'Clear examples provided', 'Mentioned NULL behavior correctly'],
    shaky: [],
    missed: [],
    flagged: false,
  },
  {
    id: 'q4', number: 4, concept: 'SQL Indexing', difficulty: 'hard',
    text: 'How does a B-Tree index work internally, and what are the trade-offs of adding too many indexes to a table?',
    userAnswer: 'Indexes speed up reads by creating a separate data structure. B-Trees are balanced and allow O(log n) lookups...',
    score: 5,
    signals: { semantic: 0.60, coverage: 0.55, confidence: 0.50, depth: 0.45 },
    strengths: ['Correctly identified O(log n) complexity'],
    shaky: ['B-Tree internal structure was vague', 'Trade-off explanation was incomplete'],
    missed: ['Did not mention write overhead', 'No mention of index selectivity', 'Covering indexes not discussed'],
    flagged: false,
  },
  {
    id: 'q5', number: 5, concept: 'System Design', difficulty: 'hard',
    text: 'Design a URL shortener like bit.ly. Walk me through your high-level architecture.',
    userAnswer: 'I would use a hash function to generate short codes. Store the mapping in a database...',
    score: 7,
    signals: { semantic: 0.75, coverage: 0.70, confidence: 0.68, depth: 0.65 },
    strengths: ['Identified core components correctly', 'Mentioned caching layer'],
    shaky: ['Scaling strategy was underdeveloped'],
    missed: ['No mention of collision handling', 'Analytics and rate limiting not addressed'],
    flagged: false,
  },
]

export const mockSummary = {
  overallScore: 72,
  strong: ['OOP Principles', 'REST APIs', 'SQL Joins'],
  needsWork: ['SQL Indexing internals', 'System Design depth'],
  gaps: ['Concurrency', 'Distributed Systems', 'OS Concepts'],
  issues: [
    { text: 'Tendency to give surface-level answers on internals without diving into implementation details.' },
    { text: 'Missed key trade-offs in multiple questions — focus on pros/cons framing.' },
  ],
  improvements: [
    { text: 'Study B-Tree and LSM-Tree index structures from the ground up.' },
    { text: 'Practice 5 system design problems focusing on scalability and fault tolerance.' },
    { text: 'Review concurrency primitives: mutexes, semaphores, deadlock conditions.' },
  ],
  overallFeedback: 'Arjun demonstrates solid foundational knowledge in OOP and SQL basics. The answers reflect someone who has worked with these technologies in practice. However, when questions probe internal implementations or edge cases, the depth drops significantly. The primary growth area is moving from "knowing what" to "knowing why and how" — especially for database internals and system design. With targeted study on the gaps identified, a score above 85 is very achievable.',
}