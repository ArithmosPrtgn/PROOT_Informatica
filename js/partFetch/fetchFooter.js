/**
 * Carrega o rodapé (/sitewide/footer/footer.html) no ponto de montagem #footerLoL.
 * Reutiliza o helper genérico loadComponent para evitar duplicação de código.
 */
import loadComponent from './loadComponent.js';

document.addEventListener('DOMContentLoaded', () => {
	loadComponent('footerLoL', '/sitewide/footer/footer.html', 'footerLoaded');
});
