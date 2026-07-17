const Booking = require("../models/booking");
const Listing = require("../models/listing");
const Wishlist = require("../models/wishlist");

module.exports.index = (req, res) => {
  try {
    if (!req.session.user) {
      return res.render("profile", { currentUser: null });
    }

    res.render("profile", { currentUser: req.session.user });
  }
  catch (err) {
    res.send("something went wrong")
  }
}


module.exports.editprofile = (req, res) => {
  try {
    if (!req.session.user) {

      return res.redirect("/");
    }

    res.render("editprofile", { currentUser: req.session.user });
  }
  catch (err) {
    res.send("something went wrong")
  }
}



module.exports.updateprofile = (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/");
    }

    const { name, email } = req.body;

    req.session.user.name = name;
    req.session.user.email = email;
    req.flash("success", "Profile Updated successfully");
    res.redirect("/profile");
  }
  catch (err) {
    res.send("something went wrong")
  }
}

module.exports.bookings = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/");
    }

    const bookings = await Booking.find({ email: req.session.user.email }).sort({ createdAt: -1 });
    res.render("bookings", { bookings, currentUser: req.session.user });
  }
  catch (err) {
    console.log(err);
    res.send("something went wrong")
  }
}

module.exports.listings = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/");
    }

    const listings = await Listing.find({ useremail: req.session.user.email }).sort({ createdAt: -1 }).lean();
    res.render("userlisting", { listings, currentUser: req.session.user });
  }
  catch (err) {
    console.log(err);
    res.send("something went wrong")
  }
}

module.exports.wishlist = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/");
    }
    const email = req.session.user.email.toLowerCase();
    const items = await Wishlist.find({ userEmail: email })
      .sort({ createdAt: -1 })
      .populate("listing")
      .lean();
    const listings = items.map(i => i.listing).filter(Boolean);
    res.render("wishlist", { listings, currentUser: req.session.user });
  }
  catch (err) {
    console.log(err);
    res.send("something went wrong");
  }
}
