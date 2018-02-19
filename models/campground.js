var mongoose = require("mongoose");

//Schema Setup

var CampgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   createdAt: {type: Date, default: Date.now },
   location: String,
   lat: Number,
   lng: Number,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments : [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", CampgroundSchema);
 