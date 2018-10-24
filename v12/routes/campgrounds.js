var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // we don't necessarly need to specify ../middleware/index.js as this is the default page seached in the directory.

//********** SETUP *************
//=================================


router.get("/",function(req,res){
    
    console.log("CURRENT USER: =====  " + req.user);
    
    Campground.find({},function(err,allCampgrounds){
        if (err){
            console.log(err); //res.render("campgrounds",{campgroundsEjs:myCampgroundsArray}); // Note .ejs not requires for campgrounds 
                              // Response.render sends the array with the name campgroundsEjs to the campgrounds.ejs file
        } else{
            res.render("campgrounds/index",{campgroundsEjs:allCampgrounds}); // , we can passing in currentUser:req.user inside {here} too
            console.log("==== ALL CAMPGROUNDS ======");
            console.log(allCampgrounds);
        }
    });
    
});
//CREATE add newCampground into the DB
router.post("/",middleware.isLoggedIn,function(req,res){ // from New.ejs Once a user POSTS via method="POST" <form> to the url action="/campgrounds"  
    
   //!-----BODY PARSER SECTION------!
    var name = req.body.name;  // Request variables from the inputs of the HTML <body><form><input>  using bodyParser 
    var image = req.body.image;
    var price = req.body.price;
    var descriptions = req.body.descriptions;
    
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name:name, price: price, image:image, descriptions:descriptions, author:author}; // New object newCampground{} with body parsers help  
    
    console.log("/Campground req.user.username:  "+req.user.username);
    console.log("/Campground req.user:  "+req.user);

    Campground.create(newCampground,function(err,newlyCampground){
        if (err){
            console.log(err);
        } else {
            console.log("THE ADDED CAMPGROUND:  "+newlyCampground);
            res.redirect("/campgrounds"); //Default redirect as a GET request, so GET! the campgrounds route
        }
    });
    //myCampgroundsArray.push(newCampground); //Push() a newCampground Object{} into the Array (!NOT a DB)
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});


// SHOW a specific campground i.e the unique ID GUID in this case. 
router.get("/:id",function(req,res){
    //var id = req.params.id;
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){ // !!! NEEDS attention to understand .populate()
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/show",{campground :foundCampground});
            //console.log("/campgrounds/ID:------ " + req.params.id);
            console.log("FOUND CAMPGROUND: "+foundCampground);
        }
    });
    
});

//EDIT Campground ROUTE

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/edit",{campground:foundCampground});
            }
    });
   
});
//UPDATE Campground ROUTE
//Remember Update =	/dogs/:id @ Dog.findByIdAndUpdate()
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    
    var campgroundDataForm = req.body.campground; // req.bodycampground = campground[name] .... etc  
  
   Campground.findByIdAndUpdate(req.params.id,campgroundDataForm,function(err,updatedCampground){ 
       if (err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/"+req.params.id);
           //res.send(updatedCampground); // return JSON 
           console.log("ROUTE PUT: "+updatedCampground);
       }
   }); 
});

//DESTROY ROUTE (DELETE)

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){

    Campground.findByIdAndRemove(req.params.id,function(err,deleteCampground){
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
            console.log("DELETE/DESTROYED Campground"+ deleteCampground);
        }
    });
});




module.exports = router; // All routes get exported and then imported via require