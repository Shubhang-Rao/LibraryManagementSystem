const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// 1. Add a new member
router.post('/add', async (req, res) => {
    try {
        const { name, email, mobile } = req.body;
        const newMember = new Member({ name, email, mobile });
        await newMember.save();
        res.status(201).json({ message: 'Member added successfully', member: newMember });
    } catch (error) {
        res.status(500).json({ message: 'Error adding member', error: error.message });
    }
});

// 2. Update a member's details (mobile or email or name)
router.put('/update/:id', async (req, res) => {
    try {
        const { name, email, mobile } = req.body;
        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id,
            { name, email, mobile },
            { new: true }
        );
        if (!updatedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json({ message: 'Member updated successfully', member: updatedMember });
    } catch (error) {
        res.status(500).json({ message: 'Error updating member', error: error.message });
    }
});

// 3. Delete a member
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedMember = await Member.findByIdAndDelete(req.params.id);
        if (!deletedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json({ message: 'Member deleted successfully', member: deletedMember });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting member', error: error.message });
    }
});

module.exports = router;
