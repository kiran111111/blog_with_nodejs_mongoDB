const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ConnectDB = require("../config/db");
const blogSchema = require("../models/blog");
const passport = require("passport");
const Blog = mongoose.model("BlogPosts",blogSchema);

module.exports = ()=>{

// Get the Main  Blog Page with all the Recipes uploaded
router.get("/",checkNotAuthenticated ,async (req,res)=>{
 try{
 await Blog.find({},(err,docs)=>{
   if(err){
    console.log(err)
   }
   else{
     res.locals.blogList = docs;
     res.render("blog")
   }
  })
 }
 catch(err){
   if(err){
    console.log(err)
   }
  }
})


// Route to the About Page
router.get("/about",checkNotAuthenticated,(req,res)=>{
  res.render("about")
})


// GET the contact page
router.get("/contact",checkNotAuthenticated,(req,res)=>[
  res.render("contact")
])


// Get route on form route
router.get("/form",(req,res)=>{
 res.render("add");
})



// Post Recipes  on Form Route and redirect to the main page
router.post("/form",(req,res)=>{
  insertRecords(req,res);
})


// Function for inserting Recipes-----------
const insertRecords = async (req,res)=>{  

let file = req.files.file;
let fileaname ="";
filename = file.name;
let uploadDir = "./public/uploads/";

file.mv(uploadDir+filename,(err)=>{
  if(err){
    throw err;
  }
})


 let blog = new Blog({
  title:req.body.title,
  date :req.body.date,
  name:req.body.name,
  description:req.body.description,
  content:req.body.content,
  file:`/uploads/${filename}`
 })

 req.body = blog;

 try{
  await blog.save(err=>{
   if(err){
    throw err;
   }
   else{
    req.flash("success","A new Recipe has been inserted") 
    res.redirect("/");
   }
  })
 }catch(err){
  if(err){
   console.log(err);
  }
 }
}  







// This is a route to a particular Recipe --- directed by the Id of a blog
router.get("/post/:id",async(req,res)=>{
 // res.send('this is the blogPost page')
 try{
 await Blog.findById(req.params.id,(err,docs)=>{
  if(err){
   console.log(err)
   }
   else{
    res.locals.viewBlog = docs;
    res.render("post");
   }
  })
 }
catch(err){
 throw err;
 }
 
})


// GET THE list of all blogs under the administration level
router.get("/admin",async (req,res)=>{
 try{
  await Blog.find({},(err,docs)=>{
    if(err){
     console.log(err)
    }
    else{
      res.locals.allBlogs = docs;
      res.render("admin")
    }
   })
  }
  catch(err){
    if(err){
     console.log(err)
    }
   }
})



// Route for viwing the details in the Admin Authorisation by ID
router.get("/admin/view/:id",(req,res)=>{
  Blog.findById(req.params.id,(err,docs)=>{
   if(err){
     throw err;
   }else{
    res.locals.blog = docs;
    res.render("view")
   }
  })
})




// Middlewares for Deleting Recipes--------
router.get("/admin/view/delete/:id",(req,res)=>{
 let query = { _id: req.params.id };
  Blog.deleteOne(query,(err,blog)=>{
   if(err){
     throw err;
   }else{
   req.flash("danger","The selected Recipe was Deleted")
    res.redirect("/admin");
   }
  })
})


// Middleware for editing data of a recipe


router.get("/admin/view/edit/:id",async (req,res)=>{
 await Blog.findById(req.params.id, function(err, docs) {
   if(err){
     throw err;
   }else{
    res.locals.blog=docs;
   res.render('edit')
   }
 });
})

router.post("/admin/view/edit/:id",(req,res)=>{
 updateRecords(req,res)
})

// Function for Updating a Recipe 
const updateRecords = async (req,res)=>{

let file = req.files.file;
let fileaname ="";
filename = file.name;
let uploadDir = "./public/uploads/";

file.mv(uploadDir+filename,(err)=>{
  if(err){
    throw err;
  }
})
  
  let blog = {};
    blog.name = req.body.name;
    blog.description = req.body.description;
    blog.date = req.body.date;
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.file = `/uploads/${filename}`;
   
  
    let query = { _id: req.params.id };
  
    await Blog.updateOne(query,blog,(err,blog)=>{
      if(err){
        throw err;
      }else{
    req.flash("success","The Recipe has been updated")
    res.redirect("/")    
      }
   })
 
}


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



return router;
}

