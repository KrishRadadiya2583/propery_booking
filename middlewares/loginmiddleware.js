module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session || !req.session.user) {
    // Not authenticated
    return res.redirect("/");
  }

  // Authenticated
  next();
};
