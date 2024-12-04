const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    ISBN: { type: String, required: true }, // ISBN of the book
    borrower: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: Number, required: true }
    },
    issueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null }, // Return date is optional initially
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
