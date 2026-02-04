const mongoose = require("mongoose");

const bookingschema = new mongoose.Schema({
    
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    listingtitle:{
        type:String,
    },
    checkIn:{
        type:String,
    },
    checkOut:{
        type:String,
    },
    guests:{
        type:String,
    },
    totalPrice:{
        type:String,
    },
    paymentId:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})

const Booking = mongoose.model("Booking", bookingschema);
module.exports = Booking;
