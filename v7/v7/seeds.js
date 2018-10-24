var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    
        { 
            name : "Heavens",
            image: "https://www.quebecoriginal.com/en/listing/images/800x600/ae2894cf-af0a-46dc-904d-8a91b0059376/camping-parc-national-du-mont-tremblant-de-la-diable-camping-secteur-la-diable.jpg",
            descriptions: "Meatloaf tri-tip pork belly turkey leberkas landjaeger pig beef ribs turducken flank porchetta sausage burgdoggen. Ribeye jerky cow, t-bone rump pork loin jowl chicken turkey. Bacon meatball biltong, short ribs flank shank ham pork belly kevin ball tip. Ham chuck cow drumstick sirloin swine, bresaola leberkas beef ribs ham hock spare ribs beef corned beef. Strip steak pancetta turducken, landjaeger turkey salami rump venison. Capicola t-bone pig turducken, corned beef biltong shank shankle tri-tip."
            
        },
        { 
            name : "Gully Cove",
            image: "http://olandroots.blob.core.windows.net/media/1018/camping_5_o-land_roots_2017.jpg",
            descriptions: "Doner burgdoggen andouille chuck ham. Jerky shoulder kevin biltong beef ribs boudin, doner ball tip brisket jowl kielbasa strip steak. Capicola hamburger meatball fatback chuck, flank filet mignon pancetta. Ham bacon hamburger beef t-bone porchetta spare ribs."

            
        },
        { 
            name : "Savy Creek",
            image: "https://www.tripsavvy.com/thmb/va28JFdWtoHqNijy3xjoswU7vrE=/350x0/filters:no_upscale():max_bytes(150000):strip_icc()/camping-and-tent-under-the-pine-forest-in-sunset-at-pang-ung--pine-forest-park---mae-hong-son--north-of-thailand-638237742-5ab25b2cfa6bcc00365e2824.jpg",
            descriptions: "Turkey jowl frankfurter pastrami pig t-bone beef picanha filet mignon boudin venison short ribs andouille salami ham hock. Chuck andouille drumstick frankfurter rump prosciutto burgdoggen flank cupim cow shoulder pork chop. Shoulder andouille hamburger beef ribs salami, leberkas biltong boudin meatloaf. Brisket tenderloin jowl pancetta. Brisket pork belly prosciutto picanha hamburger kielbasa. Fatback swine buffalo, meatloaf ball tip drumstick tail doner porchetta andouille pork chop. Alcatra ham shank, ham hock venison cupim tail."
            
        }
]



function seedDB() {
    Campground.remove({},function(err,removedCamp){
        if (err) {
                   console.log(err);
               } else {
                   console.log(removedCamp);
                        data.forEach(function(seed){
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
