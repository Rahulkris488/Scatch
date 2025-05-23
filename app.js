const cookieParser = require("cookie-parser");
const express = require("express")
const app=express();
const ownerRouter = require("./routes/ownersRouter")
const userRouter = require("./routes/usersRouter")
const productsRouter = require("./routes/productsRouter")
const indexRouter = require("./routes/indexRouter")
const expressSession = require("express-session")
const flash = require("connect-flash")
require("dotenv").config()
const path = require("path");
const db = require("./config/mongoose-connection");
const productModel = require("./models/product-model");


app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine", "ejs");
app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
)



app.use(flash())
app.use("/owners",ownerRouter)
app.use("/users",userRouter)
app.use("/products",productsRouter)
app.use("/",indexRouter)
app.listen(3000)