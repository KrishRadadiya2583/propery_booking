const Listing = require("../models/listing");
const Review = require("../models/review");
const realtime = require("../utils/realtime");
const notify = require("../utils/notify");


module.exports.create = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();

        realtime.emitReviewCreated(String(listing._id), {
            listingId: String(listing._id),
            review: {
                name: newReview.name,
                rating: newReview.rating,
                comment: newReview.comment || "",
            },
        });

        if (listing.useremail) {
            await notify.push({
                userEmail: listing.useremail,
                type: "review_new",
                title: `New ${newReview.rating || 5}★ review on ${listing.title}`,
                message: `${newReview.name}: ${(newReview.comment || "").slice(0, 100)}`,
                link: `/listings/${listing._id}`,
                icon: "bi-star-fill",
            });
        }

        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect(`/listings/${req.params.id}`);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error", "Something went wrong!");
        res.redirect(`/listings/${req.params.id}`);
    }
}
