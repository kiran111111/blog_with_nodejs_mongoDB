// @Has the product Schema for cart

const mongo = require("mongo");
const mongoose = require("mongoose");



const productSchema = mongoose.Schema({
 title:{
  type:String
 },
 price:{
  type:Number
 },
 description:{
  type:String
 },
 file:{
  type:String,
  default:""
 }
})



module.exports = productSchema;