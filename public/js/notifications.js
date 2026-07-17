(function () {
    const bell = document.getElementById("notifBell");
    const badge = document.getElementById("notifBadge");
    const panel = document.getElementById("notifPanel");
    const list = document.getElementById("notifList");
    const markAll = document.getElementById("markAllRead");
    if (!bell || !panel || !list) return;

    let unread = 0;

    function timeAgo(ts) {
        const d = new Date(ts).getTime();
        if (!d) return "";
        const sec = Math.max(1, Math.floor((Date.now() - d) / 1000));
        if (sec < 60) return sec + "s ago";
        const m = Math.floor(sec / 60);
        if (m < 60) return m + "m ago";
        const h = Math.floor(m / 60);
        if (h < 24) return h + "h ago";
        const day = Math.floor(h / 24);
        return day + "d ago";
    }

    function render(items) {
        if (!items || items.length === 0) {
            list.innerHTML = '<div class="empty">You\'re all caught up 🌿</div>';
            return;
        }
        list.innerHTML = items.map(function (n) {
            return (
                '<a class="ds-notif-item ' + (n.read ? "" : "unread") + '" href="' + (n.link || "#") + '" data-id="' + n._id + '">' +
                '<span class="icon"><i class="bi ' + (n.icon || "bi-bell") + '"></i></span>' +
                '<div class="body">' +
                '<div class="title-row">' + escapeHtml(n.title) + '</div>' +
                '<div class="msg">' + escapeHtml(n.message || "") + '</div>' +
                '<div class="time">' + timeAgo(n.createdAt) + '</div>' +
                '</div></a>'
            );
        }).join("");
    }

    function escapeHtml(s) {
        return String(s || "").replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    function updateBadge(n) {
        unread = n;
        if (!badge) return;
        badge.textContent = n > 99 ? "99+" : String(n);
        badge.classList.toggle("on", n > 0);
    }

    async function refresh() {
        try {
            const r = await fetch("/api/v1/notifications");
            const j = await r.json();
            if (j && j.success && j.data) {
                render(j.data.items);
                updateBadge(j.data.unread || 0);
            }
        } catch (e) { /* silent */ }
    }

    bell.addEventListener("click", function (e) {
        e.stopPropagation();
        const open = panel.classList.toggle("open");
        if (open) refresh();
    });

    document.addEventListener("click", function (e) {
        if (!panel.contains(e.target) && !bell.contains(e.target)) {
            panel.classList.remove("open");
        }
    });

    if (markAll) {
        markAll.addEventListener("click", async function (e) {
            e.preventDefault();
            try {
                await fetch("/api/v1/notifications/read-all", { method: "POST" });
                refresh();
            } catch (err) { /* silent */ }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        refresh();
        if (!window.WL_SOCKET) return;
        window.WL_SOCKET.on("notification:new", function (payload) {
            if (!payload) return;
            updateBadge(unread + 1);
            if (window.WL_TOAST) {
                window.WL_TOAST({
                    badge: "NEW",
                    title: payload.title || "Notification",
                    message: payload.message || "",
                    duration: 4000,
                });
            }
            if (panel.classList.contains("open")) refresh();
        });
    });
})();
