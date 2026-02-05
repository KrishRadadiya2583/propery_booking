module.exports.validateBooking = (req, res, next) => {
    let { name, email, phone, checkIn, checkOut, guests } = req.body;

    if (!name || name.trim() === "") {
        req.flash("error", "Name is required");
        return res.status(400).json({ success: false, message: "Name is required" });
    }

    if (!email || !email.includes("@")) {
        req.flash("error", "Valid email is required");
        return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    if (!phone || phone.trim().length < 10) {
        req.flash("error", "Valid phone number is required");
        return res.status(400).json({ success: false, message: "Valid phone number is required" });
    }

    if (!checkIn || !checkOut) {
        req.flash("error", "Check-in and Check-out dates are required");
        return res.status(400).json({ success: false, message: "Check-in and Check-out dates are required" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        req.flash("error", "Invalid date format");
        return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
        req.flash("error", "Check-in date cannot be in the past");
        return res.status(400).json({ success: false, message: "Check-in date cannot be in the past" });
    }

    if (checkOutDate <= checkInDate) {
        req.flash("error", "Check-out date must be after check-in date");
        return res.status(400).json({ success: false, message: "Check-out date must be after check-in date" });
    }

    if (!guests || guests <= 0) {
        req.flash("error", "At least one guest is required");
        return res.status(400).json({ success: false, message: "At least one guest is required" });
    }

    next();
};
