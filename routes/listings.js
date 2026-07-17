var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../middlewares/loginmiddleware');
const { isuser } = require('../middlewares/authenticate');
const { validateBooking } = require('../middlewares/bookingValidation');
const { validateImages } = require('../middlewares/validateimage');
const { index, new: newListing, show, create, edit, update, delete: deleteListing, bookingform, createBooking, savebooking, cancelbooking, showavailability, bookingConfirmation } = require("../controllers/listing")

const upload = require('../middlewares/multer');

router.get('/', isLoggedIn, index);


router.get('/new', isLoggedIn, newListing);


// show route
router.get('/:id', isLoggedIn, show);



router.post("/", isLoggedIn, upload.array("listing[image]"), validateImages, create);


// edit listing route
router.get('/:id/edit', isLoggedIn, isuser, edit)


router.post('/:id/edit', isLoggedIn, upload.array("listing[image]"), validateImages, update);




// delete listing route
router.get('/:id/delete', isLoggedIn, isuser, deleteListing)

// booking router for listings
router.get("/:id/booking", isLoggedIn, bookingform);






router.post("/:id/booking", isLoggedIn, validateBooking, createBooking);

/* ===============================
   SAVE BOOKING AFTER PAYMENT
   No validateBooking here — the payment handler already
   validated inputs before opening the Razorpay modal. This
   endpoint verifies the payment signature instead.
================================ */
router.post("/confirm", isLoggedIn, savebooking);




// cancel Booking (GET keeps backwards-compat for existing links; POST is the safe form)
router.get("/:id/cancelbooking", isLoggedIn, cancelbooking)
router.post("/:id/cancelbooking", isLoggedIn, cancelbooking)


// booking confirmation
router.get("/:id/confirmation", isLoggedIn, bookingConfirmation);


// availability route
router.get("/:id/availability", isLoggedIn, showavailability);

module.exports = router;