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

const User = require('./models/user'); // Import the user model
const Message = require('./models/message'); // Import the message model

//endpoints for registeration of the user
app.post("/register", (req, res) => {
    const {name, email, password, image} = req.body; // Destructuring assignment
    console.log(req.body);
    //CREATE NEW USER OBJECT
    const newUser = new User({
        name, email, password, image
    })

    //Save the user to the database
    newUser.save().then(() => {
        console.log("User created successfully");
        res.status(200).json({message: "User created successfully"});
    }).catch((err) => {
        console.log("Error registering the User" + err);
        res.status(500).json({message: "Error registering the User"});
    })
});
const createToken = (userId) => {
    const payload = {userId: userId}; // Create a payload
    return jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: '1h'}) // Sign the token with a secret key and a payload and define an expiration time
}

//endpoints for login of the user
app.post("/login", (req, res) => {
    const {email, password} = req.body;

    //check if the email and password are provided
    if (!email || !password) {
        return res.status(404).json({message: "Email and Password are required"});
    }

    //check if user exists in DBs
    User.findOne({email}).then((user) => {
        if (!user) {
            // user not found
            return res.status(404).json({message: "User not found"})
        }

        //check if password matches
        if (user.password !== password) {
            return res.status(401).json({message: "Incorrect Password"})
        }

        // function to create token for the user


        const token = createToken(user._id);
        try {
            console.log("User "+ user.name+ " logged in successfully");
            res.status(200).json({token})
        } catch (err) {
            console.log("Error logging in the User" + err);
            res.status(500).json({message: "Internal Server Error"});
        }
    });
})