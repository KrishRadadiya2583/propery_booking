const { Server } = require("socket.io");

let io = null;
const viewerCounts = new Map();

function userRoom(email) {
    return `user:${String(email || "").toLowerCase()}`;
}

function init(httpServer) {
    if (io) return io;
    io = new Server(httpServer, {
        cors: { origin: true, credentials: true },
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        socket.data = socket.data || {};
        socket.data.viewingListings = new Set();

        socket.on("user:hello", (email) => {
            if (typeof email !== "string" || !email) return;
            socket.data.email = email.toLowerCase();
            socket.join(userRoom(email));
        });

        socket.on("listing:join", (listingId) => {
            if (typeof listingId !== "string" || !listingId) return;
            socket.join(`listing:${listingId}`);
            socket.data.viewingListings.add(listingId);
            const next = (viewerCounts.get(listingId) || 0) + 1;
            viewerCounts.set(listingId, next);
            io.to(`listing:${listingId}`).emit("listing:viewers", { listingId, count: next });
        });

        socket.on("listing:leave", (listingId) => {
            if (typeof listingId !== "string") return;
            socket.leave(`listing:${listingId}`);
            if (socket.data.viewingListings.has(listingId)) {
                socket.data.viewingListings.delete(listingId);
                const next = Math.max(0, (viewerCounts.get(listingId) || 0) - 1);
                viewerCounts.set(listingId, next);
                io.to(`listing:${listingId}`).emit("listing:viewers", { listingId, count: next });
            }
        });

        socket.on("disconnect", () => {
            for (const listingId of socket.data.viewingListings) {
                const next = Math.max(0, (viewerCounts.get(listingId) || 0) - 1);
                viewerCounts.set(listingId, next);
                io.to(`listing:${listingId}`).emit("listing:viewers", { listingId, count: next });
            }
        });
    });

    return io;
}

function get() { return io; }

function getViewerCount(listingId) {
    return viewerCounts.get(String(listingId)) || 0;
}

function emitListingBooked(listingId, payload) {
    if (!io) return;
    io.to(`listing:${listingId}`).emit("listing:booked", payload);
    io.emit("feed:booking", payload);
}

function emitBookingCancelled(listingId, payload) {
    if (!io) return;
    io.to(`listing:${listingId}`).emit("listing:cancelled", payload);
    io.emit("feed:cancelled", payload);
}

function emitListingCreated(payload) {
    if (!io) return;
    io.emit("listing:created", payload);
}

function emitListingUpdated(listingId, payload) {
    if (!io) return;
    io.to(`listing:${listingId}`).emit("listing:updated", payload);
    io.emit("feed:listing_updated", payload);
}

function emitReviewCreated(listingId, payload) {
    if (!io) return;
    io.to(`listing:${listingId}`).emit("listing:review", payload);
}

function emitToUser(email, event, payload) {
    if (!io || !email) return;
    io.to(userRoom(email)).emit(event, payload);
}

function emitNotification(email, notification) {
    emitToUser(email, "notification:new", notification);
}

function emitWishlistChanged(email, payload) {
    emitToUser(email, "wishlist:changed", payload);
}

module.exports = {
    init,
    get,
    getViewerCount,
    emitListingBooked,
    emitBookingCancelled,
    emitListingCreated,
    emitListingUpdated,
    emitReviewCreated,
    emitToUser,
    emitNotification,
    emitWishlistChanged,
};
