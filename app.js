if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing").default;
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const listingsRouter = require("./routes/listings");
const authRouter = require("./routes/auth");
const aboutRouter = require("./routes/about");
const contactRouter = require("./routes/contact");
const profileRouter = require("./routes/profile");
const footerRouter = require("./routes/footer");
const flash = require("connect-flash");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 86400
    }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});


app.engine(".ejs", ejsMate);
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
})

app.use("/listings", listingsRouter);

app.use("/", authRouter);
app.use("/about", aboutRouter);
app.use("/contact", contactRouter)
app.use("/profile", profileRouter);
app.use("/footer", footerRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
