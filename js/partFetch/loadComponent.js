/**
 * Helper genérico para carregar componentes compartilhados (navs, footer)
 * via fetch e injetá-los no DOM no ponto de montagem indicado.
 * Dispara um evento customizado após a injeção bem-sucedida.
 * 
 * @param {string} mountId - ID do elemento alvo onde o componente será injetado.
 * @param {string} url - URL do snippet HTML a ser buscado.
 * @param {string} [eventName] - Nome do evento customizado a ser disparado após montagem.
 */
export default async function loadComponent(mountId, url, eventName) {
  const mountPoint = document.getElementById(mountId);
  if (!mountPoint) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro ao carregar ${url}: ${res.status}`);
    const data = await res.text();
    const parsed = new DOMParser().parseFromString(data, 'text/html');
    const elements = Array.from(parsed.body?.children ?? []);
    if (elements.length === 0) throw new Error(`${url} veio vazio`);
    mountPoint.replaceWith(...elements);
    if (eventName) document.dispatchEvent(new Event(eventName));
  } catch (error) {
    console.error(`Erro ao carregar componente (${url}):`, error);
  }
}
