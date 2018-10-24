var express = require("express");
var router = express.Router({mergeParams:true}); //mergeParams: true allows us to pass in the object settings to allow _ID or .id req.params.id to be passed in for express.Router()
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//=======================
// COMMENT ROUTES
//=======================

//NEW 

router.get("/new",isLoggedIn,function(req,res){ // https://udemy-swissnez.c9users.io/campgrounds/5b8b99f4df3c361a91c94654/comments/new
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
router.post("/",isLoggedIn,function(req,res){ //form action="/campgrounds/<%= campground._id%>/comments" method="POST"
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
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;