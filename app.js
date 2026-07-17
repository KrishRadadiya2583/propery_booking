const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}



const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const listingsRouter = require("./routes/listings");
const authRouter = require("./routes/auth");
const aboutRouter = require("./routes/about");
const contactRouter = require("./routes/contact");
const profileRouter = require("./routes/profile");
const footerRouter = require("./routes/footer");
const reviewsRouter = require("./routes/reviews");
const adminRouter = require("./routes/admin/admin");
const apiRouter = require("./routes/api");
const realtime = require("./utils/realtime");
const flash = require("connect-flash");
const ratelimit = require("./middlewares/ratelimit");
const morgan = require("morgan");




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 86400),
        maxAge: 1000 * 86400,
    }
}));

app.use(flash());
app.use(morgan("dev"));
app.use(ratelimit);

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

app.use("/api/v1", apiRouter);

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", authRouter);
app.use("/about", aboutRouter);
app.use("/contact", contactRouter)
app.use("/profile", profileRouter);
app.use("/footer", footerRouter);
app.use("/admin", adminRouter);

realtime.init(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT} (realtime + REST enabled)`);
});
