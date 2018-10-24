var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
//INDEX ROUTE / 
router.get("/",function(req,res){
    //res.send("This will be the landing page soon");
 
    res.render("landing"); // landing.ejs file to render 
})


//===== AUTH ROUTES=======


router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    var password = req.body.password;
    console.log(newUser);
    User.register(newUser,password,function(err,user){
       if (err) {
           req.flash("error",err.message);
           console.log(err);
           return res.redirect("register");
       } 
       passport.authenticate("local")(req,res,function(){
           req.flash("success", "Welcome to YelpCamp " + user.username); // Or req.body.username
          res.redirect("campgrounds"); 
       });
    });
});

// SHOW LOGIN FORM

router.get("/login",function(req,res){
    res.render("login");
});

// Handling login logic

router.post("/login",passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){

    
});

router.get("/logout",function(req,res){
   req.logout(); 
   req.flash("success","Logged you out!");
   res.redirect("/campgrounds");
});

// ******* OUR MIDDLEWARE *********** No longer required because it exists in a middleware file
// function isLoggedIn(req,res,next) {
//     if(req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;