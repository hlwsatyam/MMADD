const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Signin
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    console.log('Received Google token for verification' ,  token);
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email, sub: googleId, name, picture } = ticket.getPayload();
    
    console.log('Google user verified:', { email, name });
    
    let user = await User.findOne({ 
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });
    
    if (!user) {
      console.log('Creating new user for:', email);
      user = new User({
        googleId,
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
        profileImage: picture,
        profileCompleted: false
      });
      await user.save();
    } else {
      console.log('Existing user found:', user.email);
    }
    
    const jwtToken = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('JWT token generated for user:', user.email);
    
    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileCompleted: user.profileCompleted,
        userType: user.userType,
        profileImage: user.profileImage,
        subscriptionPlan: user.subscriptionPlan
      }
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Authentication failed' 
    });
  }
});

 

module.exports = router;