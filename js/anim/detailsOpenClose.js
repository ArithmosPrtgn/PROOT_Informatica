/**
 * Script de animação para elementos <details> com classe .subjectSelection.
 * Simula o fechamento com animação CSS (transitionend) antes de remover o atributo open.
 *
 * Também gerencia o botão de toggle para caixas .calloutBox (colapsar/expandir).
 */
document.querySelectorAll('details.subjectSelection').forEach((el) => {
	el.addEventListener('click', (e) => {
		// Ignora cliques fora do <summary>
		if (!e.target.closest('summary')) return;
		// Se já estiver fechando ou não estiver aberto, deixa o comportamento nativo
		if (!el.open) return;
		e.preventDefault();
		el.classList.add('is-closing');
		el.addEventListener(
			'transitionend',
			() => {
				el.classList.remove('is-closing');
				el.removeAttribute('open');
			},
			{ once: true }
		);
	});
});

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.toggleContent').forEach((button) => {
		button.addEventListener('click', () => {
			const calloutBox = button.closest('.calloutBox');
			if (calloutBox) {
				calloutBox.classList.toggle('collapsed');
			}
		});
	});
});
