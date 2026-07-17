(function () {
    const state = { ids: new Set(), loaded: false };
    window.WL_WISHLIST = state;

    function applyHearts() {
        document.querySelectorAll("[data-wl-listing]").forEach((btn) => {
            const id = btn.getAttribute("data-wl-listing");
            const liked = state.ids.has(id);
            btn.classList.toggle("liked", liked);
            const icon = btn.querySelector("i");
            if (icon) icon.className = liked ? "bi bi-heart-fill" : "bi bi-heart";
        });
    }

    async function loadIds() {
        if (!window.WL_CURRENT_USER || !window.WL_CURRENT_USER.email) return;
        try {
            const r = await fetch("/api/v1/wishlist/ids");
            const j = await r.json();
            if (j && j.success && Array.isArray(j.data)) {
                state.ids = new Set(j.data.map(String));
                state.loaded = true;
                applyHearts();
            }
        } catch (e) { /* silent */ }
    }

    async function toggle(listingId) {
        if (!window.WL_CURRENT_USER || !window.WL_CURRENT_USER.email) {
            window.location.href = "/";
            return;
        }
        try {
            const r = await fetch("/api/v1/wishlist/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listingId }),
            });
            const j = await r.json();
            if (!j || !j.success) return;
            if (j.data.liked) state.ids.add(String(listingId));
            else state.ids.delete(String(listingId));
            applyHearts();
            if (window.WL_TOAST) {
                window.WL_TOAST({
                    badge: j.data.liked ? "SAVED" : "REMOVED",
                    title: j.data.liked ? "Added to your wishlist" : "Removed from wishlist",
                    message: j.data.liked ? "Find it later on your Wishlist tab." : "",
                    duration: 2600,
                });
            }
        } catch (e) { /* silent */ }
    }

    window.WL_TOGGLE_WISHLIST = toggle;

    document.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-wl-listing]");
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        toggle(btn.getAttribute("data-wl-listing"));
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadIds);
    } else {
        loadIds();
    }

    // Realtime — reflect wishlist changes from other tabs of the same user
    document.addEventListener("DOMContentLoaded", function () {
        if (!window.WL_SOCKET) return;
        window.WL_SOCKET.on("wishlist:changed", function (payload) {
            if (!payload || !payload.listingId) return;
            if (payload.action === "add") state.ids.add(String(payload.listingId));
            if (payload.action === "remove") state.ids.delete(String(payload.listingId));
            applyHearts();
        });
    });
})();
