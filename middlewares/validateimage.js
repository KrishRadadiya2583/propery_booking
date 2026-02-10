module.exports.validateImages = (req, res, next) => {
  try {
     
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    for (let file of req.files) {
      if (!allowedTypes.includes(file.mimetype)) {
        req.flash("error", "Only JPG, PNG, or WEBP images are allowed.");
  return res.redirect(req.get("Referer"));

    }

      // optional: size check (e.g. 2MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        req.flash("error", "Image size must be less than 10MB.");
  return res.redirect(req.get("Referer"));
    }
    }

    next();
  } catch (err) {
    console.error(err);

  }
};
