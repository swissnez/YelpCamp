// All middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");


middlewareObj.checkCampgroundOwnership = function(req,res,next) {
    
    if (req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    console.log("req.user.id "+req.user._id);
                    console.log("foundCampground:  "+foundCampground);
                    console.log("foundCampground.author.id:  "+ foundCampground.author.id);
                    //DOES the current user own the edited campground?
                    if (foundCampground.author.id.equals(req.user._id)) { // foundCampground is an object {} and req.user._id is a string so we can't use === we use the .equals () 
                        console.log("Authorized USER: " +req.user);
                        next();
                    } else {
                        req.flash("error","You need to be logged in!");
                        res.redirect("back");
                        console.log("Unauthorized User: " + req.user._id);
                    }
                    
                }
        });
    } else {
      res.redirect("back");
    }
};

middlewareObj.checkCommentsOwnership = function(req,res,next) {
    
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
                if (err) {
                    console.log(err);
                    req.flash("error","Campground not found!");
                    res.redirect("back");
                } else {
                    // console.log("req.user.id "+req.user._id);
                    // console.log("foundCampground:  "+foundComment);
                    // console.log("foundCampground.author.id:  "+ foundComment.author.id);
                    //DOES the current user own the edited campground?
                    if (foundComment.author.id.equals(req.user._id)) { // foundCampground is an object {} and req.user._id is a string so we can't use === we use the .equals () 
                        console.log("Authorized USER: " +req.user);
                        next(); // All good then move ons hence next argument 
                    } else {
                        req.flash("error","You don't have permission");
                        res.redirect("back");
                        console.log("Unauthorized User: " + req.user._id);
                    }
                }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in, please login first!");
    res.redirect("/login");
};

module.exports = middlewareObj;
