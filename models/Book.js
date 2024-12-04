const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    title: String,
    author: String,
    status: {
        type: String,
        enum: ['available', 'issued'],
        default: 'available'
    }
});

module.exports = mongoose.model('Book', bookSchema);
