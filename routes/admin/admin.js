var express = require("express");
var router = express.Router();
const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");
const Listing = require("../../models/listing");
const Booking = require("../../models/booking");
const User = require("../../models/user");
const Review = require("../../models/review");
const { isAdminLoggedIn } = require("../../middlewares/adminvalidator");


router.get("/", (req, res) => {
  if (req.session && req.session.admin) return res.redirect("/admin/dashboard");
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
  req.flash("success", "Signed in successfully");
  res.redirect("/admin/dashboard");
});


router.get("/dashboard", isAdminLoggedIn, async (req, res) => {
  const [listings, bookings, users, reviews] = await Promise.all([
    Listing.find(),
    Booking.find(),
    User.find(),
    Review.find(),
  ]);

  const totalListings = listings.length;
  const totalBookings = bookings.length;
  const totalUsers = users.length;
  const totalReviews = reviews.length;

  function groupByMonth(data, key) {
    const result = {};
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthOrder.forEach(m => result[m] = 0);
    data.forEach(item => {
      if (!item[key]) return;
      const date = new Date(item[key]);
      if (isNaN(date)) return;
      const month = date.toLocaleString("default", { month: "short" });
      if (result[month] === undefined) return;
      result[month] += 1;
    });
    return result;
  }

  const bookingsByMonth = groupByMonth(bookings, "createdAt");
  const usersByMonth = groupByMonth(users, "createdAt");
  const listingsByMonth = groupByMonth(listings, "createdAt");

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueByMonth = {};
  monthOrder.forEach(m => revenueByMonth[m] = 0);
  bookings.forEach(b => {
    if (!b.createdAt || !b.totalPrice) return;
    const month = new Date(b.createdAt).toLocaleString("default", { month: "short" });
    if (revenueByMonth[month] === undefined) return;
    revenueByMonth[month] += b.totalPrice;
  });

  const revenueAgg = await Booking.aggregate([
    { $group: { _id: null, totalAmount: { $sum: "$totalPrice" } } },
    { $project: { _id: 0, totalAmount: 1 } },
  ]);
  const totalRevenue = (revenueAgg[0] && revenueAgg[0].totalAmount) || 0;

  const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(6);

  const statusCounts = { confirmed: 0, pending: 0, cancelled: 0, completed: 0 };
  bookings.forEach(b => {
    if (statusCounts[b.status] !== undefined) statusCounts[b.status] += 1;
  });

  res.render("admin/dashboard", {
    pageTitle: "Dashboard",
    totalListings,
    totalBookings,
    totalUsers,
    totalReviews,
    totalRevenue,
    recentBookings,
    statusCounts,
    charts: {
      listings: listingsByMonth,
      users: usersByMonth,
      bookings: bookingsByMonth,
      revenue: revenueByMonth,
    },
  });
});


router.get("/listings", isAdminLoggedIn, async (req, res) => {
  const listings = await Listing.find().sort({ createdAt: -1 });
  res.render("admin/listing", { pageTitle: "Listings", listings });
});

router.get("/bookings", isAdminLoggedIn, async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.render("admin/bookings", {
    pageTitle: "Bookings",
    bookings,
    statuses: Booking.STATUS,
  });
});

router.get("/users", isAdminLoggedIn, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  const bookingCounts = await Booking.aggregate([
    { $group: { _id: "$email", count: { $sum: 1 }, spent: { $sum: "$totalPrice" } } },
  ]);
  const byEmail = {};
  bookingCounts.forEach(b => { byEmail[b._id] = { count: b.count, spent: b.spent }; });

  const enriched = users.map(u => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
    bookingCount: (byEmail[u.email] && byEmail[u.email].count) || 0,
    totalSpent: (byEmail[u.email] && byEmail[u.email].spent) || 0,
  }));

  res.render("admin/users", { pageTitle: "Users", users: enriched });
});

router.get("/reviews", isAdminLoggedIn, async (req, res) => {
  const reviews = await Review.find()
    .populate("listing", "title location")
    .sort({ createdAt: -1 });
  res.render("admin/reviews", { pageTitle: "Reviews", reviews });
});


// ----- mutations -----

router.get("/users/:id/delete", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  req.flash("success", "User deleted");
  res.redirect("/admin/users");
});

router.get("/listings/:id/delete", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/admin/listings");
});

router.get("/bookings/:id/delete", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking deleted");
  res.redirect("/admin/bookings");
});

router.post("/bookings/:id/status", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!Booking.STATUS.includes(status)) {
    req.flash("error", "Invalid status");
    return res.redirect("/admin/bookings");
  }
  const update = { status };
  if (status === "cancelled") {
    update.cancelledAt = new Date();
    update.cancelReason = "Cancelled by admin";
  }
  await Booking.findByIdAndUpdate(id, update);
  req.flash("success", "Booking status updated");
  res.redirect("/admin/bookings");
});

router.get("/reviews/:id/delete", isAdminLoggedIn, async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (review && review.listing) {
    await Listing.findByIdAndUpdate(review.listing, { $pull: { reviews: review._id } });
  }
  await Review.findByIdAndDelete(id);
  req.flash("success", "Review deleted");
  res.redirect("/admin/reviews");
});


router.get("/logout", isAdminLoggedIn, (req, res) => {
  req.flash("success", "Signed out");
  req.session.destroy(() => {
    res.redirect("/admin");
  });
});


module.exports = router;
