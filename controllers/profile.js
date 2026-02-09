const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.index = (req, res) => {
  try{
  if (!req.session.user) {
    return res.render("profile", { currentUser: null });
  }

  res.render("profile", { currentUser: req.session.user });
}
catch(err){
    res.send("something went wrong")
}
}

module.exports.editprofile = (req, res) => {
  try{
  if (!req.session.user) {

    return res.redirect("/");
  }

  res.render("editprofile", { currentUser: req.session.user });
}
catch(err){
  res.send("something went wrong")
}
}



module.exports.updateprofile=(req, res) => {
  try{
  if (!req.session.user) {
    return res.redirect("/");
  }

  const { name, email } = req.body;

  req.session.user.name = name;
  req.session.user.email = email;
req.flash("success", "Profile Updated successfully");
  res.redirect("/profile");
}
catch(err){
  res.send("something went wrong")
}
}

module.exports.bookings = async (req, res) => {
  try{
  if (!req.session.user) {
    return res.redirect("/", { currentUser: null });
  }

  const bookings = await Booking.find({ user: req.session.user._id }).sort({createdAt: -1});
  res.render("bookings", { bookings, currentUser: req.session.user });
}
catch(err){
  res.send("something went wrong")
}
}

module.exports.listings = async (req, res) => {
  try{
  if (!req.session.user) {
    return res.redirect("/", { currentUser: null });
  }

  const listings = await Listing.find({ user: req.session.user._id });
  res.render("userlisting", { listings, currentUser: req.session.user });
}
catch(err){
  res.send("something went wrong")
}
}