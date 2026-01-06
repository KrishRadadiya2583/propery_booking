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
})

const Booking = mongoose.model("Booking", bookingschema);
module.exports = Booking;
