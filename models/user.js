const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: { type: String, 
    required: true,
      trim: true, 
    match: [/^[A-Za-z\s]+$/, "Name can contain only letters"]
  },
  email: { type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true ,
  validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address"
      }
    },


  password: { type: String,
    required: true,
    trim: true,
  }
});


module.exports = mongoose.model("User", userSchema);
