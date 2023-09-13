const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        recepientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String,
            enum: ['text', 'image'],
        },
        message: String,
        imageURL: String,
        timeStamps: {
            type: Date,
            default: Date.now
        }
    }
);

const Message = mongoose.model("Message", messageSchema); // Create a model from the schema and export it

module.exports = Message; // Export the model