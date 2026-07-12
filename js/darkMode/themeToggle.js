(function () {
	if (window.SUAEThemeToggle) {
		return;
	}

	function applySavedThemeState(button) {
		const icon = button.querySelector('.icoAniTheme');
		const savedTheme = localStorage.getItem('CT');

		if (savedTheme === 'L') {
			document.body.classList.add('L');
			if (icon) {
				icon.innerText = 'sunny';
			}
		}
	}

	function applySavedTheme() {
		const savedTheme = localStorage.getItem('CT');

		if (savedTheme === 'L') {
			document.body.classList.add('L');
		} else {
			document.body.classList.remove('L');
		}
	}

	function attach(button) {
		if (!button || button.dataset.themeBound === 'true') {
			return;
		}

		const icon = button.querySelector('.icoAniTheme');
		let isAnimating = false;

		applySavedThemeState(button);
		button.dataset.themeBound = 'true';

		button.addEventListener('click', () => {
			if (!icon || isAnimating) {
				return;
			}

			isAnimating = true;
			const body = document.body;
			const nextThemeIsLight = !body.classList.contains('L');
			const motionClass = nextThemeIsLight ? 'is-forward' : 'is-reverse';

			icon.classList.remove('is-entering');
			icon.classList.remove('is-forward', 'is-reverse');
			icon.classList.add(motionClass);
			icon.classList.add('is-leaving');

			const handleExit = () => {
				icon.removeEventListener('animationend', handleExit);
				body.classList.toggle('L', nextThemeIsLight);
				localStorage.setItem('CT', nextThemeIsLight ? 'L' : 'D');
				icon.innerText = nextThemeIsLight ? 'sunny' : 'moon_stars';
				icon.classList.remove('is-leaving');
				icon.classList.add('is-entering');

				const handleEnter = () => {
					icon.removeEventListener('animationend', handleEnter);
					icon.classList.remove('is-entering');
					icon.classList.remove('is-forward', 'is-reverse');
					isAnimating = false;
				};

				icon.addEventListener('animationend', handleEnter, { once: true });
			};

			icon.addEventListener('animationend', handleExit, { once: true });
		});
	}

	window.SUAEThemeToggle = { attach, applySavedTheme };
})();