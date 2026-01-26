(() => {
  // Footer year + privacy last updated
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  const today = document.getElementById("today");
  if (today) {
    const d = new Date();
    today.textContent = d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      const t = e.target;
      const clickedInside = menu.contains(t) || toggle.contains(t);
      if (!clickedInside && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Header elevation on scroll
  const header = document.querySelector("[data-elevate]");
  const setHeader = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("elevated");
    else header.classList.remove("elevated");
  };
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  // Contact "sent" banner support (if you enable _redirect with ?sent=1)
  const params = new URLSearchParams(location.search);
  if (params.get("sent") === "1") {
    const main = document.getElementById("main");
    if (main) {
      const banner = document.createElement("div");
      banner.className = "container";
      banner.innerHTML = `
        <div class="card" style="margin-top:16px;">
          <strong>Message sent.</strong>
          <div class="muted">Thanks! We’ll get back to you shortly.</div>
        </div>
      `;
      main.prepend(banner);
    }
  }
})();
