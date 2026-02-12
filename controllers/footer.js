module.exports.helpcenter = function (req, res, next) {
    try {

        res.render('footer/help-center');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/help-center");
    }
}

module.exports.safety = function (req, res, next) {
    try {
        res.render('footer/safety');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/safety");
    }
}

module.exports.cancellation = function (req, res, next) {
    try {
        res.render('footer/cancellation');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/cancellation");
    }
}

module.exports.report = function (req, res, next) {
    try {
        res.render('footer/report');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/report");
    }
}

module.exports.hosting = function (req, res, next) {
    try {
        res.render('footer/hosting');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/hosting");
    }
}

module.exports.hostprotection = function (req, res, next) {
    try {
        res.render('footer/host-protection');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/host-protection");
    }
}

module.exports.hostresource = function (req, res, next) {
    try {
        res.render('footer/host-resource');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/host-resource");
    }
}

module.exports.community = function (req, res, next) {
    try {
        res.render('footer/community');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/community");
    }
}

module.exports.carrer = function (req, res, next) {
    try {
        res.render('footer/carrer');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/carrer");
    }
}

module.exports.newsroom = function (req, res, next) {
    try {
        res.render('footer/newsroom');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/newsroom");
    }
}

module.exports.investors = function (req, res, next) {
    try {
        res.render('footer/investors');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/investors");
    }
}

module.exports.privacy = function (req, res, next) {
    try {
        res.render('footer/privacy');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/privacy");
    }
}

module.exports.terms = function (req, res, next) {
    try {
        res.render('footer/terms');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/terms");
    }
}

module.exports.sitemap = function (req, res, next) {
    try {
        res.render('footer/sitemap');
    }
    catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/footer/sitemap");
    }
}