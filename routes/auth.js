const express = require("express");
const router = express.Router();
const passwordvalidator = require("../middlewares/passwordvalidator");
const { landing, index, register, login, logout } = require("../controllers/auth");


// Public landing page
router.get("/", landing);

// Auth page (sign in / create account)
router.get("/login", index);
router.get("/signin", index);
router.get("/register", index);


// POST register
router.post("/register", passwordvalidator, register);


// POST login
router.post("/login", login);


router.post("/logout", logout);

module.exports = router;
