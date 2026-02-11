var express = require("express");
var router = express.Router();
const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");
const Listing = require("../../models/listing");
const Booking = require("../../models/booking");
const User = require("../../models/user");


router.get("/", (req, res) => {
    res.render("admin/admin");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({email});
    if(!admin){
        return res.send("Admin not found");
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if(!isPasswordValid){
        return res.send("Invalid password");
    }
    res.redirect("/admin/dashboard");
   
})

router.get("/dashboard", async (req, res) => {
    const listings = await Listing.find().countDocuments();
    const bookings = await Booking.find().countDocuments();
    const users = await User.find().countDocuments();
    const totalListings = listings;
    const totalBookings = bookings;
    const totalUsers = users;
    const result = await Booking.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalPrice" }
      }
    },
    {
      $project: {
        _id: 0,
        totalAmount: 1
      }
    }
  ]);
 

    const totalRevenue = result[0].totalAmount;
    
    res.render("admin/dashboard", { totalListings, totalBookings, totalUsers, totalRevenue });
});


router.get("/listings", async (req, res) => {
    const listings = await Listing.find();
    res.render("admin/listing", { listings });
  
})

router.get("/bookings", async (req, res) => {
    const bookings = await Booking.find();
    res.render("admin/bookings", { bookings });
});

router.get("/users", async (req, res) => {
    const users = await User.find();
    res.render("admin/users", { users });
});


router.get("/users/:id/delete", async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/admin/users");
});

router.get("/listings/:id/delete", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/admin/listings");
});

router.get("/bookings/:id/delete", async (req, res) => {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.redirect("/admin/bookings");
});


router.get("/logout", (req, res) => {
    res.redirect("/");
});



module.exports = router;