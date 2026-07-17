(function () {
    const STORAGE_KEY = "wl-theme";
    const root = document.documentElement;

    function apply(theme) {
        root.setAttribute("data-theme", theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
        // Update meta theme-color so the mobile URL bar matches.
        const forDark = document.querySelector('meta[name="theme-color"][media*="dark"]');
        const forLight = document.querySelector('meta[name="theme-color"][media*="light"]');
        if (forDark) forDark.setAttribute("media", theme === "dark" ? "all" : "(prefers-color-scheme: dark)");
        if (forLight) forLight.setAttribute("media", theme === "light" ? "all" : "(prefers-color-scheme: light)");
    }

    function toggle() {
        const current = root.getAttribute("data-theme") || "dark";
        apply(current === "dark" ? "light" : "dark");
    }

    document.addEventListener("DOMContentLoaded", function () {
        const btn = document.getElementById("themeToggle");
        if (btn) btn.addEventListener("click", toggle);

        // React to OS preference *only* when the user hasn't picked one yet.
        try {
            const mq = window.matchMedia("(prefers-color-scheme: light)");
            const listener = (e) => {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    apply(e.matches ? "light" : "dark");
                }
            };
            mq.addEventListener ? mq.addEventListener("change", listener) : mq.addListener(listener);
        } catch (e) { /* older browsers */ }
    });

    window.WL_THEME = { apply, toggle, get: () => root.getAttribute("data-theme") };
})();
