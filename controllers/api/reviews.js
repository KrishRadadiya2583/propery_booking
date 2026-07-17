const Listing = require("../../models/listing");
const Review = require("../../models/review");
const realtime = require("../../utils/realtime");
const { ok, created, badRequest, notFound, forbidden, asyncHandler } = require("../../utils/apiResponse");

exports.list = asyncHandler(async (req, res) => {
    const listing = await Listing.findById(req.params.listingId)
        .populate({ path: "reviews", options: { sort: { createdAt: -1 } } })
        .lean();
    if (!listing) return notFound(res, "Listing not found");
    return ok(res, listing.reviews || []);
});

exports.create = asyncHandler(async (req, res) => {
    const { rating, comment, name } = req.body || {};
    if (!rating || !comment) return badRequest(res, "rating and comment are required");

    const listing = await Listing.findById(req.params.listingId);
    if (!listing) return notFound(res, "Listing not found");

    const review = new Review({
        rating: Number(rating),
        comment,
        name: name || (req.user && req.user.name),
        author: req.user && req.user.id,
    });
    await review.save();
    listing.reviews.push(review._id);
    await listing.save();

    realtime.emitReviewCreated(String(listing._id), {
        listingId: String(listing._id),
        review: {
            id: String(review._id),
            name: review.name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
        },
    });
    return created(res, review);
});

exports.destroy = asyncHandler(async (req, res) => {
    const { listingId, id } = req.params;
    const review = await Review.findById(id);
    if (!review) return notFound(res, "Review not found");

    if (req.user && review.name !== req.user.name && req.user.email !== "milspatel21@gmail.com") {
        return forbidden(res);
    }

    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: id } });
    await Review.findByIdAndDelete(id);
    return ok(res, { deleted: true, id });
});
