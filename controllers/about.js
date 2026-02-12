module.exports.index = function (req, res, next) {
    try {
        res.render('about');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/about");
    }
}