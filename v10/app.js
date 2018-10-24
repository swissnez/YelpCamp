var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"), //npm install body-parser --save
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),// Grab the module.exports file campground.js 
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"); //Import the seeds.js file 

var commentsRoutes = require("./routes/comments"), // Importing these files via require.
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
  
mongoose.connect("mongodb://localhost/yelp_camp"); // If the DB doesn't exist Mongo will create it!   

app.use(bodyParser.urlencoded({extended: true})); // inform node to use bodyParser 
app.set("view engine","ejs"); // enable us to remove the .ejs extention during redering programming i.e res.render()
app.use(express.static(__dirname + "/public")); //__dirname system variable that obtains the current directory e.g PWD /home/ubuntu/workspace/YelpCamp/v5/v5
app.use(methodOverride("_method"));
//SCHEMA SETUP e.g the blueprint of our data structure.

//seedDB(); //Stopped creating objects for the database for now



//===== PASSPORT configuration======
app.use(require("express-session")({
    secret: "Some random Secret!!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// USED ON EVERY ROUTE e.g currentUser is shared on all routes.
app.use(function(req,res,next){
   res.locals.currentUser = req.user; // currentUser variable can be passing into ejs file templates e.g currentUser._id  
   next();
});

// REFACTORING our code through-out the files
app.use("/campgrounds/:id/comments",commentsRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",indexRoutes);

//======================================
 

// SERVER PORT:
app.listen(process.env.PORT,process.env.IP,function(){
    console.log(process.env.PORT + " :" + process.env.IP);
});
//----------------------- Above is all Setup-----------------


