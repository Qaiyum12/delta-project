if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); 


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store : store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,      // here, we set the expiry date for cookies up next 7-days from the login day.
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


// app.get("/", (req, res) => {
//     res.send("Hi, I am root.");
// });



app.use(session(sessionOptions));
app.use(flash());                    // here, we must use the before our routes in the code. Because we use the flash through the routes.


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   // here, "authenticate()" Generates a function that is used in Passport's LocalStrategy


passport.serializeUser(User.serializeUser());           // This, "serializeUser()"" Generates a function that is used by Passport to serialize users into the session.
passport.deserializeUser(User.deserializeUser());       // this, "deserializeUser()" Generates a function that is used by Passport to deserialize users into the session


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});


// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registerdUser = await User.register(fakeUser, "helloworld");      //here, "register(user, password, cb)" Convenience method to register a new user instance with a given password. Checks if username is unique. 
//     res.send(registerdUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "something went wrong!" } = err;
    res.status(statuscode).render("error.ejs", { message });
    // res.status(statuscode).send(message);
    // res.send("something went wrong!");
});

app.listen(8080, () => {
    console.log("app listening from port 8080");
});