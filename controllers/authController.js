const express = require('express');
const usersModel = require('../models/users-model');
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {generateToken} =require("../utils/generateToken")


module.exports.registerUser = async (req,res)=>{ 
  try{
      let{email,password,fullname} = req.body

      let user = await usersModel.findOne({email : email})
        if(user) return res.status(401).send("YOU ALREADY HAVE AN ACCOUNT")
         bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(password, salt,async function(err,hash){
                if(err) return res.send(err.message)
                else{
                let user = await usersModel.create({
                email,
                password: hash,
                fullname
             })
             let token = generateToken(user)
            res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
          });
res.redirect("/registered");
            }
        })
      })
  }
  catch(err){
    res.send(err.message)
  }
}

module.exports.loginUser = async function (req,res) {
  let {email , password } = req.body
  let user = await usersModel.findOne({email:email})
  if(!user) return res.send("Email or Password incorrect")
    bcrypt.compare(password,user.password,function(err,result){
      if(result){
        let token = generateToken(user)
        res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  meow:"meow meow",
  sameSite: "lax",
  path: "/",
});


        return res.redirect("/shop"); 
      }
      else{
        return res.send("Email or Password incorrect")
      }
    })
}
module.exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,     // Set to true in production with HTTPS
    sameSite: "lax",
    path: "/",
  });
  res.redirect("/");
};
