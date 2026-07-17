const express = require("express");
const router = express.Router();

const { apiAuth } = require("../../middlewares/apiAuth");
const listings = require("../../controllers/api/listings");
const bookings = require("../../controllers/api/bookings");
const reviews = require("../../controllers/api/reviews");
const auth = require("../../controllers/api/auth");
const wishlist = require("../../controllers/api/wishlist");
const notifications = require("../../controllers/api/notifications");
const realtime = require("../../utils/realtime");
const { ok, notFound, serverError } = require("../../utils/apiResponse");

router.get("/health", (req, res) => {
    res.json({ success: true, data: { status: "ok", time: new Date().toISOString() } });
});

router.post("/auth/register", auth.register);
router.post("/auth/login", auth.login);
router.post("/auth/logout", apiAuth(false), auth.logout);
router.get("/auth/me", apiAuth(true), auth.me);

router.get("/listings", listings.list);
router.get("/listings/:id", listings.retrieve);
router.get("/listings/:id/availability", listings.availability);
router.post("/listings", apiAuth(true), listings.create);
router.put("/listings/:id", apiAuth(true), listings.update);
router.patch("/listings/:id", apiAuth(true), listings.update);
router.delete("/listings/:id", apiAuth(true), listings.destroy);

router.get("/listings/:listingId/reviews", reviews.list);
router.post("/listings/:listingId/reviews", apiAuth(true), reviews.create);
router.delete("/listings/:listingId/reviews/:id", apiAuth(true), reviews.destroy);

router.get("/bookings", apiAuth(true), bookings.list);
router.get("/bookings/:id", apiAuth(true), bookings.retrieve);
router.post("/bookings", apiAuth(true), bookings.create);
router.delete("/bookings/:id", apiAuth(true), bookings.destroy);

router.get("/wishlist", apiAuth(true), wishlist.list);
router.get("/wishlist/ids", apiAuth(true), wishlist.ids);
router.post("/wishlist/toggle", apiAuth(true), wishlist.toggle);
router.delete("/wishlist/:listingId", apiAuth(true), wishlist.remove);

router.get("/notifications", apiAuth(true), notifications.list);
router.post("/notifications/read-all", apiAuth(true), notifications.markAllRead);
router.post("/notifications/:id/read", apiAuth(true), notifications.markRead);

router.get("/listings/:id/viewers", (req, res) => {
    return ok(res, { listingId: req.params.id, count: realtime.getViewerCount(req.params.id) });
});

router.use((req, res) => notFound(res, `Route ${req.method} ${req.originalUrl} not found`));

router.use((err, req, res, next) => {
    console.error("[api]", err);
    serverError(res, err.message || "Unexpected error");
});

module.exports = router;
