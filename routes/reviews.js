const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedIn } = require("../middlewares/loginmiddleware");
const {create,delete:deleter} = require("../controllers/review");
// Post Review Route
router.post("/", isLoggedIn, create);

//Route for  Delete Review 
router.get("/:reviewId/delete", isLoggedIn, deleter);

module.exports = router;
