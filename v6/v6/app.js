var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"), //npm install body-parser --save
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),// Grab the module.exports file campground.js 
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"); //Import the seeds.js file 
  
mongoose.connect("mongodb://localhost/yelp_camp"); // If the DB doesn't exist Mongo will create it!   

app.use(bodyParser.urlencoded({extended: true})); // inform node to use bodyParser 
app.set("view engine","ejs"); // enable us to remove the .ejs extention during redering programming
app.use(express.static(__dirname + "/public")); //__dirname sytem variable that obtains the current directory e.g PWD /home/ubuntu/workspace/YelpCamp/v5/v5
//SCHEMA SETUP e.g the blueprint of our data structure.

seedDB();



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
//======================================


// USED ON EVERY ROUTE (DRY)
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
});


// SERVER PORT:
app.listen(process.env.PORT,process.env.IP,function(){
    console.log(process.env.PORT + " :" + process.env.IP);
});
//----------------------- Above is all Setup-----------------



app.get("/campgrounds",function(req,res){
    
    console.log("CURRENT USER: =====  " + req.user);
    
    Campground.find({},function(err,allCampgrounds){
        if (err){
            console.log(err); //res.render("campgrounds",{campgroundsEjs:myCampgroundsArray}); // Note .ejs not requires for campgrounds 
                              // Response.render sends the array with the name campgroundsEjs to the campgrounds.ejs file
        } else{
            res.render("campgrounds/index",{campgroundsEjs:allCampgrounds}); // , we can passing in currentUser:req.user inside {here} too
            console.log(allCampgrounds);
        }
    });
    
});

app.post("/campgrounds",function(req,res){ // from New.ejs Once a user POSTS via method="POST" <form> to the url action="/campgrounds"  
    
   //!-----BODY PARSER SECTION------!
    var name = req.body.name;  // Request variables from the inputs of the HTML <body><form><input>  using bodyParser 
    var image = req.body.image;
    var desc = req.body.descriptions;
    
    var newCampground = {name:name, image:image, descriptions:desc}; // New object newCampground{} with body parsers help  
    

    Campground.create(newCampground,function(err,newCampground){
        if (err){
            console.log(err);
        } else {
            console.log(newCampground);
            res.redirect("/campgrounds"); //Default redirect as a GET request, so GET! the campgrounds route
        }
    })
    //myCampgroundsArray.push(newCampground); //Push() a newCampground Object{} into the Array (!NOT a DB)
});

//NEW ROUTE
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});

//INDEX ROUTE / 
app.get("/",function(req,res){
    //res.send("This will be the landing page soon");
    res.render("landing"); // landing.ejs file to render 
})

// SHOW a specific campground i.e the unique ID GUID in this case. 
app.get("/campgrounds/:id",function(req,res){
    //var id = req.params.id;
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){ // !!! NEEDS attention to understand .populate()
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/show",{campground :foundCampground});
            //console.log("/campgrounds/ID:------ " + req.params.id);
            console.log(foundCampground);
        }
    });
    
});



//=======================
// COMMENT ROUTES
//=======================

//NEW 

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){ // https://udemy-swissnez.c9users.io/campgrounds/5b8b99f4df3c361a91c94654/comments/new
    Campground.findById(req.params.id,function(err,campground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new",{campground:campground});
                //res.send("This will be the comment form!");
        }
    });
});

//POST 
app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){ //form action="/campgrounds/<%= campground._id%>/comments" method="POST"
    //Looking up campground by ID
    
    Campground.findById(req.params.id,function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
             Comment.create(req.body.comment,function(err,comment){ //req from the body the comment[] array which has name and author fields e.g name="comment[name] 
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    console.log(req.body.comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
             });
             
        }
    });
  
});

//===== AUTH ROUTES=======


app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    var password = req.body.password;
    console.log(newUser);
    User.register(newUser,password,function(err,user){
       if (err) {
           console.log(err);
           return res.redirect("register");
       } 
       passport.authenticate("local")(req,res,function(){
          res.redirect("campgrounds"); 
       });
    });
});

// SHOW LOGIN FORM

app.get("/login",function(req,res){
    res.render("login");
});

// Handling login logic

app.post("/login",passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){

    
});

app.get("/logout",function(req,res){
   req.logout(); 
   res.redirect("/campgrounds");
});

// OUR MIDDLEWARE
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


// Campground.create(
//     {
//             name: "Iceland", 
//             image: "http://3.bp.blogspot.com/-EZslw2DfT5E/VFEMGzI_XYI/AAAAAAAAFuk/U-S7ouns-1A/s1600/Camping-In-Iceland-National-Park-Hd-Wallpaper-.jpg",
//             descriptions: "Wow awesome heights, and an epic view!"
        
//     }, function(err,campground){
        
//             if (err) {
//                 console.log(err);
//                     } 
//             else {
//                 console.log(campground);    
//                 }
//     });


//   var myCampgroundsArray = [
    
//         {name: "Willow Creek", image: "http://www.discoveringfinland.com/wp-content/uploads/2016/09/camping-finland.jpg"},
//         {name: "Heavens Cave", image: "http://chile.travel/wp-content/uploads/2016/04/Camping-INACH-ACT253.jpg"},
//         {name: "Shallow Pine", image: "https://accelerator-origin.kkomando.com/wp-content/uploads/2016/03/camping.jpg"},
//         {name: "Wolf Golf", image: "https://s3.amazonaws.com/imagescloud/images/cards/camping/camping-tente.jpg"}
        
//         ]