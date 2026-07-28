document.addEventListener("DOMContentLoaded", () => {
  const NAV_CONFIG = [
    { mountId: "NavS",   src: "/sitewide/nav/nav.html" },
    { mountId: "NavO",   src: "/sitewide/nav/nav.html" },
    { mountId: "NavLoL", src: "/sitewide/nav/navSp.html" },
  ];

  const config = NAV_CONFIG.find(({ mountId }) => document.getElementById(mountId));
  if (!config) return;

  loadNav(config.mountId, config.src);
});

async function loadNav(mountId, src) {
  const mountPoint = document.getElementById(mountId);

  try {
    const res = await fetch(src);

    if (!res.ok) {
      throw new Error(`Erro ao fetchar nav: ${res.status}`);
    }

    const data = await res.text();
    const parsed = new DOMParser().parseFromString(data, "text/html");
    const navElements = Array.from(parsed.body?.children ?? []);

    if (navElements.length === 0) {
      throw new Error("Cadê o <nav>?");
    }

    mountPoint.replaceWith(...navElements);
    document.dispatchEvent(new Event("headerLoaded"));
  } catch (error) {
    console.error("Erro ao carregar nav:", error);
  }
}