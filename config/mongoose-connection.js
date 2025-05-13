const mongoose = require('mongoose')
const debuger = require("debug")("development:mongoose")
const config = require("config")

mongoose.connect(`${config.get("MONGODB_URI")}/scatch`)
.then(function(){
    debuger(" db connected ")   
})
.catch((err)=>{
    debuger(err)
})

module.exports= mongoose.connection;