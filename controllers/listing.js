
const crypto = require("crypto");
const Listing = require('../models/listing');
const Booking = require('../models/booking');

const razorpay = require("../config/razorpay");
const upload = require('../middlewares/multer');
const imagekit = require("../config/imagekit");

const sendSMS = require("../utils/sms");
const sendEmail = require("../utils/email");
const realtime = require("../utils/realtime");
const notify = require("../utils/notify");
const { computeBookingPrice } = require("../utils/pricing");

// Overlap check: are any non-cancelled bookings for this listing colliding with [from, to)?
async function hasConflict(listing, from, to) {
    const bookings = await Booking.find({
        listingtitle: listing.title,
        status: { $ne: "cancelled" },
    }).lean();
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return bookings.some(b => {
        const bIn = new Date(b.checkIn);
        const bOut = new Date(b.checkOut);
        return bIn < toDate && fromDate < bOut;
    });
}

module.exports.index = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, sort, category } = req.query || {};
    const filter = {};
    if (q) {
      const regex = new RegExp(String(q).trim(), "i");
      filter.$or = [{ title: regex }, { description: regex }, { location: regex }, { country: regex }];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (category && category !== "all") {
      filter.category = category;
    }
    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const listings = await Listing.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .populate("reviews", "rating")
      .lean({ virtuals: true });
    res.render('listings/listing', { listings, currentUser: req.session.user, query: req.query || {} });
  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
}


module.exports.new = (req, res) => {
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

    // amenities can arrive as a single string, an array, or absent
    if (listing.amenities && !Array.isArray(listing.amenities)) {
      listing.amenities = [listing.amenities];
    }
    ["maxGuests", "bedrooms", "beds", "bathrooms"].forEach((k) => {
      if (listing[k] !== undefined && listing[k] !== "") listing[k] = Number(listing[k]);
    });

    listing.useremail = req.session.user ? req.session.user.email : listing.useremail;
    listing.hostName = req.session.user ? req.session.user.name : listing.hostName;

    listing.image = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/listings",
        });

        listing.image.push({
          url: result.url,
          fileId: result.fileId,
        });
      }
    }

    const newListing = new Listing(listing);
    await newListing.save();

    realtime.emitListingCreated({
      id: String(newListing._id),
      title: newListing.title,
      location: newListing.location,
      category: newListing.category,
    });

    console.log("Listing created successfully");
    req.flash("success", "Listing Added successfully");
    res.redirect("/listings");

  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
}



module.exports.edit = async (req, res) => {
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

    if (listingData.amenities && !Array.isArray(listingData.amenities)) {
      listingData.amenities = [listingData.amenities];
    }
    ["maxGuests", "bedrooms", "beds", "bathrooms"].forEach((k) => {
      if (listingData[k] !== undefined && listingData[k] !== "") listingData[k] = Number(listingData[k]);
    });

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
          await imagekit.getFileDetails(fileId);
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

    realtime.emitListingUpdated(String(id), {
      id: String(id),
      title: listing.title,
      price: listing.price,
    });

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

    if (listing.image.length > 0) {
      for (let image of listing.image) {
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


module.exports.bookingform = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/booking", { listing, currentUser: req.session.user });
  }
  catch (err) {
    console.log(err);
    res.redirect("/listings");
  }
}


module.exports.createBooking = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, error: "Payment gateway not configured" });
    }

    const listingId = req.body.listingId || req.params.id;
    const listing = await Listing.findById(listingId).lean();
    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    // Server-side price calculation — never trust the client.
    const priced = computeBookingPrice({
      pricePerNight: listing.price,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      guests: req.body.guests,
    });
    if (priced.nights <= 0 || priced.totalPrice <= 0) {
      return res.status(400).json({ success: false, error: "Invalid dates or price" });
    }

    // Re-check availability at order time to avoid double-booking race.
    if (await hasConflict(listing, req.body.checkIn, req.body.checkOut)) {
      return res.status(409).json({ success: false, error: "Those dates were just booked. Please pick different dates." });
    }

    const order = await razorpay.orders.create({
      amount: priced.totalPrice * 100,   // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      notes: {
        listingId: String(listing._id),
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        guests: String(priced.guests),
      },
    });

    return res.json({
      success: true,
      order,
      priced,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("[createBooking]", err);
    return res.status(500).json({ success: false, error: err.message || "Payment gateway error" });
  }
}


module.exports.savebooking = async (req, res) => {
  try {
    const {
      listingId,
      checkIn,
      checkOut,
      guests,
      name, email, phone,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(400).json({ success: false, error: "Listing not found" });

    // 1) Verify Razorpay signature — the ONLY proof the payment is real.
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Missing payment verification data" });
    }
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Payment verification failed" });
    }

    // 2) Guard against replay — the same order can only be redeemed once.
    const alreadyUsed = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
    if (alreadyUsed) {
      return res.json({ success: true, bookingId: String(alreadyUsed._id), replay: true });
    }

    // 3) Recompute price server-side and use THAT — client value is only a display hint.
    const priced = computeBookingPrice({
      pricePerNight: listing.price,
      checkIn,
      checkOut,
      guests,
    });
    if (priced.totalPrice <= 0) {
      return res.status(400).json({ success: false, error: "Invalid booking amount" });
    }

    // 4) Final availability check (in case someone slipped in between order and confirm).
    if (await hasConflict(listing, checkIn, checkOut)) {
      return res.status(409).json({ success: false, error: "Those dates were booked just now. Please pick different dates." });
    }

    const booking = new Booking({
      name, email, phone,
      listing: listing._id,
      listingtitle: listing.title,
      listingImage: listing.image && listing.image[0] && listing.image[0].url,
      listingLocation: `${listing.location || ""}${listing.country ? ", " + listing.country : ""}`,
      hostEmail: listing.useremail,
      checkIn,
      checkOut,
      guests: String(priced.guests),
      nights: priced.nights,
      subtotal: priced.subtotal,
      serviceFee: priced.serviceFee,
      totalPrice: priced.totalPrice,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      status: "confirmed",
    });

    await booking.save();

    realtime.emitListingBooked(String(listing._id), {
      listingId: String(listing._id),
      listingTitle: listing.title,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      bookedAt: booking.createdAt,
    });

    await notify.push({
      userEmail: booking.email,
      type: "booking_created",
      title: "Booking confirmed 🌿",
      message: `${listing.title} · ${booking.checkIn} → ${booking.checkOut}`,
      link: "/profile/bookings",
      icon: "bi-calendar-check",
    });
    if (listing.useremail && listing.useremail !== booking.email) {
      await notify.push({
        userEmail: listing.useremail,
        type: "booking_created",
        title: "New booking on your listing",
        message: `${booking.name} booked ${listing.title}`,
        link: "/profile/listings",
        icon: "bi-house-check",
      });
    }

    res.json({ success: true, bookingId: String(booking._id) });

    // Best-effort — user gets a valid confirmation page even if SMS/email fails.
    Promise.resolve()
      .then(() => sendSMS(`+91${booking.phone}`, booking))
      .catch((e) => console.warn("[sms] failed:", e.message));
    Promise.resolve()
      .then(() => sendEmail(booking.email, booking))
      .catch((e) => console.warn("[email] failed:", e.message));
  } catch (err) {
    console.error("[savebooking]", err);
    if (!res.headersSent) res.status(500).json({ success: false, error: err.message || "Failed to save booking" });
  }
}


module.exports.cancelbooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/profile/bookings");
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancelReason = req.body && req.body.reason ? req.body.reason : "user_cancelled";
    await booking.save();

    if (booking.listing) {
      realtime.emitBookingCancelled(String(booking.listing), {
        listingId: String(booking.listing),
        listingTitle: booking.listingtitle,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      });
    }

    await notify.push({
      userEmail: booking.email,
      type: "booking_cancelled",
      title: "Booking cancelled",
      message: `${booking.listingtitle} · ${booking.checkIn} → ${booking.checkOut}`,
      link: "/profile/bookings",
      icon: "bi-x-circle",
    });
    if (booking.hostEmail && booking.hostEmail !== booking.email) {
      await notify.push({
        userEmail: booking.hostEmail,
        type: "booking_cancelled",
        title: "A guest cancelled",
        message: `${booking.name} cancelled their booking of ${booking.listingtitle}`,
        link: "/profile/listings",
        icon: "bi-x-circle",
      });
    }

    req.flash("success", "Booking cancelled successfully");
    res.redirect("/profile/bookings");
  }
  catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/profile/bookings");
  }
}

module.exports.showavailability = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const availability = await Booking.find({
      listingtitle: listing.title,
      status: { $ne: "cancelled" },
    });
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

module.exports.bookingConfirmation = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("listing").lean();
    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/profile/bookings");
    }
    if (req.session.user && booking.email !== req.session.user.email) {
      req.flash("error", "You cannot view this booking");
      return res.redirect("/profile/bookings");
    }
    res.render("listings/confirmation", { booking, currentUser: req.session.user });
  } catch (err) {
    console.log(err);
    res.redirect("/profile/bookings");
  }
}
