const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");


router.get("/", (req, res) => {
  res.render("auth", { error: null });
});


// POST register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("auth", {
        error: "User already exists"
      });
    }

    const hashedpassword  = await bcrypt.hash(password,10)

    const user = new User({ name:name, email:email,password: hashedpassword }); 
    await user.save();

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };
req.flash("success", "register successful");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
req.flash("error", "Registration failed. Please try again.");
    res.render("auth", {
      error: "Registration failed. Please try again."
    });
  }
});


// POST login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth", {
        error: "User not found"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("auth", {
        error: "Invalid email or password"
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };
req.flash("success", "login successful");
    res.redirect("/listings");

  } catch (err) {
    console.error("error generated");
req.flash("error", "Login failed. Please try again.");
    res.render("auth", {
      error: "Login failed. Please try again."
    });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});




module.exports = router;
