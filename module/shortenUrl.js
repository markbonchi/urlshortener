const mongoose = require('mongoose');

const random = () => Math.floor(Math.random() * 20) + 1;

const { model, Schema } = mongoose;

const shortUrlSchema = new Schema({
    fullUrl: {
        type: String,
        required: true,
        // unique: true
    },
    shortUrl: {
        type: Number,
        required: true,
        unique: true,
        default: () => random()
    }
}) 


module.exports = model('shortUrl', shortUrlSchema);


