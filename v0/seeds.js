var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var dataArray = [
    
        { 
            name : "Heavens",
            image: "https://www.quebecoriginal.com/en/listing/images/800x600/ae2894cf-af0a-46dc-904d-8a91b0059376/camping-parc-national-du-mont-tremblant-de-la-diable-camping-secteur-la-diable.jpg",
            descriptions: "Woof"
            
        },
        { 
            name : "Gully Cove",
            image: "http://olandroots.blob.core.windows.net/media/1018/camping_5_o-land_roots_2017.jpg",
            descriptions: "Woof"
            
        },
        { 
            name : "Savy Creek",
            image: "https://www.tripsavvy.com/thmb/va28JFdWtoHqNijy3xjoswU7vrE=/350x0/filters:no_upscale():max_bytes(150000):strip_icc()/camping-and-tent-under-the-pine-forest-in-sunset-at-pang-ung--pine-forest-park---mae-hong-son--north-of-thailand-638237742-5ab25b2cfa6bcc00365e2824.jpg",
            descriptions: "Woof"
            
        }
]



function seedDB() {
    Campground.remove({},function(err,removedCamp){
        if (err) {
                   console.log(err);
               } else {
                   console.log(removedCamp);
                        dataArray.forEach(function(seed){
                                Campground.create(seed,function(err,campground){
                               if (err) {
                                   console.log(err);
                               } else {
                                   console.log("Added a campground     " + campground);
                                   Comment.create({
                                       text: "This is great!!!",
                                       author: "Mimmi Comment"
                                   },function(err,comment){
                                       if (err) {
                                           console.log(err);
                                       } else {
                                       campground.comments.push(comment);
                                       //console.log(campground.comments);
                                       campground.save();
                                       console.log("Created Comment  " + comment);
                                       }
                                   });
                               }
                        }); 
                    });
        }
    });  
}


module.exports = seedDB;
