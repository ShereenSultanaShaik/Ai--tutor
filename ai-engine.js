/* ==========================================================================
   AI Tutor Intelligence Engine & Quiz Generator
   ========================================================================== */

import { appState } from './state.js';

export const AIEngine = {
  // Generate style-adapted response to a user query
  async getTutorResponse(userMessage, tutorMode = 'standard') {
    const profile = appState.getProfile();
    const apiKey = profile.apiKey;

    // If Gemini API Key is configured, attempt real Gemini API call
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const realResponse = await this.callGeminiAPI(apiKey, userMessage, profile, tutorMode);
        if (realResponse) return realResponse;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to built-in AI engine:', err);
      }
    }

    // Built-in Intelligent Adaptive AI Engine
    return this.generateAdaptiveResponse(userMessage, profile, tutorMode);
  },

  // Built-in Adaptive Logic tailored to Learning Style & Mode
  generateAdaptiveResponse(prompt, profile, tutorMode) {
    const p = prompt.toLowerCase();
    const style = profile.learningStyle;
    const subject = profile.subject;

    let response = '';

    // Tone & Prefix based on Mode
    let modePrefix = '';
    if (tutorMode === 'eli5') {
      modePrefix = `🟢 **Simplifier Mode (ELI5):** Imagine you are explaining this with simple analogies to a 10-year-old!\n\n`;
    } else if (tutorMode === 'socratic') {
      modePrefix = `🤔 **Socratic Guide Mode:** Let us break down this question together step-by-step.\n\n`;
    } else if (tutorMode === 'exam') {
      modePrefix = `🎯 **Exam Coach Mode:** Key formula & high-yield exam patterns to remember:\n\n`;
    }

    // Custom response templates tailored to learning style
    if (p.includes('derivative') || p.includes('rate of change') || p.includes('calculus')) {
      if (style === 'Visual') {
        response = `${modePrefix}### 📐 Visual Breakdown of Derivatives
A derivative measures the **instantaneous rate of change** — essentially the exact slope of a curve at a single point!

\`\`\`diagram
   y ▲
     │       /  (Tangent Line Slope = f'(x))
     │     .*
     │   .*   *  <-- Curve f(x)
     │ .*
─────┼─┴─────────────► x
    x0
\`\`\`

#### Key Visual Insights:
1. **Secant Line**: Connects two points $(x, f(x))$ and $(x+\\Delta x, f(x+\\Delta x))$.
2. **Tangent Line**: Shrink $\\Delta x \\to 0$. The secant line locks into the tangent line!
3. **Power Rule Formula**: $\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$.

*Would you like to test a quick visual example with $f(x) = 3x^2$ or see how it applies to velocity graph slopes?*`;
      } else if (style === 'Auditory') {
        response = `${modePrefix}### 🎧 Conversational Explanation: Derivatives
Think of a derivative like the speedometer in your sports car! 🚗

While your total trip average speed is total distance divided by total time, your **speedometer** tells you how fast you are moving at *this exact microsecond*. That exact current speed is the derivative of your distance position function!

#### Key Sound-Bite:
- **Function $f(x)$**: Your position at time $x$.
- **Derivative $f'(x)$**: The instantaneous rhythm or velocity at time $x$.
- **Formula**: $f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}$.

How does that analogy sound to you? Want to try asking a follow-up about acceleration?`;
      } else if (style === 'Kinesthetic') {
        response = `${modePrefix}### 🛠️ Interactive Hands-On: Derivatives in Action
Let's build a quick mental experiment! Imagine rolling a ball down a steep ramp.

1. **At 1 second**: The ball travels 2 cm.
2. **At 2 seconds**: The ball travels 8 cm.
3. **At 3 seconds**: The ball travels 18 cm.

Notice position $s(t) = 2t^2$.
- To find exact speed at $t = 3$s: Take derivative $s'(t) = 4t$.
- Plug in $t = 3$: Speed is **$12$ cm/s**!

**Practical Try-It Challenge**: If you drop an object with position $h(t) = 5t^2$, what is its velocity at $t = 4$ seconds? Try typing your answer!`;
      } else {
        response = `${modePrefix}### 💡 Socratic/Conceptual Analysis: Derivatives
Consider this fundamental question: How can we measure speed at an instant in time if speed requires a non-zero time interval ($\Delta t$)?

1. We calculate average velocity: $v_{avg} = \frac{\Delta s}{\Delta t}$.
2. What happens as $\Delta t$ approaches 0?
3. We evaluate the mathematical limit of the difference quotient.

This limit is defined as $f'(x)$.
Formula: $f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$.

*What step in this limit transition would you like to explore further?*`;
      }
    } else if (p.includes('integration') || p.includes('integral') || p.includes('area')) {
      response = `${modePrefix}### 📈 Understanding Integration & Area Under Curves
Integration is the **inverse operation** of differentiation! While differentiation breaks a curve down into instantaneous slopes, integration sums up tiny slices to find the total accumulated area under a curve.

#### Step-by-Step Breakdown:
1. **Riemann Sums**: Divide area under curve $f(x)$ into $n$ thin rectangles of width $\Delta x$.
2. **Take Limit**: As $n \to \infty$, the rectangular sum converts into a smooth definite integral:
   $$\\int_{a}^{b} f(x) \, dx = F(b) - F(a)$$

\`\`\`diagram
   y ▲     ┌───┐
     │    ┌┤   ├──┐
     │  ┌─┤│   │  │  <-- Sum of Infinite Rectangles
─────┼──┴─┴┴───┴──┴──► x
     a              b
\`\`\`

*Would you like a practice quiz on finding $\\int_0^3 x^2 dx$?*`;
    } else if (p.includes('newton') || p.includes('force') || p.includes('motion')) {
      response = `${modePrefix}### 🚀 Newton's Laws of Motion Explained
Newton's 3 Laws describe how forces dictate the physical universe:

1. **1st Law (Inertia)**: An object at rest stays at rest unless acted upon by a net force.
2. **2nd Law (F = ma)**: Net Force = Mass $\\times$ Acceleration ($\\\\vec{F}_{net} = m \\\\vec{a}$).
3. **3rd Law (Action-Reaction)**: For every action force, there is an equal and opposite reaction force.

\`\`\`diagram
     [ Mass m ]  ───► Applied Force F
        │
        ▼ Gravity (m*g)
\`\`\`

*Which law would you like to solve an applied physics problem on?*`;
    } else {
      // General Adaptive Response
      response = `${modePrefix}Great question regarding **${subject}**!

As a **${style}** learner at the **${profile.grade}** level, here is the clear breakdown:

1. **Core Concept**: Every complex topic can be decomposed into fundamental principles.
2. **Key Application**: Connecting this concept directly to your goal of *"${profile.goal}"*.
3. **Interactive Step**: Let us test your current understanding with a quick follow-up problem.

*Feel free to ask a follow-up question or generate a quick diagnostic quiz on this topic!*`;
    }

    return response;
  },

  // Generate Topic Quizzes dynamically based on difficulty
  generateQuiz(topicTitle, difficulty = 'Adaptive', count = 3) {
    const quizDatabase = {
      'Derivatives & Power Rule': [
        {
          id: 1,
          question: 'What is the derivative of f(x) = 4x^3 - 5x + 7 with respect to x?',
          options: ['12x^2 - 5', '12x^3 - 5x', '4x^2 - 5', '12x^2 - 5x + 7'],
          correct: 0,
          explanation: 'Using the power rule d/dx[x^n] = n*x^(n-1): d/dx[4x^3] = 12x^2, d/dx[-5x] = -5, and d/dx[7] = 0. Thus f\'(x) = 12x^2 - 5.'
        },
        {
          id: 2,
          question: 'If position function is s(t) = 3t^2 + 2t, what is the velocity at t = 2 seconds?',
          options: ['10 m/s', '14 m/s', '16 m/s', '12 m/s'],
          correct: 1,
          explanation: 'Velocity is derivative of position: v(t) = s\'(t) = 6t + 2. At t = 2: v(2) = 6(2) + 2 = 14 m/s.'
        },
        {
          id: 3,
          question: 'True or False: The derivative of a constant value (e.g. d/dx[15]) is always zero.',
          options: ['True', 'False'],
          correct: 0,
          explanation: 'True! A constant function has a horizontal line slope of zero everywhere.'
        }
      ],
      'Integration & Area': [
        {
          id: 1,
          question: 'What is the indefinite integral ∫ 3x^2 dx?',
          options: ['x^3 + C', '6x + C', '3x^3 + C', 'x^2 + C'],
          correct: 0,
          explanation: 'Using the reverse power rule ∫ x^n dx = (x^(n+1))/(n+1) + C: ∫ 3x^2 dx = 3*(x^3 / 3) + C = x^3 + C.'
        },
        {
          id: 2,
          question: 'Evaluate the definite integral ∫ from 0 to 2 of 2x dx.',
          options: ['2', '4', '6', '8'],
          correct: 1,
          explanation: 'Antiderivative of 2x is x^2. Evaluating from 0 to 2 gives 2^2 - 0^2 = 4.'
        }
      ],
      'Kinematics & Motion': [
        {
          id: 1,
          question: 'A car accelerates uniformly from rest at 3 m/s^2 for 4 seconds. What is its final velocity?',
          options: ['7 m/s', '12 m/s', '24 m/s', '16 m/s'],
          correct: 1,
          explanation: 'v = u + at -> v = 0 + (3 * 4) = 12 m/s.'
        }
      ]
    };

    const questions = quizDatabase[topicTitle] || [
      {
        id: 1,
        question: `Sample diagnostic question for ${topicTitle}: What is the primary principle of this topic?`,
        options: ['Fundamental Property A', 'Derivative Rule B', 'Conservation Law C', 'System Balance D'],
        correct: 0,
        explanation: 'Fundamental Property A represents the core foundational rule for this topic level.'
      },
      {
        id: 2,
        question: `How does difficulty level ${difficulty} modify the evaluation parameters?`,
        options: ['Increases precision requirements', 'Simplifies base equations', 'Changes variable scope', 'Maintains constant scale'],
        correct: 0,
        explanation: 'Higher difficulty parameters evaluate multi-step reasoning and precise calculation skills.'
      }
    ];

    return questions;
  },

  // Generate Flashcards per topic
  generateFlashcards(topicTitle) {
    return [
      { front: `What is the Power Rule in calculus?`, back: `d/dx [x^n] = n · x^(n-1)` },
      { front: `What does the derivative represent geometrically?`, back: `The slope of the tangent line to the curve at a specific point.` },
      { front: `What is the Product Rule for (u · v)'?`, back: `u'v + uv'` },
      { front: `What is the Quotient Rule for (u / v)'?`, back: `(u'v - uv') / v^2` }
    ];
  },

  // Generate Smart Study Plan Adjustment based on weak areas
  generateAdjustedStudyPlan(quizHistory, conceptMap) {
    const weakTopics = [];
    conceptMap.forEach(item => {
      if (item.status === 'weak' || item.score < 60) {
        weakTopics.push(item.title);
      }
    });

    const newPlan = [
      { id: 'p_' + Date.now() + '_1', day: 'Today', topic: weakTopics[0] || 'Derivatives & Power Rule', task: 'Targeted Review: Watch 10-min visual breakdown & solve 3 weak-area questions', duration: 25, completed: false, recommendedReason: '🤖 AI High Priority (Score < 60%)' },
      { id: 'p_' + Date.now() + '_2', day: 'Today', topic: 'Functions & Graphs', task: 'Practice Quiz: 5 questions on curve transformations', duration: 15, completed: false, recommendedReason: 'Regular Concept Reinforcement' },
      { id: 'p_' + Date.now() + '_3', day: 'Tomorrow', topic: weakTopics[1] || 'Integration & Area', task: 'Step-by-step problem walkthrough with AI Tutor', duration: 30, completed: false, recommendedReason: '🤖 AI Recommended Weak Spot' },
      { id: 'p_' + Date.now() + '_4', day: 'Day 3', topic: 'Differential Equations', task: 'Introductory concept reading & slope fields exploration', duration: 20, completed: false, recommendedReason: 'Mastery Progression' }
    ];

    return newPlan;
  },

  // Gemini API Direct Integration Handler
  async callGeminiAPI(apiKey, prompt, profile, mode) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const systemInstruction = `You are an expert AI Learning Tutor assisting a student named ${profile.name}.
Student Subject: ${profile.subject}.
Grade/Level: ${profile.grade}.
Preferred Learning Style: ${profile.learningStyle} (Visual, Auditory, Kinesthetic, Socratic, or Reading).
Tutor Tone Mode: ${mode}.
Adapt explanations to match their learning style with formatting, markdown, and clear step-by-step guidance.`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }]
        }
      ]
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`API response status ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    return null;
  }
};
