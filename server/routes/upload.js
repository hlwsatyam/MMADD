const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// Ensure upload directories exist
const uploadDirs = {
  posts: 'uploads/posts',
  profile: 'uploads/profile',
  logos: 'uploads/logos'
};

// Create directories if they don't exist
Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.baseUrl.includes('/images')) {
      cb(null, uploadDirs.posts);
    } else if (req.baseUrl.includes('/single')) {
      cb(null, uploadDirs.profile);
    } else {
      cb(null, uploadDirs.logos);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload multiple images
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
 
    console.log(req.files)
    const imageUrls = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/logos/${file.filename}`,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    }));
    
    res.json({ 
      success: true,
      message: 'Images uploaded successfully',
      imageUrls: imageUrls.map(img => img.path)
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to upload images' 
    });
  }
});

// Upload single image (logo/profile)
router.post('/single', upload.single('image'), async (req, res) => {
  console.log(req.body)
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }


        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/logos/${req.file.filename}`;
    await User.findByIdAndUpdate(
      req.body.ID,
      { profileImage: imageUrl },
      { new: true }
    );
    const fileInfo = {
      filename: req.file.filename,
      path: `/uploads/logos/${req.file.filename}`,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    };
    
 

    res.json({ 
      success: true,
      message: 'Image uploaded successfully',
      url: fileInfo.path
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to upload image' 
    });
  }
});

module.exports = router;