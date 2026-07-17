const mongoose = require("mongoose");

const BOOKING_STATUS = ["pending", "confirmed", "cancelled", "completed"];

const bookingschema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, index: true },
    phone: { type: String },

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        index: true,
    },
    listingtitle: { type: String },
    listingImage: { type: String },
    listingLocation: { type: String },
    hostEmail: { type: String },

    checkIn: { type: String },
    checkOut: { type: String },
    guests: { type: String },
    nights: { type: Number },
    subtotal: { type: Number },
    serviceFee: { type: Number },
    totalPrice: { type: Number },
    paymentId: { type: String },
    razorpayOrderId: { type: String, index: true },
    razorpaySignature: { type: String },

    status: {
        type: String,
        enum: BOOKING_STATUS,
        default: "confirmed",
        index: true,
    },
    cancelledAt: { type: Date },
    cancelReason: { type: String },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Booking = mongoose.model("Booking", bookingschema);
Booking.STATUS = BOOKING_STATUS;
module.exports = Booking;
