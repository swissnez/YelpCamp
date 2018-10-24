var express = require("express"),
        app = express(),
 bodyParser = require("body-parser"),
   mongoose = require("mongoose");
   
mongoose.connect("mongodb://localhost/yelp_camp"); 
   
app.set("view engine", "ejs"); // Lazy no need to add ejs extenstions when using res.render
app.use(bodyParser.urlencoded({extended:true})); //Allows us to obtain 'data' from the body i.e. from the form. 

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("YelpCamp Server: " +process.env.PORT + ":"+process.env.IP); 
});

//Setup for A table if you like called a schema.

//SCHEMA SETUP
var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String
});
//MODEL
var Campground = mongoose.model("Campground",campgroundsSchema);


// Create a campground with the following object{} then use the callback function() that returns either an error or a campground.
// Campground.create({
 
//         name: "Heavens Cave", 
//         image: "http://chile.travel/wp-content/uploads/2016/04/Camping-INACH-ACT253.jpg"
    
// }, function(err,campground){
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(" CAMPGROUND ADDED: " +campground);
//         }
//     });



// // Mini database e.g an array :) just to get going rather than a mongoose DB
//     var campgrounds = [
    
//         {name: "Willow Creek", image: "http://www.discoveringfinland.com/wp-content/uploads/2016/09/camping-finland.jpg"},
//         {name: "Heavens Cave", image: "http://chile.travel/wp-content/uploads/2016/04/Camping-INACH-ACT253.jpg"},
//         {name: "Shallow Pine", image: "https://accelerator-origin.kkomando.com/wp-content/uploads/2016/03/camping.jpg"},
//         {name: "Wolf Golf", image: "https://s3.amazonaws.com/imagescloud/images/cards/camping/camping-tente.jpg"}
//         ]


// Routes 
app.get("/", function(req,res){
    res.render("landing"); // Pull in the ejs file landing.ejs Note no need for .ejs
});

app.get("/campgrounds",function(req,res){ // GET REQUEST to route /campgrounds respond with res variable
        console.log("GET /campgrounds   "+res);
        
        Campground.find({},function(err,allcampgrounds){
            if (err){
                console.log(err);
            } else {
                res.render("campgrounds",{campgrounds:allcampgrounds}); 
                console.log(allcampgrounds);
            }
            
        });
        //res.render("campgrounds",{campgrounds:campgrounds}); //{Thisiswhatever:ThisIsTheArray} so campgrounds array is being passed to the rendered ejs file campgrounds.ejs
        // campgrounds.forEach(function(campground){
        //   console.log(campground.name);  
        // });
        
});

app.post("/campgrounds",function(req,res){ // <form action="/campgrounds" method="POST"> 
    res.send("You hit the POST request");
    
    //------ Using body-parser to grab the contents from the body form
    var CampgroundName = req.body.name; 
    var imageUrl = req.body.image; 
    
                        //Create a new OBJECT{} newCampground
    var newCampground = {name: CampgroundName, image: imageUrl}; // name: from the the array will = CampgroundName and image: will = imageUrl from req.body.image.
    
    campgrounds.push(newCampground);
    console.log("PUSH object{} newCampground-----"+newCampground);
    res.redirect("/campgrounds");
});


app.get("/campgrounds/new",function(req,res){
    console.log("GET /campgrounds/new  "+res);
    res.render("new.ejs");
});

