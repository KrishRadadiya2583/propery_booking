const mongoose = require("mongoose");

const AMENITY_ENUM = [
    "wifi", "parking", "kitchen", "tv", "ac", "heating",
    "washer", "dryer", "workspace", "pool", "hot_tub", "gym",
    "breakfast", "fireplace", "pet_friendly", "smoke_alarm", "first_aid",
    "ev_charger", "garden", "balcony", "sea_view", "mountain_view",
];

const CATEGORY_ENUM = [
    "all", "cabins", "beach", "mountain", "countryside", "lakefront",
    "farmstay", "treehouse", "camping", "villa", "cottage", "eco_stay",
];

const listingSchema = new mongoose.Schema({
    title: { type: String },
    description: String,

    image: [
        {
            url: String,
            fileId: String,
        }
    ],

    price: { type: Number },
    location: String,
    country: String,

    useremail: {
        type: String,
        default: "milspatel21@gmail.com"
    },
    hostName: { type: String },

    category: {
        type: String,
        enum: CATEGORY_ENUM,
        default: "all",
    },
    amenities: [{ type: String, enum: AMENITY_ENUM }],

    maxGuests: { type: Number, default: 4 },
    bedrooms: { type: Number, default: 1 },
    beds: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

listingSchema.virtual("avgRating").get(function () {
    if (!this.reviews || !this.reviews.length) return null;
    const withRating = this.reviews.filter(r => r && typeof r.rating === "number");
    if (!withRating.length) return null;
    return Number((withRating.reduce((s, r) => s + r.rating, 0) / withRating.length).toFixed(2));
});

listingSchema.set("toJSON", { virtuals: true });
listingSchema.set("toObject", { virtuals: true });

const Listing = mongoose.model("Listing", listingSchema);
Listing.AMENITY_ENUM = AMENITY_ENUM;
Listing.CATEGORY_ENUM = CATEGORY_ENUM;
module.exports = Listing;
