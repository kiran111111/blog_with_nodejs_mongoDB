const express = require('express');
const cartRouter = express.Router();
const mongoose = require("mongoose");
const ConnectDB = require("../config/db");
const productSchema = require("../models/cart");

const Product = mongoose.model("Products",productSchema);

module.exports = ()=>{


// GET the shopping CART with all the products----
 cartRouter.get('/shop/cart', function(req, res){
		// Get cart from session
		var cart = req.session.cart;
		var displayCart = {items: [], total:0};
		var total = 0;

		// Get Total
		for(var item in cart){
			displayCart.items.push(cart[item]);
			total += (cart[item].qty * cart[item].price);
		}
  displayCart.total = total;
  
  // Render Cart
  res.locals.CART = displayCart;
		res.render('cart')
	});
  


// POST  the selected product into the session object----
 cartRouter.post('/shop/cart/:id', async function(req, res){
		req.session.cart = req.session.cart || {};
		var cart = req.session.cart;

    var qty = req.body.qty;
		await Product.findOne({_id:req.params.id}, function(err, docs){
			if(err){
        console.log(err);
        req.flash("danger","Their was some error while Adding , Try Again!!")
			}

			if(cart[req.params.id]){
				cart[req.params.id].qty++
			} else {
				cart[req.params.id] = {
					item: docs._id,
					title: docs.title,
					price: docs.price,
					qty: qty
				}
   }
   
   req.flash("success","The Recipe is added to the cart")
   res.redirect('/shop/cart');
  //  res.send(cart[req.params.id])
		});
  });
  


// Route to the REMOVE PRODUCT path[------]
cartRouter.get("/shop/cart/remove/:id",(req,res)=>{
  var cart = req.session.cart;

  // Delete the choosen product from the object
  delete cart[req.params.id];

  // res.send(cart)
  req.flash("success","The item has been successfully removed")
  res.redirect("/shop/cart")
})



// Route to EMPTY the cart-----------------
cartRouter.get("/shop/cart/empty",(req,res)=>{
   req.session.cart ="";
   req.flash("success","The cart is Empty now")
   res.redirect("/shop/cart")
})






// GET the shopping PAGE
  cartRouter.get("/shop",async (req,res)=>{
   try{
    await Product.find({},(err,docs)=>{
      if(err){
       console.log(err)
      }
      else{
        console.log(`The list of blog is :${docs}`)
        res.locals.products = docs;
        res.render("shop")
      }
     })
    }
    catch(err){
      if(err){
       console.log(err)
      }
     }
  });



// GET the choosen product details=-----
  cartRouter.get("/shop/:id",async (req,res)=>{
   try{
    await Product.findById(req.params.id,(err,docs)=>{
      if(err){
       throw err;
      }else{
       res.locals.productChoosen = docs;
       res.render("shopInfo")
      }
    })
   }
   catch(err){
    throw err;
   }
  })

 


  



  return cartRouter;
}