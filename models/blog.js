// @Has the Blog Schema

const mongo = require("mongo");
const mongoose = require("mongoose");


const blogSchema = mongoose.Schema({
 title:{
  type:String
 },
 date:{
  type: Date
 },
 description:{
  type:String
 },
 content:{
  type:String
 },
name:{
  type:String
 },
 file:{
  type:String,
  default:""
 }
})


module.exports = blogSchema;