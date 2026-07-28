/**
 * Carrega a navbar simplificada para a página "Sobre" (/sitewide/nav/nav.html)
 * no ponto de montagem #NavO. Reutiliza o helper genérico loadComponent.
 */
import loadComponent from './loadComponent.js';

document.addEventListener('DOMContentLoaded', () => {
	loadComponent('NavO', '/sitewide/nav/nav.html', 'headerLoaded');
});
