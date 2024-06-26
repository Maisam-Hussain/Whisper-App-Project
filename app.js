//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("Public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


console.log(process.env.API_KEY);


// connecting mongoose
mongoose.connect('mongodb://localhost:27017/userDB'); // Use {newUrlParser: true} if you get possible warning in the console.

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {
    secret: process.env.SECRET, 
    encryptedFields: ["password"]
});

const User = mongoose.model('User', userSchema);

app.get("/", function(req, res){
    res.render("home");
})
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});


// for registering to the page, we're gonna use the register route
app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });


    newUser.save()
        .then(()=>{
            res.render("secrets.ejs");
        })
        .catch((err)=>{
            console.log(err);
        });
});

// for logging in
app.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;


    User.findOne({email:username})
     .then((foundUser)=>{
        if(foundUser.password === password){
                res.render('secrets.ejs');
        }
     })
     .catch(err=>{
        console.log(err);
     });
});



app.listen(3000, function(){
    console.log("Server is running on port 3000");
});