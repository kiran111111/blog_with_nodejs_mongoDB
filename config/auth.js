// Connecting to Database

const mongo = require("mongo");
const mongoose = require("mongoose");

// @Set up the URI as an env variable----
// const db = process.env.mongoURI;
const db = "mongodb+srv://kiran:kiran@cluster0-zrsby.mongodb.net/test?retryWrites=true&w=majority";


const ConnectDB = async ()=>{
  try{
     await mongoose.connect(db,{
       useNewUrlParser:true,
       useUnifiedTopology:true
     })
     console.log(' Connected to Mongo Database ')
  }catch(err){
   console.log("Error occured in connecting to the database");
   process.exit(1);
  }
}

module.exports = ConnectDB;