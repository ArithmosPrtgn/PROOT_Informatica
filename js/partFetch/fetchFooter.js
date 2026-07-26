document.addEventListener("DOMContentLoaded", async () => {
  const mountPoint = document.getElementById("footerLoL");

  if (!mountPoint) { return; }

  try {
    const res = await fetch("/sitewide/footer/footer.html");

    if (!res.ok) { throw new Error(`Erro ao fetchar footer: ${res.status}`); }

    const data = await res.text();
    const parsed = new DOMParser().parseFromString(data, "text/html");
    const navElements = Array.from(parsed.body?.children ?? []);

    if (navElements.length === 0) { throw new Error("Cadê o <footer>?"); }

    mountPoint.replaceWith(...navElements);
    document.dispatchEvent(new Event("footerLoaded"));
  } catch (error) {
    console.error("Erro ao carregar footer:", error);
  }
});