const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');





router.get('/all-users',   async (req, res) => {
    try {
        const users = await User.find({ profileCompleted: true })
            .select('firstName lastName caste mobileNumber address village city lookingForJob canProvideJob profileImage')
            .sort({ createdAt: -1 });
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});









// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-googleId');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete profile
router.put('/complete-profile', auth, async (req, res) => {
    try {
        const {
            mobileNumber,
            address,canProvideJob,lookingForJob,
            pincode,
            village,
            caste,
            firstName,
            lastName
        } = req.body;
        
        // Get state and city from pincode
        const pincodeResponse = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        const pincodeData = pincodeResponse.data[0];
        
        if (pincodeData.Status !== 'Success') {
            return res.status(400).json({ error: 'Invalid pincode' });
        }
        
        const state = pincodeData.PostOffice[0].State;
        const city = pincodeData.PostOffice[0].District;
        
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                mobileNumber,
                address,lookingForJob,canProvideJob,
                pincode,
                state,
                city,
                village,
                caste,
                firstName,
                lastName,
                profileCompleted: true
            },
            { new: true }
        ).select('-googleId');
        
        res.json(user);
    } catch (error) {   console.log(error)
        res.status(500).json({ error: error.message });
    }
}); 

// Update profile
router.put('/update-profile', auth, async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true }
        ).select('-googleId');
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upgrade subscription
router.put('/upgrade-subscription', auth, async (req, res) => {
    try {
        const { plan } = req.body;
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year subscription
        
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                subscriptionPlan: plan,
                subscriptionExpiry: expiryDate
            },
            { new: true }
        ).select('-googleId');
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;