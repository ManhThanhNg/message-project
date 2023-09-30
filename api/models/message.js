const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        messageType: {
            type: String,
            enum: ['text', 'image'],
        },
        messageText: String,
        imageURL: String,
        timeStamps: {
            type: Date,
            default: Date.now
        }
    }
);

const Message = mongoose.model("Message", messageSchema); // Create a model from the schema and export it

module.exports = Message; // Export the model