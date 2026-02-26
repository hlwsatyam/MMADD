const Ad = require('../models/Ad');
const fs = require('fs');
const path = require('path');

// ========== CREATE AD ==========
exports.createAd = async (req, res) => {
  try {
    const { title, subtitle, description, link, buttonText, backgroundColor, textColor, order, status } = req.body;

    // Check if image exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const image = `/uploads/${req.file.filename}`;

    const ad = await Ad.create({
      title,
      subtitle,
      description,
      image,
      link,
      buttonText,
      backgroundColor,
      textColor,
      order: order || 0,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== GET ALL ADS (with pagination) ==========
exports.getAllAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';

    // Build filter
    let filter = {};
    if (status !== 'all') {
      filter.status = status;
    }

    // Get total count
    const total = await Ad.countDocuments(filter);

    // Get ads
    const ads = await Ad.find(filter)
      .sort('order -createdAt')
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: ads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== GET ACTIVE ADS FOR PUBLIC ==========
exports.getActiveAds = async (req, res) => {
  try {
    const now = new Date();
    
    const ads = await Ad.find({
      status: 'active',
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: now } }
      ]
    }).sort('order -createdAt');

    res.status(200).json({
      success: true,
      count: ads.length,
      data: ads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== GET SINGLE AD ==========
exports.getAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== UPDATE AD ==========
exports.updateAd = async (req, res) => {
  try {
    let ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Update image if new file uploaded
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '../', ad.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      req.body.image = `/uploads/${req.file.filename}`;
    }

    ad = await Ad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Ad updated successfully',
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== DELETE AD ==========
exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '../', ad.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await ad.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== TRACK AD CLICK ==========
exports.trackClick = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    ad.clicks += 1;
    await ad.save();

    res.status(200).json({
      success: true,
      clicks: ad.clicks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== BULK DELETE ==========
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide ad IDs to delete'
      });
    }

    // Get all ads to delete their images
    const ads = await Ad.find({ _id: { $in: ids } });
    
    // Delete image files
    ads.forEach(ad => {
      const imagePath = path.join(__dirname, '../', ad.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Ad.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${ids.length} ads deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== UPDATE ORDER ==========
exports.updateOrder = async (req, res) => {
  try {
    const { orders } = req.body; // [{ id: '...', order: 1 }]
    
    for (const item of orders) {
      await Ad.findByIdAndUpdate(item.id, { order: item.order });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};