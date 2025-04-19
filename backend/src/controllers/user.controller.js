const User = require('../models/user.model');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    // Fields to update
    const fieldsToUpdate = {};
    
    // Allowed fields to update
    const allowedFields = [
      'name', 
      'position', 
      'skills', 
      'experience', 
      'bio', 
      'location', 
      'phone'
    ];
    
    // Add company for employers
    if (req.user.role === 'employer') {
      allowedFields.push('company');
    }
    
    // Add fields from request
    for (const field of allowedFields) {
      if (field in req.body) {
        fieldsToUpdate[field] = req.body[field];
      }
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get employer by ID (public profile)
// @route   GET /api/users/employers/:id
// @access  Public
exports.getEmployerById = async (req, res) => {
  try {
    const employer = await User.findOne({
      _id: req.params.id,
      role: 'employer'
    }).select('-__v');

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: 'Employer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get job seeker by ID (public profile)
// @route   GET /api/users/job-seekers/:id
// @access  Public
exports.getJobSeekerById = async (req, res) => {
  try {
    const jobSeeker = await User.findOne({
      _id: req.params.id,
      role: 'job-seeker'
    }).select('-__v');

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        message: 'Job seeker not found'
      });
    }

    res.status(200).json({
      success: true,
      data: jobSeeker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 