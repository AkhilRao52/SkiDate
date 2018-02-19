var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

// Root route   
router.get("/",function(req,res){
    res.render("landing");
});

// ===============
//   Auth routes
// ===============

// Show register form 
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

// Handle sign up logic
router.post("/register", function(req,res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local") (req,res,function(){
           req.flash("success", "Welcome to SkiDate "+ user.username);
           res.redirect("/campgrounds"); 
       });
   });
});

// Show login form 
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

// Handle login logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){
});

// Logout route 
router.get("/logout", function(req,res){
   req.logout();
   req.flash("success", "Logged you out");
   res.redirect("/campgrounds");
});

module.exports = router;