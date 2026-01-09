var express = require('express');
var router = express.Router();
const Listing = require('../models/listing');
const Booking = require('../models/booking');
const { isLoggedIn } = require('../middlewares/loginmiddleware');
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

router.post("/", isLoggedIn, async (req, res) => {
  try {
    const listing = req.body.listing;

    // Optional: Remove empty URLs
    listing.image = listing.image.filter(url => url && url.trim() !== "");

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
router.get('/:id/edit', isLoggedIn, async (req, res) => {
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

router.post('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const listingData = req.body.listing;

    // Ensure image is an array and remove empty values
    if (!Array.isArray(listingData.image)) {
      listingData.image = listingData.image ? [listingData.image] : [];
    }
    listingData.image = listingData.image.filter(url => url && url.trim() !== "");

    try {
      await Listing.findByIdAndUpdate(
        id,
        listingData,
        { new: true, runValidators: true }
      );
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
router.get('/:id/delete', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    Listing.findByIdAndDelete(id)
      .then(() => {
        console.log("Listing deleted successfully");

      })
      .catch((err) => {
        console.error(err);
      });
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



router.post("/:id/booking", isLoggedIn, async (req, res) => {
  try {
    console.log(req.body);


    const listing = await Listing.findById(req.params.id);
    const listingtitle = listing.title;

    const { name, email, phone, checkIn, checkOut, guests, totalPrice } = req.body;

    const newBooking = new Booking({

      name,
      email,
      phone,
      listingtitle,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    newBooking.save().then(() => {
      console.log("Booking created successfully");
      req.flash("success", "Booking Created successfully");
      res.redirect("/profile/bookings");
    }).catch((err) => {
      console.log(err);
      req.flash("error", "Something went wrong");
      res.send("Something went wrong");
    })
  }
  catch (err) {
    res.send("something went wrong")
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
    res.send("something went wrong")
  }
})

module.exports = router;