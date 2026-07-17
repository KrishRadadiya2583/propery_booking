const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 2000,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: "Rating must be a whole number 1-5",
        },
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // Denormalised so ownership checks work even if User is deleted.
    authorEmail: {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        index: true,
    },
    createdAt: {
        // NB: `Date.now` (function reference), NOT `Date.now()` — the latter
        // freezes every review's timestamp to server-boot time.
        type: Date,
        default: Date.now,
    },
});

// One review per user per listing.
reviewSchema.index({ listing: 1, authorEmail: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Review", reviewSchema);
