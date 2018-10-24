var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    descriptions: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        
    ]
});

// MODEL
//var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = mongoose.model("Campground",campgroundSchema);