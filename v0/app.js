var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"), //npm install body-parser --save
    mongoose = require("mongoose"),
    Campground = require("./models/campground"), // Grab the module.exports file campground.js 
    seedDB = require("./seeds"); // import in seedDB function()  from the ./ same folde seeds.js 
  
mongoose.connect("mongodb://localhost/yelp_camp");    

app.use(bodyParser.urlencoded({extended: true})); // inform node to use bodyParser 
app.set("view engine","ejs"); // enable us to remove the .ejs extention during redering programming

//SCHEMA SETUP e.g the blueprint of our data structure.

seedDB();


// SERVER PORT:
app.listen(process.env.PORT,process.env.IP,function(){
    console.log(process.env.PORT + " :" + process.env.IP);
});
//----------------------- Above is all Setup-----------------



app.get("/campgrounds",function(req,res){
    
    Campground.find({},function(err,allCampgrounds){
        if (err){
            console.log(err); //res.render("campgrounds",{campgroundsEjs:myCampgroundsArray}); // Note .ejs not requires for campgrounds 
                              // Response.render sends the array with the name campgroundsEjs to the campgrounds.ejs file
        } else{
            res.render("index",{campgroundsEjs:allCampgrounds}); 
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
    res.render("new");
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
            res.render("show",{campground :foundCampground});
            console.log("/campgrounds/ID:------ " + req.params.id);
            console.log(foundCampground);
        }
    });
    
});


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