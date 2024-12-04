const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

// 1. Get all available books
router.get('/available', async (req, res) => {
    try {
        const availableBooks = await Book.find({ status: 'available' });
        res.status(200).json(availableBooks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available books', error: error.message });
    }
});

// 2. Get a book by ISBN
router.get('/:isbn', async (req, res) => {
    try {
        const book = await Book.findOne({ ISBN: req.params.isbn });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error: error.message });
    }
});

// 3. Issue a book
router.post('/issue/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params; 
        const { borrower } = req.body;

        const book = await Book.findOne({ ISBN: isbn });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status === 'issued') {
            return res.status(400).json({ message: 'Book is already issued' });
        }

        const transaction = new Transaction({
            ISBN: isbn,
            borrower: borrower,
            issueDate: new Date(),
            returnDate: null
        });

        await transaction.save();
        book.status = 'issued';
        await book.save();

        res.status(200).json({
            message: 'Book issued successfully',
            transaction: transaction,
            book: book
        });

    } catch (error) {
        res.status(500).json({ message: 'Error issuing book', error: error.message });
    }
});


// 4. Return a book and update the transaction's return date
router.post('/return/:isbn', async (req, res) => {
    try {
        const { borrower } = req.body;
        const transaction = await Transaction.findOne({ ISBN: req.params.isbn, returnDate: null });

        if (!transaction || transaction.borrower.email !== borrower.email) {
            return res.status(400).json({ message: 'Transaction not found or borrower mismatch' });
        }

        transaction.returnDate = new Date();
        await transaction.save();
        const book = await Book.findOne({ ISBN: req.params.isbn });
        book.status = 'available';
        await book.save();

        res.status(200).json({ message: 'Book returned successfully', transaction: transaction });
    } catch (error) {
        res.status(500).json({ message: 'Error returning book', error: error.message });
    }
});

// 5. Delete a book
router.delete('/delete/:isbn', async (req, res) => {
    try {
        const deletedBook = await Book.findOneAndDelete({ ISBN: req.params.isbn });
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
});

module.exports = router;
