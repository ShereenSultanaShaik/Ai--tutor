/* ==========================================================================
   Main Application Entry Point & Router
   ========================================================================== */

import { appState } from './state.js';
import { Utils } from './utils.js';
import { profileView } from './views/profileView.js';
import { tutorView } from './views/tutorView.js';
import { conceptMapView } from './views/conceptMapView.js';
import { quizView } from './views/quizView.js';
import { analyticsView } from './views/analyticsView.js';
import { studyPlanView } from './views/studyPlanView.js';

class App {
  constructor() {
    this.currentTab = 'tutor';
    this.init();
  }

  init() {
    this.updateUserSidebar();
    this.setupNavigation();
    this.setupThemeToggle();
    this.handleRouting();
    
    // Hash change router listener
    window.addEventListener('hashchange', () => this.handleRouting());
  }

  updateUserSidebar() {
    const profile = appState.getProfile();
    const stats = appState.getStats();

    const nameEl = document.getElementById('user-name-display');
    const metaEl = document.getElementById('user-meta-display');
    const avatarEl = document.getElementById('user-avatar-display');
    const streakEl = document.getElementById('navbar-streak-display');
    const styleEl = document.getElementById('navbar-style-display');

    if (nameEl) nameEl.innerText = profile.name;
    if (metaEl) metaEl.innerText = `${profile.subject} • ${profile.grade}`;
    if (avatarEl) avatarEl.innerText = profile.avatar || '👨‍🎓';
    if (streakEl) streakEl.innerText = `🔥 ${stats.streakDays} Day Streak`;
    if (styleEl) styleEl.innerText = `🎨 ${profile.learningStyle}`;
  }

  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const tab = item.getAttribute('data-tab');
        if (tab) {
          window.location.hash = `#${tab}`;
        }
      });
    });
  }

  setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        btn.innerText = isLight ? '🌙' : '☀️';
        Utils.showToast(`Switched to ${isLight ? 'Light' : 'Dark'} mode`, 'info');
      });
    }
  }

  handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'tutor';
    this.currentTab = hash;

    // Update active nav link
    document.querySelectorAll('.nav-item').forEach(nav => {
      if (nav.getAttribute('data-tab') === hash) {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });

    const mainContainer = document.getElementById('main-view-container');
    const pageTitle = document.getElementById('page-title-text');
    const pageSubtitle = document.getElementById('page-subtitle-text');

    if (!mainContainer) return;

    // Render corresponding view
    if (hash === 'profile') {
      if (pageTitle) pageTitle.innerText = 'Student Profile & Goals';
      if (pageSubtitle) pageSubtitle.innerText = 'Customize subject, learning style, and academic targets.';
      mainContainer.innerHTML = profileView.render();
      profileView.bindEvents(() => this.updateUserSidebar());
    } else if (hash === 'tutor') {
      if (pageTitle) pageTitle.innerText = 'AI Natural Language Tutor';
      if (pageSubtitle) pageSubtitle.innerText = 'Ask questions, get visual breakdowns, and explore step-by-step explanations.';
      mainContainer.innerHTML = tutorView.render();
      tutorView.bindEvents();
    } else if (hash === 'map') {
      if (pageTitle) pageTitle.innerText = 'Adaptive Knowledge Map';
      if (pageSubtitle) pageSubtitle.innerText = 'Explore topic prerequisites and assess current concept mastery.';
      mainContainer.innerHTML = conceptMapView.render();
      conceptMapView.bindEvents((topic) => {
        quizView.activeTopic = topic;
        window.location.hash = '#quiz';
      });
    } else if (hash === 'quiz') {
      if (pageTitle) pageTitle.innerText = 'AI Quiz & Flashcards Generator';
      if (pageSubtitle) pageSubtitle.innerText = 'Test your skills with adaptive difficulty quizzes and flashcards.';
      mainContainer.innerHTML = quizView.render();
      quizView.bindEvents();
    } else if (hash === 'analytics') {
      if (pageTitle) pageTitle.innerText = 'Learning Progress & Analytics';
      if (pageSubtitle) pageSubtitle.innerText = 'Track accuracy, identify weak areas, and view smart recommendations.';
      mainContainer.innerHTML = analyticsView.render();
      analyticsView.bindEvents();
    } else if (hash === 'plan') {
      if (pageTitle) pageTitle.innerText = 'Personalized AI Study Schedule';
      if (pageSubtitle) pageSubtitle.innerText = 'Follow your customized daily checklist with smart auto-rescheduling.';
      mainContainer.innerHTML = studyPlanView.render();
      studyPlanView.bindEvents();
    } else {
      window.location.hash = '#tutor';
    }
  }
}

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.aiApp = new App();
});
