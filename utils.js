/* ==========================================================================
   Utility Helpers & Speech Synthesizer Module
   ========================================================================== */

export const Utils = {
  // Show Toast Notification
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // Text-To-Speech Synthesizer
  speakText(text) {
    if (!('speechSynthesis' in window)) {
      this.showToast('Text-to-speech is not supported in this browser.', 'warning');
      return;
    }

    window.speechSynthesis.cancel(); // Stop current speech
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/```[\s\S]*?```/g, 'Code block snippet omitted.');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Select friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
    this.showToast('Playing voice explanation...', 'info');
  },

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  // Simple Markdown & Code Block Formatter
  parseMarkdown(text) {
    if (!text) return '';
    let parsed = text;

    // Visual Diagram Box Detection
    parsed = parsed.replace(/```diagram([\s\S]*?)```/g, (match, p1) => {
      return `<div class="visual-diagram-box">${p1.trim()}</div>`;
    });

    // Standard Code Blocks
    parsed = parsed.replace(/```(\w+)?([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre style="background:#090d16; padding:0.85rem; border-radius:8px; overflow-x:auto; margin:0.5rem 0; border:1px solid rgba(255,255,255,0.1);"><code style="font-family:monospace; color:#38bdf8;">${this.escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline Code
    parsed = parsed.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; font-family:monospace; color:#f472b6;">$1</code>');

    // Bold & Italics
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Bullet Lists
    parsed = parsed.replace(/^\s*[-*]\s+(.*)$/gim, '<li style="margin-left:1.2rem;">$1</li>');

    // Line breaks
    parsed = parsed.replace(/\n/g, '<br>');

    return parsed;
  },

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  },

  formatTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  }
};
