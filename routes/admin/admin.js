var express = require("express");
const session = require("express-session");
var router = express.Router();
const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");
const Listing = require("../../models/listing");
const Booking = require("../../models/booking");
const User = require("../../models/user");
const { isAdminLoggedIn } = require("../../middlewares/adminvalidator");


router.get("/", (req, res) => {
  res.render("admin/admin");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    req.flash("error", "Admin not found");
    return res.redirect("/admin");
  }
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    req.flash("error", "Invalid password");
    return res.redirect("/admin");
  }
  req.session.admin = admin;
  req.session.save();
  req.flash("success", "Admin logged in successfully");
  console.log("Admin logged in successfully", req.session.admin);
  res.redirect("/admin/dashboard");

})

router.get("/dashboard", isAdminLoggedIn, async (req, res) => {
  const listings = await Listing.find();
  const bookings = await Booking.find()
  const users = await User.find();
  const totalListings = listings.length;
  const totalBookings = bookings.length;
  const totalUsers = users.length;

  const bookingschart = await Booking.find();
  const userschart = await User.find();
  const listingschart = await Listing.find();
  function groupByMonth(data, key) {
    const result = {};

    data.forEach(item => {
      if (!item[key]) return; // skip if date is missing

      const date = new Date(item[key]); // ensure it's a Date object
      if (isNaN(date)) return;       // skip invalid dates

      const month = date.toLocaleString('default', { month: 'short' });
      if (!result[month]) result[month] = 0;
      result[month] += 1;
    });

    return result;
  }

  const bookingsByMonth = groupByMonth(bookingschart, 'createdAt');
  const usersByMonth = groupByMonth(userschart, 'createdAt');
  const listingsByMonth = groupByMonth(listingschart, 'createdAt');

  // Revenue by month
  const revenueByMonth = {};
  bookingschart.forEach(b => {
    const month = b.createdAt.toLocaleString('default', { month: 'short' });
    if (!revenueByMonth[month]) revenueByMonth[month] = 0;
    revenueByMonth[month] += b.totalPrice;
  });




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

  res.render("admin/dashboard", {
    totalListings, totalBookings, totalUsers, totalRevenue, recentBookings, charts: {
      listings: listingsByMonth,
      users: usersByMonth,
      bookings: bookingsByMonth,
      revenue: revenueByMonth
    }
  });
});


router.get("/listings", isAdminLoggedIn, async (req, res) => {
  const listings = await Listing.find();
  res.render("admin/listing", { listings });

})

router.get("/bookings", isAdminLoggedIn, async (req, res) => {
  const bookings = await Booking.find();
  res.render("admin/bookings", { bookings });
});

router.get("/users", isAdminLoggedIn, async (req, res) => {
  const users = await User.find();
  res.render("admin/users", { users });
});


router.get("/users/:id/delete", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.redirect("/admin/users");
});

router.get("/listings/:id/delete", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/admin/listings");
});

router.get("/bookings/:id/delete", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndDelete(id);
  res.redirect("/admin/bookings");
});


router.get("/logout", isAdminLoggedIn, (req, res) => {
  req.flash("success", "Admin logged out successfully");
  req.session.destroy();
  res.redirect("/");
});



module.exports = router;