const Listing = require("../../models/listing");
const Booking = require("../../models/booking");
const realtime = require("../../utils/realtime");
const { ok, created, badRequest, notFound, forbidden, paginate, asyncHandler } = require("../../utils/apiResponse");

function isOwner(listing, user) {
    if (!user) return false;
    if (listing.useremail && user.email && listing.useremail === user.email) return true;
    return user.email === "milspatel21@gmail.com";
}

exports.list = asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const { q, location, country, minPrice, maxPrice, sort } = req.query;

    const filter = {};
    if (q) {
        const regex = new RegExp(String(q).trim(), "i");
        filter.$or = [{ title: regex }, { description: regex }, { location: regex }, { country: regex }];
    }
    if (location) filter.location = new RegExp(String(location).trim(), "i");
    if (country) filter.country = new RegExp(String(country).trim(), "i");
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        price_asc: { price: 1 },
        price_desc: { price: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const [items, total] = await Promise.all([
        Listing.find(filter).sort(sortBy).skip(skip).limit(limit).lean(),
        Listing.countDocuments(filter),
    ]);

    return ok(res, items, {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
    });
});

exports.retrieve = asyncHandler(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .lean();
    if (!listing) return notFound(res, "Listing not found");
    return ok(res, listing);
});

exports.create = asyncHandler(async (req, res) => {
    const { title, description, price, location, country, image } = req.body || {};
    if (!title || !price || !location || !country) {
        return badRequest(res, "title, price, location, country are required");
    }
    const listing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image: Array.isArray(image) ? image : [],
        useremail: req.user && req.user.email,
    });
    await listing.save();
    realtime.emitListingCreated({ id: String(listing._id), title: listing.title, location: listing.location });
    return created(res, listing);
});

exports.update = asyncHandler(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return notFound(res, "Listing not found");
    if (!isOwner(listing, req.user)) return forbidden(res);

    const fields = ["title", "description", "price", "location", "country"];
    for (const key of fields) {
        if (req.body[key] !== undefined) listing[key] = req.body[key];
    }
    if (Array.isArray(req.body.image)) listing.image = req.body.image;
    await listing.save();
    return ok(res, listing);
});

exports.destroy = asyncHandler(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return notFound(res, "Listing not found");
    if (!isOwner(listing, req.user)) return forbidden(res);

    await Listing.findByIdAndDelete(req.params.id);
    return ok(res, { deleted: true, id: req.params.id });
});

exports.availability = asyncHandler(async (req, res) => {
    const listing = await Listing.findById(req.params.id).lean();
    if (!listing) return notFound(res, "Listing not found");

    const { from, to } = req.query;
    const bookings = await Booking.find({
        listingtitle: listing.title,
        status: { $ne: "cancelled" },
    }).lean();

    const ranges = bookings.map((b) => ({
        checkIn: b.checkIn,
        checkOut: b.checkOut,
    }));

    let available = true;
    if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (isNaN(fromDate) || isNaN(toDate) || fromDate >= toDate) {
            return badRequest(res, "Invalid date range. Provide from < to as ISO dates.");
        }
        available = !ranges.some((r) => {
            const rIn = new Date(r.checkIn);
            const rOut = new Date(r.checkOut);
            return rIn < toDate && fromDate < rOut;
        });
    }

    return ok(res, {
        listingId: String(listing._id),
        title: listing.title,
        available,
        bookedRanges: ranges,
    });
});
