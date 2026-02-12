module.exports.isAdminLoggedIn = (req, res, next) => {
  if (!req.session || !req.session.admin) {

    req.flash("error", "You are not logged in");
    return res.redirect("/admin");
  }
  next();
};