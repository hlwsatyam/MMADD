const Affiliate = require('../models/Affiliate');

// Create new affiliate
exports.createAffiliate = async (req, res) => {
  try {
    const { name, email, phone, description, affiliateLink } = req.body;
    
    // Check if email already exists
    const existingEmail = await Affiliate.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Check if affiliate link already exists
    const existingLink = await Affiliate.findOne({ affiliateLink });
    if (existingLink) {
      return res.status(400).json({
        success: false,
        message: 'Affiliate link already exists'
      });
    }
console.log(req.file)
console.log(req.files)
    // Get image path
 if (!req.file) {
  return res.status(400).json({
    success: false,
    message: 'Image is required'
  });
}
const image = `/uploads/${req.file.filename}`;

    const affiliate = await Affiliate.create({
      name,
      email,
      phone,
      description,
      affiliateLink,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Affiliate created successfully',
      data: affiliate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all affiliates with pagination
exports.getAllAffiliates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || 'all';

    // Build filter object
    let filter = {};
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status !== 'all') {
      filter.status = status;
    }

    // Get total count for pagination
    const total = await Affiliate.countDocuments(filter);

    // Get affiliates with pagination
    const affiliates = await Affiliate.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: affiliates,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single affiliate
exports.getAffiliate = async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: affiliate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update affiliate
exports.updateAffiliate = async (req, res) => {
  try {
    let affiliate = await Affiliate.findById(req.params.id);
    
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate not found'
      });
    }

    // Check email uniqueness if being updated
    if (req.body.email && req.body.email !== affiliate.email) {
      const existingEmail = await Affiliate.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Check affiliate link uniqueness if being updated
    if (req.body.affiliateLink && req.body.affiliateLink !== affiliate.affiliateLink) {
      const existingLink = await Affiliate.findOne({ affiliateLink: req.body.affiliateLink });
      if (existingLink) {
        return res.status(400).json({
          success: false,
          message: 'Affiliate link already exists'
        });
      }
    }

    // Update image if new file uploaded
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    affiliate = await Affiliate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Affiliate updated successfully',
      data: affiliate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete affiliate
exports.deleteAffiliate = async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate not found'
      });
    }

    await affiliate.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Affiliate deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Increment click count
exports.trackClick = async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate not found'
      });
    }

    affiliate.clicks += 1;
    await affiliate.save();

    res.status(200).json({
      success: true,
      clicks: affiliate.clicks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bulk delete affiliates
exports.bulkDeleteAffiliates = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide affiliate IDs to delete'
      });
    }

    await Affiliate.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${ids.length} affiliates deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update affiliate status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const affiliate = await Affiliate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: affiliate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};