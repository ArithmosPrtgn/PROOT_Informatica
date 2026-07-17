const themeToggleHelperUrl = '/js/darkMode/themeToggle.js';

function ensureThemeToggleHelper() {
  if (window.PROOTThemeToggle) {
    return Promise.resolve(window.PROOTThemeToggle);
  }

  if (!window.__PROOTThemeTogglePromise) {
    window.__PROOTThemeTogglePromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = themeToggleHelperUrl;
      script.onload = () => resolve(window.PROOTThemeToggle);
      script.onerror = () => reject(new Error('Theme toggle helper failed to load'));
      document.head.append(script);
    });
  }

  return window.__PROOTThemeTogglePromise;
}

async function initTheme() {
  const btn = document.getElementById('theme');

  const themeToggle = await ensureThemeToggleHelper();

	if (themeToggle.applySavedTheme) {
		themeToggle.applySavedTheme();
	}

	if (!btn) return console.warn('Theme button not found');

  themeToggle.attach(btn);
}

document.addEventListener('headerLoaded', initTheme);