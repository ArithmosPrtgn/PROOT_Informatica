/**
 * Carrega a navbar padrão (/sitewide/nav/nav.html) no ponto de montagem #NavS.
 * Usa o helper genérico loadComponent para evitar duplicação de código.
 */
import loadComponent from './loadComponent.js';

document.addEventListener('DOMContentLoaded', () => {
	loadComponent('NavS', '/sitewide/nav/nav.html', 'headerLoaded');
});
