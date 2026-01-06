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


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: "Pvr@172#305",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 86400
    }
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});


app.engine(".ejs", ejsMate);
async function main() {
    await mongoose.connect("mongodb+srv://krishradadiya19_db_user:mils%402109@cluster0.xbvmrom.mongodb.net/");
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

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
