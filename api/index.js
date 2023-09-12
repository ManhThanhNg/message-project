const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config(); // This is how we read the variables stored in .env file

const app = express(); // Initialize the app
const port = process.env.PORT;
const cors = require('cors');   // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(cors()); // Use this after the variable declaration

app.use(bodyParser.urlencoded({extended: false}));// Parses urlencoded bodies
app.use(bodyParser.json()); // Body parser use JSON data
app.use(passport.initialize()); // Used to initialize passport
const jwt = require('jsonwebtoken');
const {stringify} = require("nodemon/lib/utils"); // used to create, sign, and verify tokens

mongoose.connect(process.env.DB_URI,
    {
        useNewUrlParser: true,  // These are added to remove deprecation warnings
        useUnifiedTopology: true    // These are added to remove deprecation warnings

    }
).then(() => {
    console.log("Connected to Mongo DB");
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
}); // Connect mongoose to our database

app.listen(port, () => {
    console.log("Server listening on port " + port);
}); // Tell express to listen on port

const User = require('./api/models/user.js'); // Import the user model
const Message = require('./api/models/message.js'); // Import the message model

//endpoints for registeration of the user
app.post("/register", (req, res) => {
    const {name, email, password, image} = req.body; // Destructuring assignment

    //CREATE NEW USER OBJECT
    const newUser = new User({
        name, email, password, image
    })

    //Save the user to the database
    newUser.save().then(()=>{
        res.status(200).json({message: "User created successfully"});
    }).catch((err)=>{
        console.log("Error registering the User" + err);
        res.status(500).json({message: "Error registering the User"});
    })

});