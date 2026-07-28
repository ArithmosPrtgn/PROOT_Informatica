/**
 * Carrega a navbar especial (/sitewide/nav/navSp.html) no ponto de montagem #NavLoL.
 * Utiliza o helper genérico loadComponent para manter o código DRY.
 */
import loadComponent from './loadComponent.js';

document.addEventListener('DOMContentLoaded', () => {
	loadComponent('NavLoL', '/sitewide/nav/navSp.html', 'headerLoaded');
});
