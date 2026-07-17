const Booking = require("../../models/booking");
const Listing = require("../../models/listing");
const realtime = require("../../utils/realtime");
const { ok, created, badRequest, notFound, forbidden, paginate, asyncHandler } = require("../../utils/apiResponse");

exports.list = asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};

    if (req.user && req.user.email !== "milspatel21@gmail.com") {
        filter.email = req.user.email;
    } else if (req.query.email) {
        filter.email = req.query.email;
    }
    if (req.query.listingId) {
        const listing = await Listing.findById(req.query.listingId).lean();
        if (listing) filter.listingtitle = listing.title;
    }

    const [items, total] = await Promise.all([
        Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Booking.countDocuments(filter),
    ]);
    return ok(res, items, {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
    });
});

exports.retrieve = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) return notFound(res, "Booking not found");
    if (req.user && req.user.email !== booking.email && req.user.email !== "milspatel21@gmail.com") {
        return forbidden(res);
    }
    return ok(res, booking);
});

exports.create = asyncHandler(async (req, res) => {
    const { listingId, checkIn, checkOut, guests, phone, name, email, totalPrice, paymentId } = req.body || {};

    if (!listingId || !checkIn || !checkOut) {
        return badRequest(res, "listingId, checkIn, checkOut are required");
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return notFound(res, "Listing not found");

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (isNaN(inDate) || isNaN(outDate) || inDate >= outDate) {
        return badRequest(res, "checkOut must be after checkIn");
    }

    const overlaps = await Booking.find({ listingtitle: listing.title }).lean();
    const conflict = overlaps.some((b) => {
        const bIn = new Date(b.checkIn);
        const bOut = new Date(b.checkOut);
        return bIn < outDate && inDate < bOut;
    });
    if (conflict) {
        return res.status(409).json({
            success: false,
            error: { code: "DATES_UNAVAILABLE", message: "Selected dates conflict with an existing booking" },
        });
    }

    const booking = new Booking({
        name: name || (req.user && req.user.name),
        email: email || (req.user && req.user.email),
        phone,
        listingtitle: listing.title,
        checkIn,
        checkOut,
        guests: String(guests || 1),
        totalPrice: Number(totalPrice) || Number(listing.price),
        paymentId,
    });
    await booking.save();

    realtime.emitListingBooked(String(listing._id), {
        listingId: String(listing._id),
        listingTitle: listing.title,
        checkIn,
        checkOut,
        bookedAt: booking.createdAt,
    });

    return created(res, booking);
});

exports.destroy = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return notFound(res, "Booking not found");
    if (req.user && req.user.email !== booking.email && req.user.email !== "milspatel21@gmail.com") {
        return forbidden(res);
    }

    const listing = await Listing.findOne({ title: booking.listingtitle }).lean();
    await Booking.findByIdAndDelete(req.params.id);

    if (listing) {
        realtime.emitBookingCancelled(String(listing._id), {
            listingId: String(listing._id),
            listingTitle: booking.listingtitle,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
        });
    }
    return ok(res, { deleted: true, id: req.params.id });
});
