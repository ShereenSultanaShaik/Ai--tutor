/* ==========================================================================
   Application State & Persistence Module
   ========================================================================== */

const STORAGE_KEY = 'ai_tutor_app_state_v1';

const defaultState = {
  profile: {
    name: 'Alex Johnson',
    subject: 'Mathematics', // Mathematics, Physics, Computer Science, Biology, Chemistry
    grade: 'High School',
    learningStyle: 'Visual', // Visual, Auditory, Kinesthetic, Socratic, Reading
    goal: 'Ace Advanced Calculus & Pass Final Exams',
    dailyTargetMins: 45,
    avatar: '👨‍🎓',
    apiKey: ''
  },
  stats: {
    streakDays: 4,
    studyTimeMins: 135,
    quizzesCompleted: 7,
    overallAccuracy: 82,
    masteredTopicsCount: 3
  },
  // Concept Mastery Map per Subject
  conceptMap: {
    'Mathematics': [
      { id: 'math_1', title: 'Algebra Fundamentals', difficulty: 'Easy', status: 'mastered', score: 95, desc: 'Linear equations, polynomials, quadratic formulas' },
      { id: 'math_2', title: 'Functions & Graphs', difficulty: 'Easy', status: 'mastered', score: 88, desc: 'Domain, range, transformation of functions' },
      { id: 'math_3', title: 'Limits & Continuity', difficulty: 'Medium', status: 'mastered', score: 90, desc: 'One-sided limits, infinite limits, continuity laws' },
      { id: 'math_4', title: 'Derivatives & Power Rule', difficulty: 'Medium', status: 'progress', score: 72, desc: 'Rates of change, tangent lines, product rule' },
      { id: 'math_5', title: 'Integration & Area', difficulty: 'Hard', status: 'weak', score: 45, desc: 'Anti-derivatives, definite integrals, fundamental theorem' },
      { id: 'math_6', title: 'Differential Equations', difficulty: 'Hard', status: 'locked', score: 0, desc: 'Separable variables, slope fields, modeling growth' }
    ],
    'Physics': [
      { id: 'phy_1', title: 'Kinematics & Motion', difficulty: 'Easy', status: 'mastered', score: 92, desc: 'Displacement, velocity, acceleration vector fields' },
      { id: 'phy_2', title: 'Newton\'s Laws of Motion', difficulty: 'Medium', status: 'progress', score: 76, desc: 'Force, mass, friction, free body diagrams' },
      { id: 'phy_3', title: 'Work, Energy & Power', difficulty: 'Medium', status: 'progress', score: 68, desc: 'Kinetic and potential energy conservation' },
      { id: 'phy_4', title: 'Electricity & Magnetism', difficulty: 'Hard', status: 'weak', score: 40, desc: 'Circuits, Ohm\'s law, magnetic induction' }
    ],
    'Computer Science': [
      { id: 'cs_1', title: 'Variables & Data Structures', difficulty: 'Easy', status: 'mastered', score: 98, desc: 'Arrays, linked lists, dictionaries, stacks' },
      { id: 'cs_2', title: 'Object Oriented Programming', difficulty: 'Medium', status: 'progress', score: 80, desc: 'Classes, inheritance, encapsulation, polymorphism' },
      { id: 'cs_3', title: 'Algorithms & Sorting', difficulty: 'Medium', status: 'progress', score: 65, desc: 'Binary search, merge sort, quicksort, time complexity' },
      { id: 'cs_4', title: 'Dynamic Programming', difficulty: 'Hard', status: 'weak', score: 35, desc: 'Memoization, tabulation, subproblem optimization' }
    ]
  },
  // Active Chat History
  chatHistory: [
    {
      id: 1,
      sender: 'ai',
      text: 'Hello Alex! 👋 I am your AI Tutor. I see your preferred learning style is **Visual** and you are currently working on **Mathematics**. How can I assist you with your calculus or derivative concepts today?'
    }
  ],
  // Quiz Attempts History
  quizHistory: [
    { id: 'q1', topic: 'Derivatives & Power Rule', score: 75, total: 4, date: '2026-08-28', weakSpots: ['Product Rule'] },
    { id: 'q2', topic: 'Integration & Area', score: 40, total: 5, date: '2026-08-29', weakSpots: ['Definite Integrals', 'Substitution'] }
  ],
  // Daily Study Plan
  studyPlan: [
    { id: 'p1', day: 'Today', topic: 'Derivatives & Power Rule', task: 'Review tangent line slopes & solve 5 practice questions', duration: 25, completed: false, recommendedReason: 'Weak score on last quiz' },
    { id: 'p2', day: 'Today', topic: 'Integration & Area', task: 'Watch visual breakdown of Definite Integrals', duration: 20, completed: false, recommendedReason: 'Identify as priority weak area' },
    { id: 'p3', day: 'Tomorrow', topic: 'Functions & Graphs', task: 'Quick refresher quiz on domain and transformations', duration: 15, completed: false, recommendedReason: 'Spaced repetition review' },
    { id: 'p4', day: 'Day 3', topic: 'Differential Equations', task: 'Introductory concept reading & slope fields exploration', duration: 30, completed: false, recommendedReason: 'Unlock next concept' }
  ]
};

class StateManager {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;
    try {
      return { ...defaultState, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
      return defaultState;
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }

  getProfile() {
    return this.state.profile;
  }

  updateProfile(newProfile) {
    this.state.profile = { ...this.state.profile, ...newProfile };
    this.saveState();
  }

  getStats() {
    return this.state.stats;
  }

  getConceptMap(subject) {
    const subj = subject || this.state.profile.subject;
    return this.state.conceptMap[subj] || [];
  }

  updateConceptStatus(subject, nodeId, newScore, newStatus) {
    if (!this.state.conceptMap[subject]) return;
    const node = this.state.conceptMap[subject].find(n => n.id === nodeId);
    if (node) {
      node.score = newScore;
      node.status = newStatus;
      this.saveState();
    }
  }

  getChatHistory() {
    return this.state.chatHistory;
  }

  addChatMessage(sender, text) {
    this.state.chatHistory.push({
      id: Date.now(),
      sender,
      text
    });
    this.saveState();
  }

  clearChatHistory() {
    this.state.chatHistory = [];
    this.saveState();
  }

  getQuizHistory() {
    return this.state.quizHistory;
  }

  addQuizResult(result) {
    this.state.quizHistory.unshift(result);
    this.state.stats.quizzesCompleted += 1;
    // Update overall accuracy average
    const totalScores = this.state.quizHistory.reduce((acc, q) => acc + q.score, 0);
    this.state.stats.overallAccuracy = Math.round(totalScores / this.state.quizHistory.length);
    this.saveState();
  }

  getStudyPlan() {
    return this.state.studyPlan;
  }

  toggleTaskCompleted(taskId) {
    const task = this.state.studyPlan.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      if (task.completed) {
        this.state.stats.studyTimeMins += task.duration;
      }
      this.saveState();
    }
  }

  setStudyPlan(newPlan) {
    this.state.studyPlan = newPlan;
    this.saveState();
  }
}

export const appState = new StateManager();
