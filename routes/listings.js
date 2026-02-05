var express = require('express');
var router = express.Router();
const Listing = require('../models/listing');
const Booking = require('../models/booking');
const { isLoggedIn } = require('../middlewares/loginmiddleware');
const { isuser } = require('../middlewares/authenticate');
const { validateBooking } = require('../middlewares/bookingValidation');
const { validateImages } = require('../middlewares/validateimage');


const razorpay = require("../config/razorpay");
const upload = require('../middlewares/multer');
// const app = express();
// app.set('view engine', 'ejs');

// index route
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const listings = await Listing.find().lean();
    res.render('listings/listing', { listings, currentUser: req.session.user });
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
});


router.get('/new', isLoggedIn, (req, res) => {
  try {
    res.render("listings/new");
  }
  catch (err) {
    res.send("something went wrong")
  }
})


// show route
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } });
    res.render("listings/show", { listing, currentUser: req.session.user });
  }
  catch (err) {
    res.send('somwthing went wrong')
  }
})

// create listing route
// router.post('/', async (req, res) => {
//   const listing = req.body.listing;
//   const newListing = new Listing(listing);
//   newListing.save().then((data) => {
//     console.log("Listing created successfully");
//   }).catch((err) => {
//     console.log(err);
//   })
//   res.redirect("/listings");
// })

router.post("/", isLoggedIn, upload.array("listing[image]"), validateImages,async (req, res) => {
  try {
    const listing = req.body.listing;

    // Handle uploaded images
    listing.image = [];
    if (req.files && req.files.length > 0) {
      listing.image = req.files.map(f => "/uploads/" + f.filename);
    }

    const newListing = new Listing(listing);
    await newListing.save();
    console.log("Listing created successfully");
    req.flash("success", "Listing Added successfully");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
});


// edit listing route
router.get('/:id/edit', isLoggedIn, isuser, async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  }
  catch (err) {
    res.send('somwthing went wrong')
  }
})

// router.post('/:id/edit', async (req, res) => {
//   const { id } = req.params;

//   Listing.findByIdAndUpdate(
//     id,
//     req.body.listing,
//     { new: true, runValidators: true }
//   )
//     .then(() => {
//       console.log("Listing updated successfully");
//     })
//     .catch((err) => {
//       console.error(err);
//     });
//   res.redirect(`/listings/${id}`);
// })

router.post('/:id/edit', isLoggedIn, upload.array("listing[image]"), validateImages, async (req, res) => {
  try {
    const { id } = req.params;
    const listingData = req.body.listing;

    try {
      await Listing.findByIdAndUpdate(
        id,
        listingData,
        { new: true, runValidators: true }
      );

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => "/uploads/" + f.filename);
        await Listing.findByIdAndUpdate(id, { $push: { image: { $each: newImages } } });
      }

      if (req.body.deleteImages) {
        // Ensure deleteImages is an array (it might be a single string if only 1 checkbox is checked)
        let imagesToDelete = req.body.deleteImages;
        if (!Array.isArray(imagesToDelete)) {
          imagesToDelete = [imagesToDelete];
        }
        await Listing.findByIdAndUpdate(id, { $pull: { image: { $in: imagesToDelete } } });
      }

      console.log("Listing updated successfully");
      req.flash("success", "Listing Updated successfully");
      res.redirect(`/listings/${id}`);
    } catch (err) {
      console.error(err);
      res.send("Something went wrong");
    }
  }
  catch (err) {
    res.send("something went wrong")
  }
});




// delete listing route
router.get('/:id/delete', isLoggedIn, isuser, async (req, res) => {
  try {
    const { id } = req.params;

    Listing.findByIdAndDelete(id).then(() => {
      console.log("Listing deleted successfully");
    }).catch((err) => {
      console.log("Something went wrong");
    })
    req.flash("success", "Listing Deleted successfully");
    res.redirect("/listings");
  }
  catch (err) {
    res.send("something went wrong")
  }
})

// booking router for listings
router.get("/:id/booking", isLoggedIn, async (req, res) => {
  try {
    if (!req.session.user) {
      return res.render("profile", { currentUser: null });
    }
    const listing = await Listing.findById(req.params.id);
    const currentUser = req.session.user;
    res.render("listings/booking", { listing, currentUser });
  }
  catch (err) {
    res.send("something went wrong")
  }
});






router.post("/:id/booking", isLoggedIn, validateBooking, async (req, res) => {
  try {
    const { totalPrice } = req.body;



    const order = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    req.flash("error", "Something went wrong");
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   SAVE BOOKING AFTER PAYMENT
================================ */
router.post("/confirm", isLoggedIn, validateBooking, async (req, res) => {
  try {

    console.log(req.body);
    const listing = await Listing.findById(req.body.listingId);



    const booking = new Booking({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      listingtitle: listing.title,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      guests: req.body.guests,
      totalPrice: req.body.totalPrice,
      paymentId: req.body.paymentId,
    });

    await booking.save();
    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});




// cancel Booking
router.get("/:id/cancelbooking", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    Booking.findByIdAndDelete(id)
      .then(() => {
        console.log("Booking deleted successfully");

      })
      .catch((err) => {
        console.error(err);
      });
    req.flash("success", "Booking cancelled successfully");
    res.redirect("/profile/bookings");
  }
  catch (err) {
    req.flash("error", "Something went wrong");
    res.redirect("/profile/bookings");
  }
})

module.exports = router;