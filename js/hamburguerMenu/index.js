const hamburgerMenuUrl = '/sitewide/hb/hamburgerMenu.html';
let hamburgerMenuRoot = null;
let hamburgerMenuLoading = false;

const themeToggleHelperUrl = '/js/darkMode/themeToggle.js';
const saveAsHelperUrl = '/js/saveAs/index.js';

// ---- Accessibility storage keys (ported from a11y index.js) ----
const TEXT_SIZE_STORAGE_KEY = 'a11yTextScale';
const ANIMATIONS_STORAGE_KEY = 'a11yAnimations';
const HIGH_CONTRAST_STORAGE_KEY = 'a11yHighContrast';

const DEFAULT_TEXT_SCALE = 1;

// ---- Text Size ----
function getSavedTextScale() {
	const saved = parseFloat(localStorage.getItem(TEXT_SIZE_STORAGE_KEY));
	return Number.isFinite(saved) ? saved : DEFAULT_TEXT_SCALE;
}

function applyTextScale(scale) {
	document.documentElement.style.setProperty('--text-scale', scale);
}

function saveTextScale(scale) {
	try {
		localStorage.setItem(TEXT_SIZE_STORAGE_KEY, String(scale));
	} catch (error) {
		console.warn('Não foi possível salvar o tamanho de texto:', error);
	}
}

// ---- Animations ----
function getSavedAnimations() {
	const saved = localStorage.getItem(ANIMATIONS_STORAGE_KEY);
	return saved !== null ? saved === 'true' : true;
}

function applyAnimations(enabled) {
	if (!enabled) {
		document.documentElement.classList.add('a11y-no-animations');
	} else {
		document.documentElement.classList.remove('a11y-no-animations');
	}
}

function saveAnimations(enabled) {
	try {
		localStorage.setItem(ANIMATIONS_STORAGE_KEY, String(enabled));
	} catch (error) {
		console.warn('Não foi possível salvar a configuração de animações:', error);
	}
}

// ---- High Contrast ----
function getSavedHighContrast() {
	const saved = localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY);
	return saved === 'true';
}

function applyHighContrast(enabled) {
	if (enabled) {
		document.documentElement.classList.add('a11y-high-contrast');
	} else {
		document.documentElement.classList.remove('a11y-high-contrast');
	}
}

function saveHighContrast(enabled) {
	try {
		localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(enabled));
	} catch (error) {
		console.warn('Não foi possível salvar a configuração de alto contraste:', error);
	}
}

// Apply saved a11y settings as soon as this script loads, same as a11y/index.js did.
applyTextScale(getSavedTextScale());
applyAnimations(getSavedAnimations());
applyHighContrast(getSavedHighContrast());

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

function ensureSaveAsHelper() {
	if (window.PROOTSaveAs) {
		return Promise.resolve(window.PROOTSaveAs);
	}

	if (!window.__PROOTSaveAsPromise) {
		window.__PROOTSaveAsPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = saveAsHelperUrl;
			script.onload = () => {
				if (window.PROOTSaveAs) {
					resolve(window.PROOTSaveAs);
				} else {
					window.__PROOTSaveAsPromise = null;
					reject(new Error('saveAs script loaded but did not set window.PROOTSaveAs'));
				}
			};
			script.onerror = () => {
				window.__PROOTSaveAsPromise = null;
				reject(new Error('Save-as helper failed to load'));
			};
			document.head.append(script);
		});
	}

	return window.__PROOTSaveAsPromise;
}

function closeHamburgerMenu() {
	if (hamburgerMenuRoot) {
		const settings = hamburgerMenuRoot.querySelector('#settings');
		const hideContent = hamburgerMenuRoot.querySelector('#hideContent');

		if (!settings || !hideContent) {
			hamburgerMenuRoot.remove();
			hamburgerMenuRoot = null;
			return;
		}

		settings.classList.remove('appears');
		hideContent.classList.remove('appears');
		settings.addEventListener('transitionend', () => {
			if (hamburgerMenuRoot) {
				hamburgerMenuRoot.remove();
				hamburgerMenuRoot = null;
			}
		}, { once: true });
	}
}

window.PROOTHamburgerMenu = {
	close: closeHamburgerMenu,
	open: openHamburgerMenu
};

const THEME_BUTTON_SELECTOR = '#theme, #themeComplex';

async function bindThemeButtons(root = document) {
	try {
		const themeToggle = await ensureThemeToggleHelper();

		if (!window.__PROOTThemeApplied && themeToggle.applySavedTheme) {
			window.__PROOTThemeApplied = true;
			themeToggle.applySavedTheme();
		}

		const buttons = root.querySelectorAll(THEME_BUTTON_SELECTOR);
		buttons.forEach((button) => themeToggle.attach(button));
	} catch (error) {
		console.error('Erro ao inicializar o alternador de tema:', error);
		window.__PROOTThemeApplied = false;
	}
}

async function initHamburgerSaveAs() {
	const button = hamburgerMenuRoot?.querySelector('#saveOffline');
	if (!button || button.dataset.saveAsBound === 'true') {
		return;
	}

	const saveAs = await ensureSaveAsHelper();
	saveAs.attach(button);
}

// Binds the accessibility controls (#textSize, #animatedWebsite, #highContrast)
// that live inside hamburgerMenu.html, mirroring what a11y/index.js did for a11y.html.
function initHamburgerA11yControls(root) {
	const textSizeInput = root.querySelector('#textSize');
	if (textSizeInput && textSizeInput.dataset.a11yBound !== 'true') {
		textSizeInput.dataset.a11yBound = 'true';
		textSizeInput.value = getSavedTextScale();
		textSizeInput.addEventListener('input', () => {
			const scale = parseFloat(textSizeInput.value);
			applyTextScale(scale);
			saveTextScale(scale);
		});
	}

	const animatedCheckbox = root.querySelector('#animatedWebsite');
	if (animatedCheckbox && animatedCheckbox.dataset.a11yBound !== 'true') {
		animatedCheckbox.dataset.a11yBound = 'true';
		animatedCheckbox.checked = getSavedAnimations();
		animatedCheckbox.addEventListener('change', (e) => {
			const enabled = e.target.checked;
			applyAnimations(enabled);
			saveAnimations(enabled);
		});
	}

	const highContrastCheckbox = root.querySelector('#highContrast');
	if (highContrastCheckbox && highContrastCheckbox.dataset.a11yBound !== 'true') {
		highContrastCheckbox.dataset.a11yBound = 'true';
		highContrastCheckbox.checked = getSavedHighContrast();
		highContrastCheckbox.addEventListener('change', (e) => {
			const enabled = e.target.checked;
			applyHighContrast(enabled);
			saveHighContrast(enabled);
		});
	}
}

async function openHamburgerMenu() {
	if (hamburgerMenuRoot || hamburgerMenuLoading) {
		return;
	}

	hamburgerMenuLoading = true;

	try {
		const response = await fetch(hamburgerMenuUrl);

		if (!response.ok) {
			throw new Error(`Erro ao carregar hamburguer menu: ${response.status}`);
		}

		const markup = await response.text();
		const parsed = new DOMParser().parseFromString(markup, 'text/html');
		const overlayNodes = Array.from(parsed.body?.children ?? []);

		if (overlayNodes.length === 0) {
			throw new Error('O hamburguer menu veio vazio.');
		}

		hamburgerMenuRoot = document.createElement('div');
		hamburgerMenuRoot.dataset.hamburgerMenuOverlay = 'true';
		hamburgerMenuRoot.append(...overlayNodes);
		document.body.append(hamburgerMenuRoot);

		window.PROOTArticlePage?.decorateHamburgerMenu?.(hamburgerMenuRoot);

		const hideContent = hamburgerMenuRoot.querySelector('#hideContent');
		const settings = hamburgerMenuRoot.querySelector('#settings');

		if (settings || hideContent) {
			if (settings) {
				settings.getBoundingClientRect();
			}
			if (hideContent) {
				hideContent.getBoundingClientRect();
			}
			requestAnimationFrame(() => {
				settings?.classList.add('appears');
				hideContent?.classList.add('appears');
			});
		}

		const closeButton = hamburgerMenuRoot.querySelector('#iQuit');

		if (closeButton) {
			closeButton.addEventListener('click', closeHamburgerMenu, { once: true });
		}

		bindThemeButtons(hamburgerMenuRoot);
		initHamburgerSaveAs();
		initHamburgerA11yControls(hamburgerMenuRoot);
	} catch (error) {
		console.error('Erro ao abrir hamburguer menu:', error);
	} finally {
		hamburgerMenuLoading = false;
	}
}

function initHamburgerMenu() {
	const hamburgerButton = document.querySelector('#hamburguerB');

	if (!hamburgerButton || hamburgerButton.dataset.hamburgerMenuBound === 'true') {
		return;
	}

	hamburgerButton.dataset.hamburgerMenuBound = 'true';
	hamburgerButton.addEventListener('click', openHamburgerMenu);
}

document.addEventListener('headerLoaded', initHamburgerMenu);
document.addEventListener('DOMContentLoaded', initHamburgerMenu);

document.addEventListener('headerLoaded', () => bindThemeButtons());
document.addEventListener('DOMContentLoaded', () => bindThemeButtons());