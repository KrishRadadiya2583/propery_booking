const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middlewares/loginmiddleware");
router.get("/",isLoggedIn, (req, res) => {
  if (!req.session.user) {
return res.render("profile", {currentUser: null});
  }

  res.render("profile", {currentUser: req.session.user});
});

router.get("/edit-profile",isLoggedIn, (req, res) => {
  if (!req.session.user) {

    return res.redirect("/");
  }

  res.render("editprofile", {currentUser: req.session.user});
});

router.post("/edit-profile",isLoggedIn, (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  const { name, email } = req.body;

  req.session.user.name = name;
  req.session.user.email = email;

  res.redirect("/profile");
});


// show your  bookings page

router.get("/bookings",isLoggedIn, async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/", {currentUser: null});
  }

  const bookings = await Booking.find({ user: req.session.user._id });
  res.render("bookings", { bookings, currentUser: req.session.user });
});


router.get("/listings",isLoggedIn, async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/", {currentUser: null});
  }

  const listings = await Listing.find({ user: req.session.user._id });
  res.render("userlisting", { listings, currentUser: req.session.user });
});


module.exports = router;