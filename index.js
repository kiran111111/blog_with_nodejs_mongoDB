if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
 }

const express = require("express");
const app= express();
const bodyParser =  require("body-parser");
const path = require("path");
const pug = require("pug");

const ConnectDB = require("./config/db");
// const port = process.env.PORT

const port = process.env.PORT;

const bcrypt = require("bcrypt")

const router = require("./routes/index")
const cartRouter = require("./routes/cart")
const authRouter = require("./routes/auth")


const fileUpload = require("express-fileupload");
const session = require("express-session");
const expressMessages = require("express-messages")
const flash = require("connect-flash");
const cookieParser = require("cookie-parser")
const {check,validationResult} = require("express-validator");

const passport = require("passport");


// Made the connection to the database
ConnectDB();

// Serving the static files to the server
app.use(express.static(__dirname + '/public'));
// app.use( express.static(path.join(__dirname, 'public')))


// Middlewares for using the requests body
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

// Setting the template engine
app.set("view engine","pug");
app.set("views",path.join(__dirname,"./views"))



// Middleware for the session 

app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave:true,
  saveUninitialized: true
 })
)

app.use(cookieParser());
// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.flashes = req.flash()
  next();
});

// @connect flash for flash Messages
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Middleware for uploading FIles
app.use(fileUpload())


// Setting up PASSPORT
app.use(passport.initialize());
app.use(passport.session());


// Express Validator Middleware
// app.use(expressValidator());

// Giving all the pages the same user
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
 });


// Setting the router module
app.use("/",router());
app.use("/",cartRouter());
app.use("/",authRouter());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.listen(port,()=>{
  console.log(`App is running at port : ${port}`)
})
