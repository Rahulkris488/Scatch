const express = require('express');
const router = express.Router();
const flash = require("connect-flash");
const isLoggedin = require('../middlewares/isLoggedin');
const Product = require('../models/product-model');
const usersModel = require('../models/users-model');

router.get("/",function(req,res){
    let error=req.flash("error")
    res.render('index',{ error , isLoggedin : false})
})

router.get("/shop", isLoggedin, async function (req, res) {
    
 try {
        let success = req.flash("success");
        let error = req.flash("error")
        const products = await Product.find({});
        
        const processedProducts = products.map(product => {
            return {
                ...product._doc,
                imageBase64: product.image ? product.image.toString("base64") : ""
            };
        });

        res.render("shop", { products: processedProducts ,success,error});
    } catch (err) {
        console.error("Error fetching products:", err);
        res.render("shop", { products: []}); 
    }
});
router.get("/addtocart/:id",isLoggedin,async function(req,res){
 let user = await usersModel.findOne({email :req.user.email})
    let AlreadyInCart = user.cart.find((item) => item == req.params.id)
 if(AlreadyInCart){
     req.flash("error","Product already in cart")
     return res.redirect("/shop")}
 user.cart.push(req.params.id)
 await user.save()
 req.flash("success","Product added to cart")
 res.redirect("/shop")
})

router.get("/cart",isLoggedin,async function(req,res){
    try {let user = await usersModel.findOne({email :req.user.email}).populate("cart")
    let totalAmount = 0;
    let totalDiscount = 0;
    user.cart.forEach(product => {
      totalAmount += product.price;
      totalDiscount += product.discount || 0
    });

    let platformFee = 20;
    let shippingFee = 0
    let grandTotal =  totalDiscount + platformFee + shippingFee;
    let totalDiscount1 = totalAmount - totalDiscount-platformFee;
const processedProducts = user.cart.map(product => ({
      ...product._doc,
      imageBase64: product.image ? product.image.toString("base64") : ""
    }));
    let success = req.flash("success");
    let error = req.flash("error");
     res.render("cart", {
      product: processedProducts,
      success,
      error,
      totalAmount,
      discount: totalDiscount,
      platformFee,
      shippingFee,
      grandTotal,
      totalDiscount1
    })}
catch (err) {
    console.error("Error fetching cart:", err);
    res.render("cart", {
      product: [],
      success: [],
      error: [],
      totalAmount: 0,
      discount: 0,
      platformFee: 0,
      shippingFee: 0,
      grandTotal: 0,
      totalDiscount1: 0
    });
  }
})
router.get("/remove/:id",isLoggedin,async function(req,res){
    let user = await usersModel.findOne({email :req.user.email})
    let productIndex = user.cart.indexOf(req.params.id)
    if(productIndex == -1){
        req.flash("error","Product not found in cart")
        return res.redirect("/cart")
    }
    user.cart.splice(productIndex,1)
    await user.save()
    req.flash("success","Product removed from cart")
    res.redirect("/cart")
})
router.get("/checkout",isLoggedin,async function (req,res){
    try {let user = await usersModel.findOne({email :req.user.email}).populate("cart")
    let totalAmount = 0;
    let totalDiscount = 0;
    user.cart.forEach(product => {
      totalAmount += product.price;
      totalDiscount += product.discount || 0
    });

    let platformFee = 20;
    let shippingFee = 0
    let grandTotal =  totalDiscount + platformFee + shippingFee;
    let totalDiscount1 = totalAmount - totalDiscount-platformFee;
const processedProducts = user.cart.map(product => ({
      ...product._doc,
      imageBase64: product.image ? product.image.toString("base64") : ""
    }));
    let success = req.flash("success");
    let error = req.flash("error");
     res.render("checkout", {
      product: processedProducts,
      success,
      error,
      totalAmount,
      discount: totalDiscount,
      platformFee,
      shippingFee,
      grandTotal,
      totalDiscount1
    })}
catch (err) {
    console.error("Error fetching cart:", err);
    res.render("checkout", {
      product: [],
      success: [],
      error: [],
      totalAmount: 0,
      discount: 0,
      platformFee: 0,
      shippingFee: 0,
      grandTotal: 0,
      totalDiscount1: 0
    });
  }
})
router.post("/placeorder",isLoggedin,async function(req,res){
    let user = await usersModel.findOne({email :req.user.email})
    user.cart = []
    await user.save()
    req.flash("success","Order placed successfully")
    res.render("placeorders",)
})
router.get("/registered",function(req,res){

    res.render("registered")
}
)
module.exports= router;
