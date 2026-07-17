const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, index: true, lowercase: true, trim: true },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

wishlistSchema.index({ userEmail: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
