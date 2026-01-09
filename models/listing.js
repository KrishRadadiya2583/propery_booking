const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: String,
    image: [{
        type: String,
    }],
    price: {
        type: Number,
    },
    location: String,
    country: String,

    useremail: {
        type: String,
        default: "milspatel21@gmail.com"
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;



