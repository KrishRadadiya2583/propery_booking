const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/loginmiddleware");

const { index, editprofile, updateprofile, bookings, listings, wishlist } = require("../controllers/profile");

router.get("/", isLoggedIn, index);

router.get("/edit-profile", isLoggedIn, editprofile);

router.post("/edit-profile", isLoggedIn, updateprofile);


// show your  bookings page

router.get("/bookings", isLoggedIn, bookings);


router.get("/listings", isLoggedIn, listings);

router.get("/wishlist", isLoggedIn, wishlist);

module.exports = router;