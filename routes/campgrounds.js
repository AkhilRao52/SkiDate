var express = require("express");
var router  = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");
var NodeGeocoder    = require('node-geocoder');
var options         = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GOOGLE_MAPS_AIzaSyBcfhRaKlG2LEKqcUQbKha7NiMq73UcgBE
};
var geocoder        = NodeGeocoder(options);

//Index route : shows all campgrounds

router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

//create route: Adds new campground to DB

router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var imageUrl = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || data.status === 'ZERO_RESULTS') {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
    }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampgrounds = {name: name,price:price, image: imageUrl, description: desc, author:author,location:location, lat: lat, lng:lng};
 
    // create a new campground and save to DB
    
    Campground.create(newCampgrounds, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }        
    });
   
    });
});
    
// New route: Show form to create new campground    
    
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
    
});


// Show route: Shows more info about a single campground
router.get("/:id", function(req,res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        }else {
            // render show template with that campground
             res.render("campgrounds/show",{campground:foundCampground});
        }
    });
    
});

// Edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});

// Update campground route
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});
// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }        
    });
});

module.exports = router;