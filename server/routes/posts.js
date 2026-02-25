const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User'); // Add this line
// Create post
router.post('/', auth, async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            category,
            images,
            logo,
            contactNumber
        } = req.body;
        
        const user = await User.findById(req.user.userId);
        
        const post = new Post({
            user: req.user.userId,
            title,
            description,
            price,
            category,
            images,
            logo,
            contactNumber: contactNumber || user.mobileNumber,
            location: {
                state: user.state,
                city: user.city,
                pincode: user.pincode,
                village: user.village
            }
        });
        
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

 




router.get('/', auth, async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const query = { status: 'active' };
        
        if (category && category !== 'all') query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        const posts = await Post.find(query)
            .populate('user', 'firstName lastName profileImage')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const count = await Post.countDocuments(query);
        
        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalPosts: count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// NEW: Get posts by specific category
router.get('/category/:category', auth, async (req, res) => {
    try {
        const { category } = req.params;
        const { search, page = 1, limit = 10, sortBy = 'newest' } = req.query;
        
        const query = { 
            status: 'active',
            category: category.toLowerCase() 
        };
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Sorting logic
        let sortOptions = { createdAt: -1 }; // default: newest first
        if (sortBy === 'price-low') {
            sortOptions = { price: 1 };
        } else if (sortBy === 'price-high') {
            sortOptions = { price: -1 };
        } else if (sortBy === 'views') {
            sortOptions = { views: -1 };
        }
        
        const posts = await Post.find(query)
            .populate('user', 'firstName lastName profileImage mobileNumber')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const count = await Post.countDocuments(query);
        
        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalPosts: count,
            category
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
// NEW: Get featured posts (for carousel/banner)
router.get('/featured', auth, async (req, res) => {
    try {
        const { limit = 4 } = req.query;
        
        // You can customize this query based on your criteria
        // For example: most viewed, newest, premium users, etc.
        const posts = await Post.find({ 
            status: 'active',
            // Example: Only show posts with images
            images: { $exists: true, $ne: [] }
        })
            .populate('user', 'firstName lastName profileImage subscriptionPlan')
            .sort({ 
                // Give priority to premium users' posts
                // 'user.subscriptionPlan': -1, // if you want to sort by subscription
                createdAt: -1 
            })
            .limit(parseInt(limit));
        
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});









// Get user's posts
router.get('/my-posts', auth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.userId })
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single post
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'firstName lastName mobileNumber profileImage subscriptionPlan');
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        // Increment views
        post.views += 1;
        await post.save();
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        if (post.user.toString() !== req.user.userId && req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;