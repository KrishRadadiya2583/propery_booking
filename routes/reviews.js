const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn } = require("../middlewares/loginmiddleware");
// Post Review Route
router.post("/", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect(`/listings/${req.params.id}`);
    }
});

//Route for  Delete Review 
router.get("/:reviewId/delete", isLoggedIn, async (req, res) => {
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
});

module.exports = router;
