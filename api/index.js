const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const http = require("http"); // Import the message model

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


mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,  // These are added to remove deprecation warnings
    useUnifiedTopology: true    // These are added to remove deprecation warnings

}).then(() => {
    console.log("Connected to Mongo DB");
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
}); // Connect mongoose to our database

const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log("User disconnected");
    })
    socket.on('messageTo', msg => {
        console.log('messageTo' + msg);
        io.emit(`${msg.recipientId}`, msg);
    })
})
server.listen(port, () => {
    console.log("Server is running on port: " + port);
});


const User = require('./models/user'); // Import the user model
const Message = require('./models/message');

const multer = require("multer"); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const storage = multer.diskStorage({ // Create a storage location for the files
    destination: function (req, file, cb) {
        cb(null, 'files/') // Specify the upload directory
    },
    filename: function (req, file, cb) { // Specify the file name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // Create a unique file name
        cb(null, uniqueSuffix + "-" + file.originalname)
    }
});
const upload = multer({storage: storage}); // Create an upload object

//endpoints for registeration of the user
app.post("/register", upload.single("avatar"), async (req, res) => {
    const {name, email, password} = req.body; // Destructuring assignment
    // Create a new user object
    const newUser = new User({
        name: name,
        email: email,
        password: password,
        image: req.file.path,
    })
    //check if the email and password are provided
    if (!email || !password) {
        return res.status(404).json({message: "Email and Password are required"});
    }
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
app.get("/users/:userId", (req, res) => {
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
        sender.sentFriendRequests = sender.sentFriendRequests.filter((request) => request.toString() !== recipientId.toString())
        //update the recipient's friendList
        recipient.friends.push(senderId)
        recipient.friendRequests = recipient.friendRequests.filter((request) => request.toString() !== senderId.toString())

        await sender.save();
        await recipient.save();
        res.status(200).json({message: "Friend Request Accepted Successfully"});
    } catch (error) {
        console.log("Error accepting friend request" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

//endpoint to access all the friends of a user
app.get("/accepted-friends/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        const users = await User.findById(userId).populate("friends", "name email image")
        const acceptedFriends = users.friends;
        res.json(acceptedFriends);
    } catch (error) {
        console.log("Error Endpoint to access all the friends of a user: " + error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

//endpoint to post a message
app.post("/message", upload.single("imageFile"), async (req, res) => {
    try {
        const {senderId, recipientId, messageType, messageText} = req.body;
        const newMessage = new Message({
            senderId: senderId,
            recipientId: recipientId,
            messageType: messageType,
            messageText: messageText,
            timeStamps: new Date().getTime(),
            imageURL: messageType === 'image' ? req.file.path : null
        })
        await newMessage.save();
        res.status(200).json({message: "Message sent successfully"});
    } catch (error) {
        console.log("Error posting a message" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
})


//endpoint to get picture
app.get("/image/:imagePath", (req, res) => {
    const {imagePath} = req.params;
    res.sendFile(__dirname + "/files/" + imagePath);
})

//endpoint to get the user details to design the chat Room header
app.get("/user/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        // fetch the user document based on the userId
        const userDetails = await User.findById(userId);
        res.status(200).json({name: userDetails.name, image: userDetails.image});
    } catch (error) {
        console.log("Error getting the user details" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

//endpoint to fetch all the messages between two users
app.get("/messages/:senderId/:recipientId", async (req, res) => {
    try {
        const {senderId, recipientId} = req.params;
        const messages = await Message.find({
            $or: [
                {senderId: senderId, recipientId: recipientId},
                {senderId: recipientId, recipientId: senderId}
            ]
        }).populate("senderId", "_id name");
        res.status(200).json({messages});
    } catch (error) {
        console.log("Error fetching all the messages between two users" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

//endpoints to delte the message
app.post("/delete-message", async (req, res) => {
    try {
        const {messageId} = req.body;
        if (!Array.isArray(messageId) || messageId.length === 0) {
            return res.status(400).json({message: "Invalid messageId"});
        }
        await Message.deleteMany({_id: {$in: messageId}});
        res.status(200).json({message: "Message deleted successfully"});
    } catch (error) {
        console.log("Error deleting the message" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

app.get("/friend-requests/sent/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId).populate("sentFriendRequests", "name email image")
        const sentFriendRequests = user.sentFriendRequests;
        res.status(200).json(sentFriendRequests);
    } catch (error) {
        console.log("Error getting friend requests sent" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

app.get("/friends/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        User.findById(userId).populate("friends", "name email image").then((user) => {
            if (!user) {
                return res.status(404).json({message: "User not found"})
            }
            const friendsIds = user.friends.map((friend) => friend._id);
            res.status(200).json(friendsIds);
        })
    } catch (error) {
        console.log("Error getting friends" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
})