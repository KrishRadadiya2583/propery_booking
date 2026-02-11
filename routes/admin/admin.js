var express = require("express");
const session = require("express-session");
var router = express.Router();
const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");
const Listing = require("../../models/listing");
const Booking = require("../../models/booking");
const User = require("../../models/user");
const {isAdminLoggedIn} = require("../../middlewares/adminvalidator");


router.get("/", (req, res) => {
    res.render("admin/admin");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({email});
    if(!admin){
        req.flash("error", "Admin not found");
        return res.redirect("/admin");
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if(!isPasswordValid){
       req.flash("error", "Invalid password");
        return res.redirect("/admin");
    }
    req.session.admin = admin;
    req.session.save();
    req.flash("success", "Admin logged in successfully");
    console.log("Admin logged in successfully",req.session.admin);
    res.redirect("/admin/dashboard");
   
})

router.get("/dashboard",isAdminLoggedIn, async (req, res) => {
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
 

const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

    const totalRevenue = result[0].totalAmount;
    
    res.render("admin/dashboard", { totalListings, totalBookings, totalUsers, totalRevenue, recentBookings });
});


router.get("/listings",isAdminLoggedIn, async (req, res) => {
    const listings = await Listing.find();
    res.render("admin/listing", { listings });
  
})

router.get("/bookings",isAdminLoggedIn, async (req, res) => {
    const bookings = await Booking.find();
    res.render("admin/bookings", { bookings });
});

router.get("/users",isAdminLoggedIn, async (req, res) => {
    const users = await User.find();
    res.render("admin/users", { users });
});


router.get("/users/:id/delete",isAdminLoggedIn, async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/admin/users");
});

router.get("/listings/:id/delete",isAdminLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/admin/listings");
});

router.get("/bookings/:id/delete",isAdminLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.redirect("/admin/bookings");
});


router.get("/logout",isAdminLoggedIn, (req, res) => {
  req.flash("success", "Admin logged out successfully");
    req.session.destroy();
    res.redirect("/");
});



module.exports = router;