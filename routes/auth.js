const express = require("express");
const router = express.Router();
const passwordvalidator = require("../middlewares/passwordvalidator");
const {index,register,login} = require("../controllers/auth");


router.get("/", index);


// POST register
router.post("/register", passwordvalidator,register);


// POST login
router.post("/login",login);




module.exports = router;
