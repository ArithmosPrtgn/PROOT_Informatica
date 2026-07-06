const themeToggleHelperUrl = '/js/darkMode/themeToggle.js';

function ensureThemeToggleHelper() {
  if (window.SUAEThemeToggle) {
    return Promise.resolve(window.SUAEThemeToggle);
  }

  if (!window.__SUAEThemeTogglePromise) {
    window.__SUAEThemeTogglePromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = themeToggleHelperUrl;
      script.onload = () => resolve(window.SUAEThemeToggle);
      script.onerror = () => reject(new Error('Theme toggle helper failed to load'));
      document.head.append(script);
    });
  }

  return window.__SUAEThemeTogglePromise;
}

async function initTheme() {
  const btn = document.getElementById('theme');
  if (!btn) return console.warn('Theme button not found');

  const themeToggle = await ensureThemeToggleHelper();
  themeToggle.attach(btn);
}

document.addEventListener('headerLoaded', initTheme);