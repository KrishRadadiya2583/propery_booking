const Wishlist = require("../../models/wishlist");
const Listing = require("../../models/listing");
const realtime = require("../../utils/realtime");
const { ok, created, badRequest, notFound, asyncHandler } = require("../../utils/apiResponse");

exports.list = asyncHandler(async (req, res) => {
    const items = await Wishlist.find({ userEmail: req.user.email.toLowerCase() })
        .sort({ createdAt: -1 })
        .populate("listing")
        .lean();
    return ok(res, items);
});

exports.ids = asyncHandler(async (req, res) => {
    const items = await Wishlist.find({ userEmail: req.user.email.toLowerCase() }).select("listing").lean();
    return ok(res, items.map(i => String(i.listing)));
});

exports.toggle = asyncHandler(async (req, res) => {
    const { listingId } = req.body || {};
    if (!listingId) return badRequest(res, "listingId required");

    const listing = await Listing.findById(listingId).lean();
    if (!listing) return notFound(res, "Listing not found");

    const email = req.user.email.toLowerCase();
    const existing = await Wishlist.findOne({ userEmail: email, listing: listingId });
    if (existing) {
        await existing.deleteOne();
        realtime.emitWishlistChanged(email, { action: "remove", listingId: String(listingId) });
        return ok(res, { liked: false, listingId: String(listingId) });
    }

    await Wishlist.create({ userEmail: email, listing: listingId });
    realtime.emitWishlistChanged(email, {
        action: "add",
        listingId: String(listingId),
        title: listing.title,
        image: listing.image && listing.image[0] && listing.image[0].url,
    });
    return created(res, { liked: true, listingId: String(listingId) });
});

exports.remove = asyncHandler(async (req, res) => {
    const email = req.user.email.toLowerCase();
    await Wishlist.deleteOne({ userEmail: email, listing: req.params.listingId });
    realtime.emitWishlistChanged(email, { action: "remove", listingId: String(req.params.listingId) });
    return ok(res, { removed: true });
});
