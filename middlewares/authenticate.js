const Listing = require("../models/listing");
module.exports.isuser = async (req, res, next) => {
    try {

        const listing = await Listing.findById(req.params.id);
        if (req.session.user.email != listing.useremail && req.session.user.email != "milspatel21@gmail.com") {
            req.flash("error", "You are not authorized to edit this listing");
            return res.redirect("/listings");
        }
        next();
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.send("something went wrong")
    }
};