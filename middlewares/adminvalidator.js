const Admin = require("../models/admin");
const bcrypt = require("bcrypt");

module.exports.isAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({email});
    if(!admin){
        return res.send("Admin not found");
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if(!isPasswordValid){
        return res.send("Invalid password");
    }
    next();
}