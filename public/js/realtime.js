(function () {
    if (typeof io !== "function") {
        console.warn("[realtime] socket.io client not loaded");
        return;
    }

    const socket = io({ transports: ["websocket", "polling"] });
    window.WL_SOCKET = socket;

    // Identify user so the server can put us in a per-user room for notifications.
    socket.on("connect", function () {
        if (window.WL_CURRENT_USER && window.WL_CURRENT_USER.email) {
            socket.emit("user:hello", window.WL_CURRENT_USER.email);
        }
    });

    function ensureToastStack() {
        let stack = document.getElementById("ds-toast-stack");
        if (!stack) {
            stack = document.createElement("div");
            stack.id = "ds-toast-stack";
            stack.className = "ds-toast-stack";
            document.body.appendChild(stack);
        }
        return stack;
    }

    function pushToast({ badge = "LIVE", title, message, duration = 4500 }) {
        const stack = ensureToastStack();
        const toast = document.createElement("div");
        toast.className = "ds-toast";
        toast.innerHTML =
            '<span class="badge">' + badge + "</span>" +
            '<div style="min-width:0"><div style="font-weight:600">' + (title || "") + "</div>" +
            '<div style="color:var(--ds-text-3);font-size:13px;margin-top:2px">' + (message || "") + "</div></div>";
        stack.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("leaving");
            setTimeout(() => toast.remove(), 320);
        }, duration);
    }

    window.WL_TOAST = pushToast;

    socket.on("feed:booking", function (payload) {
        if (!payload) return;
        pushToast({
            badge: "BOOKED",
            title: "Someone just booked",
            message: (payload.listingTitle || "a stay") + " · " +
                (payload.checkIn || "") + " → " + (payload.checkOut || ""),
        });
    });

    socket.on("feed:cancelled", function (payload) {
        if (!payload) return;
        pushToast({
            badge: "OPENED",
            title: "Dates freed up",
            message: (payload.listingTitle || "a stay") + " · " + (payload.checkIn || "") + " → " + (payload.checkOut || ""),
        });
    });

    socket.on("listing:created", function (payload) {
        if (!payload) return;
        pushToast({
            badge: "NEW",
            title: "New listing added",
            message: (payload.title || "") + (payload.location ? " · " + payload.location : ""),
        });
    });

    window.WL_JOIN_LISTING = function (listingId) {
        if (!listingId) return;
        socket.emit("listing:join", listingId);
    };
    window.WL_LEAVE_LISTING = function (listingId) {
        if (!listingId) return;
        socket.emit("listing:leave", listingId);
    };

    const nav = document.getElementById("main-navbar");
    if (nav) {
        const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }
})();
