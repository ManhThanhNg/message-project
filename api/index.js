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
            console.log("User " + user.name + " logged in successfully");
            res.status(200).json({token})
        } catch (err) {
            console.log("Error logging in the User" + err);
            res.status(500).json({message: "Internal Server Error"});
        }
    });
})

//endpoint to access all the users except the user who's is currently logged in
app.get("/user/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;
    User.find({_id: {$ne: loggedInUserId}})
        .then((users) => {
            res.status(200).json({users});
        })
        .catch((error) => {
            console.log("Error getting users" + error);
            res.status(500).json({message: "Internal Server Error"});
        })
})

//endpoint to send a request to a user
app.post("/friend-request", async (req, res) => {
    const {currentUserId, selectedUserId} = req.body;
    try {
        //update the recipient's friendRequestArray
        await User.findByIdAndUpdate(selectedUserId, {
            $push: {friendRequests: currentUserId}
        })

        //update the sender's friendRequestSentArray
        await User.findByIdAndUpdate(currentUserId, {
            $push: {sentFriendRequests: selectedUserId}
        })

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

//endpoint to get all the friend requests of a user
app.get("/friend-request/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        //fetch the user document based on the UserId
        const user = await User.findById(userId).populate("friendRequests", "name email image").lean();
        const friendRequests = user.friendRequests;
        res.json({friendRequests});
    } catch (error) {
        console.log("Error getting friend requests" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
});

//endpoint to accept a friend-request user2user
app.post("/friend-request/accept", async (req, res) => {
    try {
        const {senderId, recipientId} = req.body;
        // retrieve the documents of sender and the recipient
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        //update the sender's friendList
        sender.friends.push(recipientId)
        sender.sentFriendRequests = sender.sentFriendRequests.filter(
            (request) => request.toString() !== recipientId.toString())
        //update the recipient's friendList
        recipient.friends.push(recipientId)
        recipient.friendRequests = recipient.friendRequests.filter(
            (request) => request.toString() !== senderId.toString())

        await sender.save();
        await recipient.save();
        res.status(200).json({message: "Friend Request Accepted Successfully"});
    } catch (error) {
        console.log("Error accepting friend request" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

//endpoint to access all the friends of a user
app.get("/accepted-friends/:userId",async (req,res)=>{
    
})