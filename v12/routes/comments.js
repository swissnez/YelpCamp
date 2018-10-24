var express = require("express");
var router = express.Router({mergeParams:true}); //mergeParams: true allows us to pass in the object settings to allow _ID or .id req.params.id to be passed in for express.Router()
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//=======================
// COMMENT ROUTES
//=======================

//NEW 

router.get("/new",middleware.isLoggedIn,function(req,res){ // https://udemy-swissnez.c9users.io/campgrounds/5b8b99f4df3c361a91c94654/comments/new
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
router.post("/",middleware.isLoggedIn,function(req,res){ //form action="/campgrounds/<%= campground._id%>/comments" method="POST"
    //Looking up campground by ID
    
    Campground.findById(req.params.id,function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
             Comment.create(req.body.comment,function(err,comment){ //req from the body the comment[] array which has name and author fields e.g name="comment[name] 
                if (err) {
                    console.log(err);
                    req.flash("error","Comment not found" + err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                  
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
             });
             
        }
    });
  
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentsOwnership,function(req,res){ // app.use("/campgrounds/:id/comments",commentsRoutes); e.g https://udemy-swissnez.c9users.io/campgrounds/5b9d3ceb60d1731943bb9b54/comments/blahblah/edit
   Comment.findById(req.params.comment_id,function(err,foundComment){
      if (err) {
          req.flash("error","Unable to edit the comment")
          res.redirect("back");
      } else {
          console.log("Returned foundComment: "+foundComment);
          res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
      }
   });
});

//COMMENT UPDATE (PUT) ROUTE

router.put("/:comment_id",middleware.checkCommentsOwnership,function(req,res){ // https://udemy-swissnez.c9users.io/campgrounds/5b9d3ceb60d1731943bb9b54/comments/5b9d3d1c60d1731943bb9b55?_method=PUT
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/"+ req.params.id);
       }
    });
});
//COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentsOwnership,function(req,res){
   //findByIdAndRemove() 
   Comment.findByIdAndRemove(req.params.comment_id,function(err){
      if (err){
          res.redirect("back");
      } else {
          req.flash("success","Comment deleted!");
          res.redirect("/campgrounds/"+req.params.id);
      }
   });
    
});




module.exports = router;