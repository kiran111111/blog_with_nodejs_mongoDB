const express = require("express");
const authRouter = express.Router();
const passport = require("passport")
const mongo = require("mongo");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Modules for  passport 
const LocalStrategy = require('passport-local').Strategy;
// Schema model setup for database
const userSchema = require("../models/users")
// Modules for express validaiton
const {userValidationRules,validate} = require("./validator")
// Module for the database model
const User = mongoose.model("Users",userSchema);



module.exports = () =>{




// GET route to the home page-----------------------------------------------
authRouter.get("/",(req,res)=>{
 res.render("layout",{title:'Members'})
})

authRouter.get("/user",checkAuthenticated,(req,res)=>{
 res.render("main");
})

//GET Route to REGISTER PAGE------------------------------------------------
authRouter.get("/register",checkNotAuthenticated,(req,res)=>{
  res.render("register",{title:'Register'});
})

//POST Route to the FORM PAGE-----------------------------------------------
authRouter.post("/register",checkNotAuthenticated, userValidationRules(),validate,async (req,res)=>{
 await User.findOne({username:req.body.username},async (err,docs)=>{
  if(err){
   console.log(err)
  }
   else if(docs){
    req.flash("danger","Username already exists");
    res.redirect("/register");
   }else{
    try{
     const hashedPassword = await bcrypt.hash(req.body.password,10);
      let user = new User({
       name:req.body.name,
      username:req.body.username,
       password:hashedPassword
      }) 

       await user.save();
       req.flash("success","User has been created");
       res.redirect("/login")
   
     }catch(err){
       res.redirect("/register");
     }
    }
  }) 
 })


// GET the LOGIN page----------------------------------------------------------------------
 authRouter.get("/login",checkNotAuthenticated,(req,res)=>{
  res.render("login",{title:'Login'});
 })


// PASSPORT STRATEGY--------------------USERNAME ----------------------PASSWORD-----------
// Post route to the login page for authenticating user

authRouter.post('/login', checkNotAuthenticated,
 passport.authenticate('local', {
   failureRedirect:"/login",
   failureFlash:true
 }),
 (req,res)=>{
  req.flash("success","Loggedd in");
  res.redirect("/user");
 }
);

// Serialise User
passport.serializeUser(function(user, done) {
 done(null, user.id);
});


// Deserialise User
passport.deserializeUser(function(id, done) {
 User.findById(id, function(err, user) {
   done(err, user);
 });
});



passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, async function(err, user) {
       if (err) { 
        throw err;
        }
       if (!user) {
         return done(null, false, {type:'danger', message: 'Username not Found, Please Register !' });
       }
       
      try{
        if( await bcrypt.compare(password,user.password)){
              return done(null,user,{message: 'You got it' });
           }else{
              return done(null,false,{type:'danger', message: 'Incorrect Password'})
            }
      }catch(err){
          return done(err);
      }
     });
    }
  ));


  
// Middleware for checking if user is authentiacated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/user')
  }
  next()
}


 
// Logout Rpute to the logged in user
 authRouter.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/login');
});


 return authRouter;
}