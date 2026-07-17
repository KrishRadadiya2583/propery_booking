const mongoose = require("mongoose");

const NOTIFICATION_TYPES = [
    "booking_created", "booking_cancelled", "review_new",
    "listing_new", "wishlist_price_drop", "welcome", "system",
];

const notificationSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, index: true, lowercase: true, trim: true },
    type: { type: String, enum: NOTIFICATION_TYPES, default: "system" },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    link: { type: String, default: "" },
    icon: { type: String, default: "bi-bell" },
    read: { type: Boolean, default: false, index: true },
    createdAt: { type: Date, default: Date.now, index: true },
});

const Notification = mongoose.model("Notification", notificationSchema);
Notification.TYPES = NOTIFICATION_TYPES;
module.exports = Notification;
 