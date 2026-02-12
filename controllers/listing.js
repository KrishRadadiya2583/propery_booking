
const Listing = require('../models/listing');
const Booking = require('../models/booking');

const razorpay = require("../config/razorpay");
const upload = require('../middlewares/multer');
const imagekit = require("../config/imagekit");

const sendSMS = require("../utils/sms");
const sendEmail = require("../utils/email");

module.exports.index = async (req, res) => {
  try {
    const listings = await Listing.find().lean();
    res.render('listings/listing', { listings, currentUser: req.session.user });
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
}


module.exports.new =(req, res) => {
  try {
    res.render("listings/new");
  }
  catch (err) {
    res.send("something went wrong")
  }
}


module.exports.show = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } });
    res.render("listings/show", { listing, currentUser: req.session.user });
  }
  catch (err) {
    res.send('somwthing went wrong')
  }
}

module.exports.create = async (req, res) => {
  try {
    const listing = req.body.listing;

    // Handle uploaded images
    listing.image = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/listings",   // <-- specific folder
        });

        listing.image.push({
          url: result.url,
          fileId: result.fileId,
        });
      }
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
}



module.exports.edit =async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  }
  catch (err) {
    res.send('somwthing went wrong')
  }
}

module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const listingData = req.body.listing;

    const listing = await Listing.findByIdAndUpdate(
      id,
      listingData,
      { new: true, runValidators: true }
    );

    if (req.files && req.files.length > 0) {
      let newImages = [];

      for (let file of req.files) {
        const result = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/listings",
        });

        newImages.push({
          url: result.url,
          fileId: result.fileId,
        });
      }

      listing.image.push(...newImages);
      await listing.save();
    }

    if (req.body.deleteImages) {
      let imagesToDelete = req.body.deleteImages;

     
      if (!Array.isArray(imagesToDelete)) {
        imagesToDelete = [imagesToDelete];
      }


     for (let fileId of imagesToDelete) {
    try {
      // check if file exists in ImageKit
      await imagekit.getFileDetails(fileId);

      // if exists → delete it
      await imagekit.deleteFile(fileId);
      console.log(`Deleted from ImageKit: ${fileId}`);

    } catch (err) {
      console.log(`File not found in ImageKit: ${fileId}`);
   
    }
  }

   
      await Listing.findByIdAndUpdate(id, {
        $pull: { image: { fileId: { $in: imagesToDelete } } },
      });
    }

    console.log("Listing updated successfully");
    req.flash("success", "Listing Updated successfully");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.error(err);
    res.send("Something went wrong");
  }
}


module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
const listing = await Listing.findById(id);

if(listing.image.length > 0){
    for(let image of listing.image){
        await imagekit.deleteFile(image.fileId);
    }
}
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
}


module.exports.bookingform =  async (req, res) => {
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
}


module.exports.createBooking = async (req, res) => {
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
}


module.exports.savebooking =  async (req, res) => {
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

    await sendSMS(`+91${booking.phone}`, booking);
     await sendEmail(booking.email, booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
}


module.exports.cancelbooking = async (req, res) => {
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
}

module.exports.showavailability = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const availability = await Booking.find({listingtitle: listing.title});
const dates = availability.map(booking => {
  return {
    checkIn: new Date(booking.checkIn),
    checkOut: new Date(booking.checkOut)
  }
})
    res.render("listings/availability", { listing, dates });
  }
  catch (err) {
    res.send("something went wrong")
  }
}