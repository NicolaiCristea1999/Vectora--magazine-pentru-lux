/*
 * Mobile navigation enhancement.
 * Loaded as a standalone script so it can be safely added to the page without
 * changing the existing navigation markup.
 */
(() => {
    const nav = document.querySelector("nav");
    const links = nav?.querySelector("ul");
    if (!nav || !links || nav.querySelector(".mobile-menu-toggle")) return;

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "css/mobile-menu.css";
    document.head.appendChild(stylesheet);

    const toggle = document.createElement("button");
    toggle.className = "mobile-menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Deschide meniul de navigare");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";

    nav.insertBefore(toggle, links);

    const setMenuOpen = (isOpen) => {
        nav.classList.toggle("menu-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Închide meniul de navigare" : "Deschide meniul de navigare");
    };

    toggle.addEventListener("click", () => setMenuOpen(toggle.getAttribute("aria-expanded") !== "true"));
    links.addEventListener("click", (event) => {
        if (event.target.closest("a")) setMenuOpen(false);
    });
    document.addEventListener("click", (event) => {
        if (!nav.contains(event.target)) setMenuOpen(false);
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) setMenuOpen(false);
    });
})();
